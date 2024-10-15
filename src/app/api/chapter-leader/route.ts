import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

// Create a connection pool to the MySQL database
const pool = mysql.createPool({
  host: process.env.LCD_MYSQL_HOST,
  user: process.env.LCD_MYSQL_USER,
  password: process.env.LCD_MYSQL_PASSWORD,
  database: process.env.LCD_MYSQL_DATABASE,
});

// Handle GET request
export async function GET(request: Request) {
  console.log('Fetching chapter leaders...');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const connection = await pool.getConnection();

    if (id) {
      // If "id" is provided, fetch a single chapter leader
      const [rows] = await connection.execute('SELECT * FROM chapter_leaders WHERE id = ?', [
        parseInt(id, 10),
      ]);
      connection.release();

      if ((rows as any[]).length === 0) {
        return NextResponse.json({ message: 'Chapter leader not found' }, { status: 404 });
      }

      return NextResponse.json((rows as any[])[0]);
    }

    // Otherwise, fetch all chapter leaders
    const [rows] = await connection.execute('SELECT * FROM chapter_leaders');
    connection.release();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching chapter leaders:', error);
    return NextResponse.json(
      { message: 'Error fetching chapter leaders', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle POST request
export async function POST(request: Request) {
  try {
    const connection = await pool.getConnection();
    const body = await request.json();
    const query = `INSERT INTO chapter_leaders (first_name, last_name, email, phone, address1, address2, city, state, zip, reserved_cities, reserved_states, referred_by_first_name, referred_by_last_name, title)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      body.address1,
      body.address2,
      body.city,
      body.state,
      body.zip,
      body.reserved_cities,
      body.reserved_states,
      body.referred_by_first_name,
      body.referred_by_last_name,
      body.title,
    ];

    const [result] = await connection.execute(query, values);
    connection.release();

    return NextResponse.json(
      { message: 'Chapter leader created successfully', leader: (result as any).insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating chapter leader:', error);
    return NextResponse.json(
      { message: 'Error creating chapter leader', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle PUT request
export async function PUT(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const body = await request.json();
    const query = `UPDATE chapter_leaders SET first_name = ?, last_name = ?, email = ?, phone = ?, address1 = ?, address2 = ?, city = ?, state = ?, zip = ?, reserved_cities = ?, reserved_states = ?, referred_by_first_name = ?, referred_by_last_name = ?, title = ? WHERE id = ?`;
    const values = [
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      body.address1,
      body.address2,
      body.city,
      body.state,
      body.zip,
      body.reserved_cities,
      body.reserved_states,
      body.referred_by_first_name,
      body.referred_by_last_name,
      body.title,
      parseInt(id, 10),
    ];

    const [result] = await connection.execute(query, values);
    connection.release();

    return NextResponse.json({
      message: 'Chapter leader updated successfully',
      affectedRows: (result as any).affectedRows,
    });
  } catch (error) {
    console.error('Error updating chapter leader:', error);
    return NextResponse.json(
      { message: 'Error updating chapter leader', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle DELETE request
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM chapter_leaders WHERE id = ?', [
      parseInt(id, 10),
    ]);
    connection.release();

    return NextResponse.json({
      message: 'Chapter leader deleted successfully',
      affectedRows: (result as any).affectedRows,
    });
  } catch (error) {
    console.error('Error deleting chapter leader:', error);
    return NextResponse.json(
      { message: 'Error deleting chapter leader', error: (error as Error).message },
      { status: 500 }
    );
  }
}
