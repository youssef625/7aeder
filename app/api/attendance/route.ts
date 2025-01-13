import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get('searchQuery') || '';

  try {
    const attendance = await query({
      query: `
        SELECT 
          a.id,
          a.user_id,
          a.lecture_id,
          a.attended,
          a.created_at,
          u.name as user_name,
          l.name as lecture_name,
          l.day as lecture_day
        FROM attendance a
        JOIN users u ON a.user_id = u.id
        JOIN lectures l ON a.lecture_id = l.id
        WHERE u.name LIKE ?
        ORDER BY l.day, u.name
      `,
      values: [`%${searchQuery}%`],
    });
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const { userId, lectureId, attended } = await req.json();

    // Validate required fields
    if (!userId || !lectureId || attended === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    let queryStr = ``;
    let achattended;

    if (attended) { 
      queryStr = `INSERT INTO attendance (user_id, lecture_id, attended) VALUES (?, ?, ?)`;
      achattended = 1;
    }
    else {
      queryStr = `DELETE FROM attendance WHERE user_id = ? AND lecture_id = ? AND attended = ?`;
      achattended = 0;
    }
    const result = await query({
      query: queryStr,
      values: [userId, lectureId, attended, attended],
    });

    return NextResponse.json({ success: true, Action: achattended });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update attendance' },
      { status: 500 }
    );
  }
}