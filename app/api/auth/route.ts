import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { signJWT } from '@/lib/jwt';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { id, password } = await req.json();

    // Add console.log for debugging
    console.log('Attempting login with:', { id });

    const users = await query({
      query: 'SELECT id, name, role FROM users WHERE id = ? AND password = ?',
      values: [id, password],
    });

    // Log the query result
    console.log('Query result:', users);

    const user = (users as any[])[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT
    const token = signJWT({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    // Set cookie with explicit maxAge
    cookies().set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
      }
    });
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: error.message || 'Authentication failed' },
      { status: 500 }
    );
  }
}