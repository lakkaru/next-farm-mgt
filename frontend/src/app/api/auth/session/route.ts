import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL;

/**
 * Server-side session check endpoint
 * Validates auth token and returns user data
 * GET /api/auth/session
 */
export async function GET(request: NextRequest) {
  if (!API_URL) {
    return NextResponse.json(
      { authenticated: false, error: 'API URL not configured' },
      { status: 500 }
    );
  }

  try {
    // Check for token in cookie first, then Authorization header
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get('auth-token')?.value;
    const headerToken = request.headers.get('Authorization')?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;

    if (!token) {
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    // Validate token with backend
    const response = await fetch(`${API_URL}/users/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid, clear cookie
      if (cookieToken) {
        cookieStore.delete('auth-token');
      }
      return NextResponse.json(
        { authenticated: false, user: null },
        { status: 200 }
      );
    }

    const userData = await response.json();

    return NextResponse.json({
      authenticated: true,
      user: userData.data || userData,
    });
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { authenticated: false, error: 'Session validation failed' },
      { status: 500 }
    );
  }
}
