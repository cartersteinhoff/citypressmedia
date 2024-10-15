import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.LCD_MYSQL_HOST,
  user: process.env.LCD_MYSQL_USER,
  password: process.env.LCD_MYSQL_PASSWORD,
  database: process.env.LCD_MYSQL_DATABASE,
});

// Handle GET request for chapter leader count
export async function GET(request: Request) {
  console.log('Fetching chapter leader count...');
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT COUNT(*) AS count FROM chapter_leaders');
    connection.release();

    const chapterLeaderCount = rows[0].count;
    console.log('Chapter leader count fetched:', chapterLeaderCount);

    return NextResponse.json({ chapterLeaderCount });
  } catch (error) {
    console.error('Error fetching chapter leader count:', error);
    return NextResponse.json(
      { message: 'Error fetching chapter leader count', error: (error as Error).message },
      { status: 500 }
    );
  }
}
