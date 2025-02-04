import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function checkAdmin(id: string) {
  try {
    const users = await query({
      query: 'SELECT role FROM users WHERE id = ?',
      values: [id],
    });
    const user = (users as any[])[0];
    // Consider admin, teacher, and assistant as admin roles
    return ['admin', 'teacher', 'assistant'].includes(user?.role);
  } catch (error) {
    return false;
  }
}