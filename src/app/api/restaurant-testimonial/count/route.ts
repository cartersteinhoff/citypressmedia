import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool to the PostgreSQL database using the connection string from the environment variable
const pool = new Pool({
  connectionString: process.env.CPM_PG_CONN_STRING,
  // ssl: { rejectUnauthorized: false }, // Optional: Use if connecting to a cloud-hosted database (e.g., Heroku, AWS)
});

// Handle GET request for restaurant testimonial count
export async function GET(request: Request) {
  console.log('Fetching restaurant testimonial count...');
  try {
    const client = await pool.connect();

    // Query to count total restaurant testimonials, those added today, yesterday, last 7 days, and last 30 days
    const query = `
      SELECT 
        COUNT(*) AS total_count,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE) AS added_today,
        COUNT(*) FILTER (WHERE created_at::date = CURRENT_DATE - INTERVAL '1 day') AS added_yesterday,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') AS added_last_7_days,
        COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') AS added_last_30_days
      FROM restaurant_testimonials;
    `;

    // Execute the query
    const result = await client.query(query);
    client.release();

    const { total_count, added_today, added_yesterday, added_last_7_days, added_last_30_days } =
      result.rows[0];
    console.log(
      'Restaurant testimonial count fetched:',
      total_count,
      added_today,
      added_yesterday,
      added_last_7_days,
      added_last_30_days
    );

    // Return the results in the response
    return NextResponse.json({
      totalRestaurantTestimonials: total_count,
      addedToday: added_today,
      addedYesterday: added_yesterday,
      addedLast7Days: added_last_7_days,
      addedLast30Days: added_last_30_days,
    });
  } catch (error) {
    console.error('Error fetching restaurant testimonial count:', error);
    return NextResponse.json(
      { message: 'Error fetching restaurant testimonial count', error: (error as Error).message },
      { status: 500 }
    );
  }
}
