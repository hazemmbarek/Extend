import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import QRCode from 'qrcode';

function generateReferralCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

// Add password validation function
function validatePassword(password: string): { isValid: boolean; message: string } {
  // Minimum length check
  if (password.length < 8) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins 8 caractères'
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins une lettre majuscule'
    };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins une lettre minuscule'
    };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins un chiffre'
    };
  }

  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      isValid: false,
      message: 'Le mot de passe doit contenir au moins un caractère spécial (!@#$%^&*(),.?":{}|<>)'
    };
  }

  return { isValid: true, message: '' };
}

async function generateQRCode(referralCode: string): Promise<Buffer> {
  try {
    // Create the referral URL
    const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`;
    
    // Generate QR code with custom styling
    const qrCodeBuffer = await QRCode.toBuffer(referralUrl, {
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 400,
      color: {
        dark: '#6A1B9A',  // Purple color for QR code
        light: '#FFFFFF'  // White background
      }
    });

    return qrCodeBuffer;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export async function POST(request: Request) {
  try {
    const { username, email, password, phone_number, referral_code } = await request.json();

    // Validate required fields
    if (!username || !email || !password || !phone_number) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { error: passwordValidation.message },
        { status: 400 }
      );
    }

    const pool = await initDB();

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      'SELECT email FROM users WHERE email = ? OR username = ?',
      [email, username]
    );

    if ((existingUsers as any[]).length > 0) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      );
    }

    // Verify referral code exists if provided
    let sponsor_id = null;
    if (referral_code) {
      const [sponsors] = await pool.execute(
        'SELECT id FROM users WHERE referral_code = ?',
        [referral_code]
      );

      if ((sponsors as any[]).length === 0) {
        return NextResponse.json(
          { error: 'Code de parrainage invalide' },
          { status: 400 }
        );
      }
      
      sponsor_id = (sponsors as any[])[0].id;
    }

    // Generate new user's own referral code
    const newReferralCode = generateReferralCode();

    // Generate QR code
    const qrCodeBuffer = await generateQRCode(newReferralCode);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Begin transaction
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      // Insert new user
      const [result] = await connection.execute(
        `INSERT INTO users (
          username, 
          email, 
          password, 
          phone_number, 
          sponsor_id,
          referral_code,
          qr_code_path,
          status,
          role
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 'user')`,
        [
          username,
          email,
          hashedPassword,
          phone_number,
          sponsor_id,
          newReferralCode,
          qrCodeBuffer
        ]
      );

      const userId = (result as any).insertId;

      // No need to update referral_count anymore since we're using referral_code
      await connection.commit();

      return NextResponse.json({
        message: 'User registered successfully',
        userId,
        referralCode: newReferralCode,
        referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${newReferralCode}`
      });

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 