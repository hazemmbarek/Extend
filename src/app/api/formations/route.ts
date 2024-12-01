import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';

export async function GET() {
  try {
    const pool = initDB();
    const [rows] = await pool.query(`
      SELECT 
        id,
        title,
        description,
        price,
        start_date,
        end_date,
        location,
        duration_hours,
        max_participants,
        current_participants,
        category,
        level,
        status,
        CONCAT('/assets/img/', IFNULL(thumbnail_image, 'default-formation.jpg')) as thumbnail_image
      FROM trainings
    `);
    
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching formations:', error);
    return NextResponse.json(
      { error: 'Error fetching formations' },
      { status: 500 }
    );
  }
} 