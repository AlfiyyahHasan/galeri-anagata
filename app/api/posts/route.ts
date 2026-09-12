import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// GET: Mengambil detail satu postingan berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    
    if (postResult.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Postingan tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: postResult.rows[0] 
    });
  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: Untuk Like atau Update
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { is_liked, likes } = body;

    const result = await pool.query(
      'UPDATE posts SET is_liked = $1, likes = $2 WHERE id = $3 RETURNING *',
      [is_liked, likes, id]
    );

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: Untuk Hapus Postingan
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}