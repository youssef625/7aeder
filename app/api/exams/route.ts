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

    let queryStr = '';
    let values: any[] = [];

    // Different queries based on user role
    if (payload.role === 'admin') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        ORDER BY e.created_at DESC
      `;
    } else if (payload.role === 'teacher') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        WHERE e.teacher_id = ?
        ORDER BY e.created_at DESC
      `;
      values = [payload.id];
    } else if (payload.role === 'assistant') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        LEFT JOIN teacher_assistants ta ON e.teacher_id = ta.teacher_id 
        WHERE ta.assistant_id = ?
        ORDER BY e.created_at DESC
      `;
      values = [payload.id];
    } else if (payload.role === 'student') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        LEFT JOIN teacher_students ts ON e.teacher_id = ts.teacher_id 
        WHERE ts.student_id = ?
        ORDER BY e.created_at DESC
      `;
      values = [payload.id];
    }

    const exams = await query({
      query: queryStr,
      values: values,
    });

    return NextResponse.json(exams);
  } catch (error) {
    console.error('Error fetching exams:', error);
    return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload || !['admin', 'teacher', 'assistant'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description, duration, total_marks } = await req.json();
    const result = await query({
      query: `
        INSERT INTO exams (title, description, duration, total_marks, teacher_id) 
        VALUES (?, ?, ?, ?, ?)
      `,
      values: [title, description, duration, total_marks, payload.id],
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating exam:', error);
    return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload || !['admin', 'teacher', 'assistant'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, title, description, duration, total_marks } = await req.json();

    // Check if user has permission to update this exam
    const examCheck = await query({
      query: 'SELECT teacher_id FROM exams WHERE id = ?',
      values: [id],
    });

    const exam = (examCheck as any[])[0];
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (payload.role !== 'admin' && exam.teacher_id !== payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await query({
      query: 'UPDATE exams SET title = ?, description = ?, duration = ?, total_marks = ? WHERE id = ?',
      values: [title, description, duration, total_marks, id],
    });

    return NextResponse.json({ message: 'Exam updated successfully' });
  } catch (error) {
    console.error('Error updating exam:', error);
    return NextResponse.json({ error: 'Failed to update exam' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload || !['admin', 'teacher'].includes(payload.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await req.json();

    // Check if user has permission to delete this exam
    const examCheck = await query({
      query: 'SELECT teacher_id FROM exams WHERE id = ?',
      values: [id],
    });

    const exam = (examCheck as any[])[0];
    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (payload.role !== 'admin' && exam.teacher_id !== payload.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await query({
      query: 'DELETE FROM exams WHERE id = ?',
      values: [id],
    });

    return NextResponse.json({ message: 'Exam deleted successfully' });
  } catch (error) {
    console.error('Error deleting exam:', error);
    return NextResponse.json({ error: 'Failed to delete exam' }, { status: 500 });
  }
}