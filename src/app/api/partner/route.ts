import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.CPM_PG_CONN_STRING,
  // ssl: { rejectUnauthorized: false }, // Optional: Use if connecting to a cloud-hosted database (e.g., Heroku, AWS)
});

// Handle GET request
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const client = await pool.connect();

    if (id) {
      // Fetch a single partner by id
      const result = await client.query('SELECT * FROM partners WHERE id = $1', [parseInt(id, 10)]);
      client.release();

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Partner not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    // Fetch all partners if no id is provided
    const result = await client.query('SELECT * FROM partners ORDER BY first_name ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching partners:', error);
    return NextResponse.json(
      { message: 'Error fetching partners', error: (error as Error).message },
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
      INSERT INTO partners (
        first_name, last_name, email, phone, number_of_units, address1, address2, city, state, zip, 
        referred_by_first_name, referred_by_last_name
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING id`;
    const values = [
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      body.number_of_units,
      body.address1,
      body.address2,
      body.city,
      body.state,
      body.zip,
      body.referred_by_first_name,
      body.referred_by_last_name,
    ];

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(
      { message: 'Partner created successfully', partner: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating partner:', error);
    return NextResponse.json(
      { message: 'Error creating partner', error: (error as Error).message },
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
      UPDATE partners SET 
        first_name = $1, last_name = $2, email = $3, phone = $4, number_of_units = $5, address1 = $6, 
        address2 = $7, city = $8, state = $9, zip = $10, referred_by_first_name = $11, 
        referred_by_last_name = $12 
      WHERE id = $13`;
    const values = [
      body.first_name,
      body.last_name,
      body.email,
      body.phone,
      body.number_of_units,
      body.address1,
      body.address2,
      body.city,
      body.state,
      body.zip,
      body.referred_by_first_name,
      body.referred_by_last_name,
      parseInt(id, 10),
    ];

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json({
      message: 'Partner updated successfully',
      affectedRows: result.rowCount,
    });
  } catch (error) {
    console.error('Error updating partner:', error);
    return NextResponse.json(
      { message: 'Error updating partner', error: (error as Error).message },
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
    const result = await client.query('DELETE FROM partners WHERE id = $1', [parseInt(id, 10)]);
    client.release();

    return NextResponse.json({
      message: 'Partner deleted successfully',
      affectedRows: result.rowCount,
    });
  } catch (error) {
    console.error('Error deleting partner:', error);
    return NextResponse.json(
      { message: 'Error deleting partner', error: (error as Error).message },
      { status: 500 }
    );
  }
}
