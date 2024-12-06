import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();
    const pool = initDB();

    // Verify token and get user
    const [users] = await pool.execute(
      `SELECT id FROM users 
       WHERE reset_token = ? 
       AND reset_token_expiry > NOW()`,
      [token]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { error: 'Token invalide ou expiré' },
        { status: 400 }
      );
    }

    const user = (users as any[])[0];

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update password and clear reset token
    await pool.execute(
      `UPDATE users 
       SET password = ?, 
           reset_token = NULL, 
           reset_token_expiry = NULL 
       WHERE id = ?`,
      [hashedPassword, user.id]
    );

    return NextResponse.json(
      { message: 'Mot de passe réinitialisé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 