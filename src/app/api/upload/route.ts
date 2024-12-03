import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { createPool } from 'mysql2/promise';
import sharp from 'sharp';

// Create a dedicated connection pool for file uploads
const uploadPool = createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

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

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Resize and compress image
    const processedImageBuffer = await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({
        quality: 80,
        progressive: true
      })
      .toBuffer();

    // Use the dedicated pool for the upload
    const [result] = await uploadPool.execute(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [processedImageBuffer, decoded.userId]
    );

    // Convert to base64 for response
    const base64Image = `data:image/jpeg;base64,${processedImageBuffer.toString('base64')}`;

    return NextResponse.json({
      message: 'File uploaded successfully',
      url: base64Image
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du téléchargement' },
      { status: 500 }
    );
  }
} 