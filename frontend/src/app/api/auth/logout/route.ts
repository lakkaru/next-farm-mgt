import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Server-side logout endpoint
 * Clears HTTP-only auth cookie
 * POST /api/auth/logout
 */
export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the auth cookie
    cookieStore.delete('auth-token');

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    );
  }
}
