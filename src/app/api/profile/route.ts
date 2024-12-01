import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

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
        username,
        email,
        phone_number,
        referral_code,
        created_at,
        profile_picture,
        qr_code_path,
        CAST(profile_picture AS BINARY) as profile_picture_binary,
        CAST(qr_code_path AS BINARY) as qr_code_binary
      FROM users
      WHERE id = ?
    `, [decoded.userId]);

    const user = (rows as any[])[0];

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Convert binary profile picture to base64
    let profilePictureUrl = null;
    if (user.profile_picture_binary) {
      const buffer = Buffer.from(user.profile_picture_binary);
      profilePictureUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }

    // Convert binary QR code to base64
    let qrCodeBase64 = null;
    if (user.qr_code_binary) {
      const buffer = Buffer.from(user.qr_code_binary);
      qrCodeBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      ...user,
      profile_picture: profilePictureUrl,
      qr_code: qrCodeBase64,
      total_formations: 0,
      total_commissions: 0
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Add endpoint for updating profile picture
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
    const { profile_picture } = await request.json();

    const pool = initDB();
    await pool.query(
      'UPDATE users SET profile_picture = ? WHERE id = ?',
      [profile_picture, decoded.userId]
    );

    return NextResponse.json({ message: 'Profile picture updated successfully' });

  } catch (error) {
    console.error('Update profile picture error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 