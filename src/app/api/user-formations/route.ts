import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

interface TrainingData extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  price: number | null;
  start_date: string | null;
  end_date: string | null;
  category: string | null;
  level: string | null;
  thumbnail_image: string | null;
  enrollment_id: number | null;
  user_id: number | null;
  enrollment_status: string | null;
  enrollment_date: string | null;
  is_enrolled: boolean;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number };
      const pool = initDB();

      // Ajouter les colonnes manquantes
      await pool.query(`
        ALTER TABLE training_enrollments 
        ADD COLUMN IF NOT EXISTS status 
          ENUM('pending', 'in_progress', 'completed') 
          DEFAULT 'in_progress' 
          AFTER training_id,
        ADD COLUMN IF NOT EXISTS created_at 
          TIMESTAMP 
          DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at 
          TIMESTAMP 
          DEFAULT CURRENT_TIMESTAMP 
          ON UPDATE CURRENT_TIMESTAMP
      `);

      // Requête principale
      const [formations] = await pool.query<TrainingData[]>(`
        SELECT 
          t.id,
          t.title,
          t.description,
          t.price,
          t.start_date,
          t.end_date,
          t.category,
          t.level,
          CAST(t.thumbnail_image AS BINARY) as thumbnail_image_binary,
          te.id as enrollment_id,
          te.user_id,
          COALESCE(te.status, 'in_progress') as enrollment_status,
          COALESCE(te.created_at, t.created_at) as enrollment_date,
          true as is_enrolled
        FROM training_enrollments te
        INNER JOIN trainings t ON t.id = te.training_id
        WHERE te.user_id = ?
        ORDER BY te.created_at DESC
      `, [decoded.userId]);

      const processedFormations = formations.map(f => ({
        id: f.id,
        title: f.title || 'Sans titre',
        description: f.description || '',
        price: f.price || 0,
        start_date: f.start_date || null,
        end_date: f.end_date || null,
        status: f.enrollment_status || 'in_progress',
        progress: 0,
        purchase_date: f.enrollment_date || null,
        category: f.category || 'Non catégorisé',
        level: f.level || 'Débutant',
        thumbnail_image: f.thumbnail_image_binary 
          ? `data:image/jpeg;base64,${Buffer.from(f.thumbnail_image_binary).toString('base64')}`
          : null,
        is_enrolled: true
      }));

      return NextResponse.json(processedFormations);

    } catch (dbError: any) {
      console.error('Database error:', {
        code: dbError.code,
        errno: dbError.errno,
        sqlMessage: dbError.sqlMessage,
        sqlState: dbError.sqlState,
        sql: dbError.sql
      });
      return NextResponse.json(
        { error: `Erreur de base de données: ${dbError.message}` },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('General error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 