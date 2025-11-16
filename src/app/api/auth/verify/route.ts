import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';
import { extractToken } from '@/backend/middleware/auth_middleware';
import { authService } from '@/backend/services/auth/auth_service';

export const runtime = 'nodejs';

/**
 * POST /api/auth/verify
 *
 * Verify a JWT token and return the current user
 * Headers: Authorization: Bearer <token>
 *
 * Returns:
 * - 200: Token is valid, user info returned
 * - 400: No token provided
 * - 401: Invalid or expired token
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const token = extractToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'No authentication token provided'
        },
        { status: 400 }
      );
    }

    const user = await authService.getCurrentUser(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid or expired token'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Token is valid',
        user
      },
      { status: 200 }
    );
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger.error('Token verification error:', err);
    return NextResponse.json(
      {
        success: false,
        message: `Verification failed: ${err.message}`
      },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS endpoint for CORS preflight
 */
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
