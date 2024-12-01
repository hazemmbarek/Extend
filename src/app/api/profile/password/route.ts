import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';

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
    const { oldPassword, newPassword } = await request.json();

    const pool = initDB();
    
    // Vérifier l'ancien mot de passe
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

    const isValid = await bcrypt.compare(oldPassword, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Ancien mot de passe incorrect' },
        { status: 400 }
      );
    }

    // Hasher et enregistrer le nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, decoded.userId]
    );

    return NextResponse.json({ message: 'Mot de passe mis à jour avec succès' });

  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 