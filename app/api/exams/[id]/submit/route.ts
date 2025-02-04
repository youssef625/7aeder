import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyJWT } from '@/lib/jwt';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = verifyJWT(token);
    if (!payload || payload.role !== 'student') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { answers } = await req.json();

    // Get exam questions with correct answers
    const questions = await query({
      query: 'SELECT id, correct_answer, marks FROM exam_questions WHERE exam_id = ?',
      values: [params.id],
    });

    // Calculate score
    let totalScore = 0;
    (questions as any[]).forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        totalScore += question.marks;
      }
    });

    // Save exam submission
    await query({
      query: `
        INSERT INTO exam_submissions (exam_id, student_id, score, answers)
        VALUES (?, ?, ?, ?)
      `,
      values: [params.id, payload.id, totalScore, JSON.stringify(answers)],
    });

    return NextResponse.json({ score: totalScore });
  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json({ error: 'Failed to submit exam' }, { status: 500 });
  }
}