import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';

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

    let profilePictureUrl = null;
    if (user.profile_picture_binary) {
      const buffer = Buffer.from(user.profile_picture_binary);
      profilePictureUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }

    let qrCodeUrl = null;
    if (user.qr_code_binary) {
      const buffer = Buffer.from(user.qr_code_binary);
      qrCodeUrl = `data:image/png;base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      ...user,
      profile_picture: profilePictureUrl,
      qr_code: qrCodeUrl
    });

  } catch (error) {
    console.error('Profile error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

// Update the POST endpoint to handle both phone number and profile picture updates
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
    const { phone_number } = await request.json();

    const pool = initDB();
    
    // Update user profile
    await pool.query(
      'UPDATE users SET phone_number = ? WHERE id = ?',
      [phone_number, decoded.userId]
    );

    // Get updated user data
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

    let profilePictureUrl = null;
    if (user.profile_picture_binary) {
      const buffer = Buffer.from(user.profile_picture_binary);
      profilePictureUrl = `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }

    let qrCodeUrl = null;
    if (user.qr_code_binary) {
      const buffer = Buffer.from(user.qr_code_binary);
      qrCodeUrl = `data:image/png;base64,${buffer.toString('base64')}`;
    }

    return NextResponse.json({
      ...user,
      profile_picture: profilePictureUrl,
      qr_code: qrCodeUrl,
      message: 'Profile updated successfully'
    });

  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
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
    const { password } = await request.json();

    const pool = initDB();
    
    // Verify password
    const [users] = await pool.query(
      'SELECT password FROM users WHERE id = ?',
      [decoded.userId]
    );

    const user = (users as any[])[0];
    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Mot de passe incorrect' },
        { status: 400 }
      );
    }

    // Delete user and related data
    await pool.query('DELETE FROM users WHERE id = ?', [decoded.userId]);

    // Clear auth cookie
    const response = NextResponse.json({ message: 'Compte supprimé avec succès' });
    response.cookies.delete('auth_token');
    return response;

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 