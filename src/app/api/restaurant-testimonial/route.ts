import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.CPM_PG_CONN_STRING,
  // ssl: { rejectUnauthorized: false }, // Optional: Use if connecting to a cloud-hosted database (e.g., Heroku, AWS)
});

// Handle GET request (Read)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  try {
    const client = await pool.connect();

    if (id) {
      // Fetch a single testimonial by id
      const result = await client.query('SELECT * FROM restaurant_testimonials WHERE id = $1', [
        parseInt(id, 10),
      ]);
      client.release();

      if (result.rows.length === 0) {
        return NextResponse.json({ message: 'Testimonial not found' }, { status: 404 });
      }

      return NextResponse.json(result.rows[0]);
    }

    // Fetch all testimonials if no id is provided
    const result = await client.query(
      'SELECT * FROM restaurant_testimonials ORDER BY created_at DESC'
    );
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { message: 'Error fetching testimonials', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle POST request (Create)
export async function POST(request: Request) {
  try {
    const client = await pool.connect();
    const body = await request.json();
    const query = `
      INSERT INTO restaurant_testimonials (
        customer_name, testimonial_text, rating, company_id, created_at
      ) 
      VALUES ($1, $2, $3, $4, NOW()) 
      RETURNING id`;
    const values = [body.customer_name, body.testimonial_text, body.rating, body.company_id];

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json(
      { message: 'Testimonial created successfully', testimonial: result.rows[0].id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { message: 'Error creating testimonial', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle PUT request (Update)
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
      UPDATE restaurant_testimonials SET 
        customer_name = $1, testimonial_text = $2, rating = $3, company_id = $4, updated_at = NOW() 
      WHERE id = $5`;
    const values = [
      body.customer_name,
      body.testimonial_text,
      body.rating,
      body.company_id,
      parseInt(id, 10),
    ];

    const result = await client.query(query, values);
    client.release();

    return NextResponse.json({
      message: 'Testimonial updated successfully',
      affectedRows: result.rowCount,
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { message: 'Error updating testimonial', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// Handle DELETE request (Delete)
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ message: 'Missing id' }, { status: 400 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('DELETE FROM restaurant_testimonials WHERE id = $1', [
      parseInt(id, 10),
    ]);
    client.release();

    return NextResponse.json({
      message: 'Testimonial deleted successfully',
      affectedRows: result.rowCount,
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { message: 'Error deleting testimonial', error: (error as Error).message },
      { status: 500 }
    );
  }
}
