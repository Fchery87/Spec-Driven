import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/lib/drizzle';
import { users, projects } from '@/backend/lib/schema';
import { eq, count, desc } from 'drizzle-orm';
import { withAdminAuth, isSuperAdmin, AuthSession } from '@/app/api/middleware/auth-guard';

async function getUsers() {
  const allUsers = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  const usersWithProjectCount = await Promise.all(
    allUsers.map(async (user: typeof allUsers[number]) => {
      const [projectCount] = await db
        .select({ count: count() })
        .from(projects)
        .where(eq(projects.ownerId, user.id));
      return {
        ...user,
        projectCount: projectCount.count,
      };
    })
  );

  return usersWithProjectCount;
}

export const GET = withAdminAuth(async () => {
  try {
    const userList = await getUsers();
    return NextResponse.json({ success: true, data: userList });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
});

export const PATCH = withAdminAuth(async (request: NextRequest, _context, session: AuthSession) => {
  try {
    const body = await request.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { success: false, error: 'User ID and role are required' },
        { status: 400 }
      );
    }

    if (!['user', 'admin', 'super_admin'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Only super_admin can promote to super_admin or demote from super_admin
    if (role === 'super_admin' && !isSuperAdmin(session)) {
      return NextResponse.json(
        { success: false, error: 'Only super admins can assign super admin role' },
        { status: 403 }
      );
    }

    // Prevent self-demotion for super_admins
    if (userId === session.user.id && session.user.role === 'super_admin' && role !== 'super_admin') {
      return NextResponse.json(
        { success: false, error: 'Cannot demote yourself from super admin' },
        { status: 400 }
      );
    }

    const [targetUser] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, userId));

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Only super_admin can modify super_admin users
    if (targetUser.role === 'super_admin' && !isSuperAdmin(session)) {
      return NextResponse.json(
        { success: false, error: 'Cannot modify super admin users' },
        { status: 403 }
      );
    }

    await db
      .update(users)
      .set({ role, updatedAt: new Date() })
      .where(eq(users.id, userId));

    return NextResponse.json({ success: true, message: 'User role updated' });
  } catch (error) {
    console.error('Failed to update user:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update user' },
      { status: 500 }
    );
  }
});
