import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

    const decoded = jwt.verify(authToken, process.env.JWT_SECRET!) as { userId: number };
    const pool = initDB();

    const [rows] = await pool.query(`
      SELECT 
        qr_code_path,
        referral_code
      FROM users
      WHERE id = ?
    `, [decoded.userId]);

    const user = (rows as any[])[0];

    if (!user?.qr_code_path) {
      return NextResponse.json(
        { error: 'QR code not found' },
        { status: 404 }
      );
    }

    // Convert BLOB to base64
    const qrCodeBase64 = `data:image/png;base64,${user.qr_code_path.toString('base64')}`;

    return NextResponse.json({
      qrCode: qrCodeBase64,
      referralCode: user.referral_code
    });

  } catch (error) {
    console.error('QR code fetch error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 