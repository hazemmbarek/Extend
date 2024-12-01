import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import QRCode from 'qrcode';

function generateReferralCode(): string {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
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
    const { username, email, password, phone_number, sponsor_id } = await request.json();

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

    // Generate referral code
    const referralCode = generateReferralCode();

    // Generate QR code
    const qrCodeBuffer = await generateQRCode(referralCode);

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
          sponsor_id || null,
          referralCode,
          qrCodeBuffer
        ]
      );

      // Get the inserted user ID
      const userId = (result as any).insertId;

      // If sponsor exists, update their referral count
      if (sponsor_id) {
        await connection.execute(
          'UPDATE users SET referral_count = referral_count + 1 WHERE id = ?',
          [sponsor_id]
        );
      }

      await connection.commit();

      // Return success response with referral info
      return NextResponse.json({
        message: 'User registered successfully',
        userId,
        referralCode,
        referralUrl: `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`
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