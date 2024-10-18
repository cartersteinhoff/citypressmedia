import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database using the connection string from the environment variable
const pool = new Pool({
  connectionString: process.env.CPM_PG_CONN_STRING,
  // ssl: { rejectUnauthorized: false }, // Optional: Use if connecting to a cloud-hosted database (e.g., Heroku, AWS)
});

// Handle GET request for chapter leader count
export async function GET(request: Request) {
  console.log('Fetching chapter leader count...');
  try {
    const client = await pool.connect();

    // Execute the query to count chapter leaders
    const result = await client.query('SELECT COUNT(*) AS count FROM restaurant_testimonials');
    client.release();

    const restaurantTestimonialCount = result.rows[0].count;
    console.log('Chapter leader count fetched:', restaurantTestimonialCount);

    return NextResponse.json({ restaurantTestimonialCount });
  } catch (error) {
    console.error('Error fetching chapter leader count:', error);
    return NextResponse.json(
      { message: 'Error fetching chapter leader count', error: (error as Error).message },
      { status: 500 }
    );
  }
}
