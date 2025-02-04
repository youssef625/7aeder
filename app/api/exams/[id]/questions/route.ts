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

    // Check if user has access to this exam
    let hasAccess = false;
    if (payload.role === 'admin') {
      hasAccess = true;
    } else if (payload.role === 'teacher') {
      const teacherCheck = await query({
        query: 'SELECT id FROM exams WHERE id = ? AND teacher_id = ?',
        values: [params.id, payload.id],
      });
      hasAccess = (teacherCheck as any[]).length > 0;
    } else if (payload.role === 'assistant') {
      const assistantCheck = await query({
        query: `
          SELECT e.id 
          FROM exams e
          JOIN teacher_assistants ta ON e.teacher_id = ta.teacher_id
          WHERE e.id = ? AND ta.assistant_id = ?
        `,
        values: [params.id, payload.id],
      });
      hasAccess = (assistantCheck as any[]).length > 0;
    } else if (payload.role === 'student') {
      const studentCheck = await query({
        query: `
          SELECT e.id 
          FROM exams e
          JOIN teacher_students ts ON e.teacher_id = ts.teacher_id
          WHERE e.id = ? AND ts.student_id = ?
        `,
        values: [params.id, payload.id],
      });
      hasAccess = (studentCheck as any[]).length > 0;
    }

    if (!hasAccess) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const questions = await query({
      query: `
        SELECT id, exam_id, question, options, correct_answer
        FROM exam_questions
        WHERE exam_id = ?
        ORDER BY id
      `,
      values: [params.id],
    });

    // For students, don't send correct answers
    if (payload.role === 'student') {
      return NextResponse.json(
        (questions as any[]).map(({ correct_answer, ...rest }) => ({
          ...rest,
          options: JSON.parse(rest.options),
        }))
      );
    }

    return NextResponse.json(
      (questions as any[]).map(q => ({
        ...q,
        options: JSON.parse(q.options),
      }))
    );
  } catch (error) {
    console.error('Error fetching exam questions:', error);
    return NextResponse.json({ error: 'Failed to fetch exam questions' }, { status: 500 });
  }
}