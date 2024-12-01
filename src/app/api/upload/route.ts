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

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number };
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Créer le dossier d'upload s'il n'existe pas
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'users');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const fileName = `user-${decoded.userId}-${Date.now()}.${fileExtension}`;
    const filePath = path.join(uploadDir, fileName);

    // Convertir le fichier en buffer et le sauvegarder
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    fs.writeFileSync(filePath, buffer);

    // Sauvegarder le chemin dans la base de données
    const pool = initDB();
    await pool.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [fileName, decoded.userId]
    );

    return NextResponse.json({ 
      message: 'Profile picture updated successfully',
      profile_picture: `/uploads/users/${fileName}`
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 