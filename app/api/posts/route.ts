import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, author, story, image_url } = body;

    const query = `
      INSERT INTO posts (title, author, story, image_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [title, author, story, image_url];
    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}