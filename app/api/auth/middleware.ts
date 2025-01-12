import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function checkAdmin(id: string) {
  try {
    const users = await query({
      query: 'SELECT role FROM users WHERE id = ?',
      values: [id],
    });
    const user = (users as any[])[0];
    return user?.role === 'admin';
  } catch (error) {
    return false;
  }
}