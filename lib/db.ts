import mysql from 'mysql2/promise';

export async function query({ query, values = [] }: { query: string; values?: any[] }) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
    },
  });

  try {
    const [results] = await connection.execute(query, values);
    connection.end();
    return results;
  } catch (error: any) {
    console.error('Database error:', error.message);
    throw new Error('Database query error');
  }
}

// Helper functions for teacher management
export async function getTeacherAssistants(teacherId: number) {
  return query({
    query: `
      SELECT u.* FROM users u
      INNER JOIN teacher_assistants ta ON u.id = ta.assistant_id
      WHERE ta.teacher_id = ?
    `,
    values: [teacherId],
  });
}

export async function getTeacherStudents(teacherId: number) {
  return query({
    query: `
      SELECT u.* FROM users u
      INNER JOIN teacher_students ts ON u.id = ts.student_id
      WHERE ts.teacher_id = ?
    `,
    values: [teacherId],
  });
}

export async function getAssistantTeacherStudents(assistantId: number) {
  return query({
    query: `
      SELECT u.* FROM users u
      INNER JOIN teacher_students ts ON u.id = ts.student_id
      INNER JOIN teacher_assistants ta ON ts.teacher_id = ta.teacher_id
      WHERE ta.assistant_id = ?
    `,
    values: [assistantId],
  });
}