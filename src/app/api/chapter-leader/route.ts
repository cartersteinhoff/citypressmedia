import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database
// Create a connection pool to the PostgreSQL database using the connection string from the environment variable
const pool = new Pool({
  connectionString: process.env.CPM_PG_CONN_STRING,
  // ssl: { rejectUnauthorized: false }, // Optional: Use if connecting to a cloud-hosted database (e.g., Heroku, AWS)
});

// Handle GET request
export async function GET(request: Request) {
  console.log('Fetching chapter leaders...');
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const client = await pool.connect();

    if (id) {
      // If "id" is provided, fetch a single chapter leader
      const result = await client.query('SELECT * FROM chapter_leaders WHERE id = $1', [
        parseInt(id, 10),
      ]);
      client.release();

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Chapter leader not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    // Otherwise, fetch all chapter leaders
    const result = await client.query('SELECT * FROM chapter_leaders');
    client.release();
    return NextResponse.json(result.rows);
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
    const client = await pool.connect();
    const body = await request.json();
    const query = `
      INSERT INTO chapter_leaders (
        first_name, last_name, email, phone, address1, address2, city, state, zip, reserved_cities, reserved_states, 
        referred_by_first_name, referred_by_last_name, title
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING id`;
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

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(
      { message: 'Chapter leader created successfully', leader: result.rows[0].id },
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
    const client = await pool.connect();
    const body = await request.json();
    const query = `
      UPDATE chapter_leaders SET 
        first_name = $1, last_name = $2, email = $3, phone = $4, address1 = $5, address2 = $6, city = $7, 
        state = $8, zip = $9, reserved_cities = $10, reserved_states = $11, referred_by_first_name = $12, 
        referred_by_last_name = $13, title = $14 
      WHERE id = $15`;
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

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json({
      message: 'Chapter leader updated successfully',
      affectedRows: result.rowCount,
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
    const client = await pool.connect();
    const result = await client.query('DELETE FROM chapter_leaders WHERE id = $1', [
      parseInt(id, 10),
    ]);
    client.release();

    return NextResponse.json({
      message: 'Chapter leader deleted successfully',
      affectedRows: result.rowCount,
    });
  } catch (error) {
    console.error('Error deleting chapter leader:', error);
    return NextResponse.json(
      { message: 'Error deleting chapter leader', error: (error as Error).message },
      { status: 500 }
    );
  }
}
