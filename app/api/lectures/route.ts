import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
  try {
    const lectures = await query({
      query: `
        SELECT 
          id,
          name,
          day,
          created_at 
        FROM lectures 
        ORDER BY FIELD(day, 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
      `,
      values: [],
    });
    return NextResponse.json(lectures);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lectures' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, day } = await req.json();
    const result = await query({
      query: `
        INSERT INTO lectures (name, day) 
        VALUES (?, ?)
      `,
      values: [name, day],
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lecture' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, name, day } = await req.json();
    await query({
      query: 'UPDATE lectures SET name = ?, day = ? WHERE id = ?',
      values: [name, day, id],
    });
    return NextResponse.json({ message: 'Lecture updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lecture' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await query({
      query: 'DELETE FROM lectures WHERE id = ?',
      values: [id],
    });
    return NextResponse.json({ message: 'Lecture deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lecture' }, { status: 500 });
  }
}