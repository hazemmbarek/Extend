import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { initDB } from '@/lib/db';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const trainingId = formData.get('trainingId') as string;

    if (!file || !trainingId) {
      return NextResponse.json(
        { error: 'File and trainingId are required' },
        { status: 400 }
      );
    }

    // Créer le dossier d'upload s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'formations');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const fileName = `formation-${trainingId}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convertir le fichier en buffer et le sauvegarder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Sauvegarder le chemin dans la base de données
    const pool = initDB();
    await pool.query(
      'UPDATE trainings SET thumbnail_image = ? WHERE id = ?',
      [fileName, trainingId]
    );

    return NextResponse.json({ 
      message: 'Formation image updated successfully',
      thumbnail_image: `/uploads/formations/${fileName}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 