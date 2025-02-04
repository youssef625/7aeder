import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function GET(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { role, id } = payload;
    const userId = parseInt(id, 10);
    let result;

    if (role === 'teacher') {
      // Get assistants and students for teacher
      const [assistants, students] = await Promise.all([
        query({
          query: `
            SELECT u.* FROM users u
            INNER JOIN teacher_assistants ta ON u.id = ta.assistant_id
            WHERE ta.teacher_id = ?
          `,
          values: [userId],
        }),
        query({
          query: `
            SELECT u.* FROM users u
            INNER JOIN teacher_students ts ON u.id = ts.student_id
            WHERE ts.teacher_id = ?
          `,
          values: [userId],
        }),
      ]);
      result = { assistants, students };
    } else if (role === 'assistant') {
      // Get students for assistant's teacher
      const students = await query({
        query: `
          SELECT u.* FROM users u
          INNER JOIN teacher_students ts ON u.id = ts.student_id
          INNER JOIN teacher_assistants ta ON ts.teacher_id = ta.teacher_id
          WHERE ta.assistant_id = ?
        `,
        values: [userId],
      });
      result = { students };
    } else {
      return NextResponse.json({ error: 'Unauthorized role' }, { status: 403 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in teacher management:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload || payload.role !== 'teacher') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, userId, type } = await req.json();
    const teacherId = parseInt(payload.id, 10);
    const targetUserId = parseInt(userId, 10);

    if (action === 'add') {
      if (type === 'assistant') {
        await query({
          query: 'INSERT INTO teacher_assistants (teacher_id, assistant_id) VALUES (?, ?)',
          values: [teacherId, targetUserId],
        });
      } else if (type === 'student') {
        await query({
          query: 'INSERT INTO teacher_students (teacher_id, student_id) VALUES (?, ?)',
          values: [teacherId, targetUserId],
        });
      }
    } else if (action === 'remove') {
      if (type === 'assistant') {
        await query({
          query: 'DELETE FROM teacher_assistants WHERE teacher_id = ? AND assistant_id = ?',
          values: [teacherId, targetUserId],
        });
      } else if (type === 'student') {
        await query({
          query: 'DELETE FROM teacher_students WHERE teacher_id = ? AND student_id = ?',
          values: [teacherId, targetUserId],
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in teacher management:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}