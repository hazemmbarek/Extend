import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import crypto from 'crypto';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const pool = initDB();

    // Check if user exists
    const [users] = await pool.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if ((users as any[]).length === 0) {
      return NextResponse.json(
        { message: 'Si un compte existe avec cet email, vous recevrez les instructions.' },
        { status: 200 } // Return 200 to prevent email enumeration
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token in database
    await pool.execute(
      `UPDATE users 
       SET reset_token = ?, reset_token_expiry = ? 
       WHERE email = ?`,
      [resetToken, resetTokenExpiry, email]
    );

    // Send email
    await resend.emails.send({
      from: 'Extend <onboarding@resend.dev>',
      to: email,
      subject: 'Réinitialisation de votre mot de passe',
      html: `
        <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
        <p>Cliquez sur ce lien pour réinitialiser votre mot de passe:</p>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}">
          Réinitialiser mon mot de passe
        </a>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    });

    return NextResponse.json(
      { message: 'Instructions envoyées par email' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    );
  }
} 