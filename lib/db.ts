import mysql from 'mysql2/promise';

export async function query({ query, values = [] }: { query: string; values?: any[] }) {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    ssl: {
      // Adjust the SSL options as necessary
      rejectUnauthorized: true,
    },
  });

  try {
    const [results] = await connection.execute(query, values);
    connection.end();
    return results;
  } catch (error) {
    throw Error('Database query error');
  }
}