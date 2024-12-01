import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

interface SignupRequestBody {
  username: string;
  email: string;
  password: string;
  phone_number: string;
  sponsor_id?: number;
}

function generateReferralCode(): string {
  // Generate a random 8-character alphanumeric code
  return crypto.randomBytes(4).toString('hex').toUpperCase();
}

function generateQRCodePath(username: string, referralCode: string): string {
  // For now, just return a placeholder path. You'll need to implement actual QR code generation
  return `/qrcodes/${username}_${referralCode}.png`;
}

export async function POST(request: Request) {
  try {
    const body: SignupRequestBody = await request.json();
    const { username, email, password, phone_number, sponsor_id } = body;

    // Validate required fields
    if (!username || !email || !password || !phone_number) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Validate sponsor_id if provided
    if (sponsor_id) {
      const [sponsors] = await pool.execute(
        'SELECT id FROM users WHERE id = ?',
        [sponsor_id]
      );

      if ((sponsors as any[]).length === 0) {
        return NextResponse.json(
          { error: 'Invalid sponsor ID' },
          { status: 400 }
        );
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate referral code
    const referralCode = generateReferralCode();

    // Generate QR code path
    const qrCodePath = generateQRCodePath(username, referralCode);

    // Insert new user
    const [result] = await pool.execute(
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
        sponsor_id || null,
        referralCode,
        qrCodePath
      ]
    );

    // Get the inserted user ID
    const userId = (result as any).insertId;

    // After successful user creation, fetch the generated referral code
    const [newUser] = await pool.query(
      'SELECT id, referral_code FROM extend.users WHERE id = ?',
      [userId]
    );

    return NextResponse.json({
      message: "User created successfully",
      userId: (newUser as any[])[0].id,
      referralCode: (newUser as any[])[0].referral_code
    }, { status: 201 });

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 