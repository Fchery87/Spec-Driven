import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/backend/lib/drizzle';
import { settings } from '@/backend/lib/schema';
import { eq, like } from 'drizzle-orm';
import { withAdminAuth } from '@/app/api/middleware/auth-guard';

export const GET = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const prefix = searchParams.get('prefix');

    let query = db.select().from(settings);
    
    if (prefix) {
      query = query.where(like(settings.key, `${prefix}%`)) as typeof query;
    }

    const allSettings = await query;

    const settingsMap: Record<string, string> = {};
    allSettings.forEach((s: { key: string; value: string }) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({ success: true, data: settingsMap });
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
});

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Key and value are required' },
        { status: 400 }
      );
    }

    const existing = await db
      .select()
      .from(settings)
      .where(eq(settings.key, key))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(settings)
        .set({ value: String(value), updatedAt: new Date() })
        .where(eq(settings.key, key));
    } else {
      await db.insert(settings).values({
        key,
        value: String(value),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, message: 'Setting updated' });
  } catch (error) {
    console.error('Failed to update setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update setting' },
      { status: 500 }
    );
  }
});

export const DELETE = withAdminAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Key is required' },
        { status: 400 }
      );
    }

    await db.delete(settings).where(eq(settings.key, key));

    return NextResponse.json({ success: true, message: 'Setting deleted' });
  } catch (error) {
    console.error('Failed to delete setting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete setting' },
      { status: 500 }
    );
  }
});
