import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function GET(req: Request, { params }: { params: { id: string } }) {
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
        WHERE e.id = ?
      `;
      values = [params.id];
    } else if (payload.role === 'teacher') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        WHERE e.id = ? AND e.teacher_id = ?
      `;
      values = [params.id, payload.id];
    } else if (payload.role === 'assistant') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        LEFT JOIN teacher_assistants ta ON e.teacher_id = ta.teacher_id 
        WHERE e.id = ? AND ta.assistant_id = ?
      `;
      values = [params.id, payload.id];
    } else if (payload.role === 'student') {
      queryStr = `
        SELECT e.*, u.name as teacher_name 
        FROM exams e 
        LEFT JOIN users u ON e.teacher_id = u.id 
        LEFT JOIN teacher_students ts ON e.teacher_id = ts.teacher_id 
        WHERE e.id = ? AND ts.student_id = ?
      `;
      values = [params.id, payload.id];
    }

    const exams = await query({
      query: queryStr,
      values: values,
    });

    if ((exams as any[]).length === 0) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    return NextResponse.json((exams as any[])[0]);
  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json({ error: 'Failed to fetch exam' }, { status: 500 });
  }
}