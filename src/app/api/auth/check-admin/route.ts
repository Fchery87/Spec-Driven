import { NextRequest, NextResponse } from 'next/server';
import { betterFetch } from '@better-fetch/fetch';
import { db } from '@/backend/lib/drizzle';
import { users } from '@/backend/lib/schema';
import { eq } from 'drizzle-orm';

interface SessionData {
  user: {
    id: string;
    email: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    // Get session to identify user
    const { data: session } = await betterFetch<SessionData>(
      '/api/auth/get-session',
      {
        baseURL: request.nextUrl.origin,
        headers: {
          cookie: request.headers.get('cookie') || '',
        },
      }
    );

    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        isAdmin: false,
        error: 'Not authenticated' 
      });
    }

    // Fetch role directly from database to avoid stale session issues
    const [user] = await db
      .select({ role: users.role })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1);

    if (!user) {
      return NextResponse.json({ 
        success: false, 
        isAdmin: false,
        error: 'User not found' 
      });
    }

    const isAdmin = user.role === 'admin' || user.role === 'super_admin';
    const isSuperAdmin = user.role === 'super_admin';

    return NextResponse.json({
      success: true,
      isAdmin,
      isSuperAdmin,
      role: user.role,
    });
  } catch (error) {
    console.error('Check admin error:', error);
    return NextResponse.json(
      { success: false, isAdmin: false, error: 'Failed to check admin status' },
      { status: 500 }
    );
  }
}
