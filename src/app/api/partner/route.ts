import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.LCP_MYSQL_HOST,
  user: process.env.LCP_MYSQL_USER,
  password: process.env.LCP_MYSQL_PASSWORD,
  database: process.env.LCP_MYSQL_DATABASE,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const connection = await pool.getConnection();

    if (id) {
      // If "id" is provided, fetch a single chapter leader
      const [rows] = await connection.execute('SELECT * FROM wprh_users WHERE id = ?', [
        parseInt(id, 10),
      ]);
      connection.release();

      if ((rows as any[]).length === 0) {
        return NextResponse.json({ message: 'Partner not found' }, { status: 404 });
      }

      return NextResponse.json((rows as any[])[0]);
    }

    // Otherwise, fetch all chapter leaders
    const [rows] = await connection.execute('SELECT * FROM wprh_users');
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { message: 'Error fetching partners:', error: (error as Error).message },
      { status: 500 }
    );
  }
}
