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

async function buildSponsorshipChain(connection: any, userId: number, directSponsorId: number | null) {
  if (!directSponsorId) {
    // If no sponsor, just insert level 1
    await connection.execute(
      'INSERT INTO sponsorship_tree (user_id, sponsor_id, level) VALUES (?, NULL, 1)',
      [userId]
    );
    return;
  }

  // Get sponsor chain up to 5 levels
  const [sponsorChain] = await connection.execute(`
    WITH RECURSIVE sponsor_chain AS (
      -- Base: direct sponsor
      SELECT id, sponsor_id, 1 as chain_level
      FROM users
      WHERE id = ?
      
      UNION ALL
      
      -- Recursive: get upper sponsors up to level 5
      SELECT u.id, u.sponsor_id, sc.chain_level + 1
      FROM users u
      JOIN sponsor_chain sc ON u.id = sc.sponsor_id
      WHERE sc.chain_level < 5
    )
    SELECT * FROM sponsor_chain;
  `, [directSponsorId]);

  // Insert relationships for each level
  for (const sponsor of sponsorChain as any[]) {
    await connection.execute(
      'INSERT INTO sponsorship_tree (user_id, sponsor_id, level) VALUES (?, ?, ?)',
      [userId, sponsor.id, sponsor.chain_level]
    );
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

    // Get sponsor_id from referral_code
    let sponsor_id = null;
    if (referral_code) {
      const [sponsors] = await pool.execute(
        'SELECT id FROM users WHERE referral_code = ?',
        [referral_code]
      );
      if ((sponsors as any[]).length > 0) {
        sponsor_id = (sponsors as any[])[0].id;
      }
    }

    // Generate new referral code and hash password
    const newReferralCode = generateReferralCode();
    const hashedPassword = await bcrypt.hash(password, 10);
    const qrCodeBuffer = await generateQRCode(newReferralCode);

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

      // Build the sponsorship tree relationships
      await buildSponsorshipChain(connection, userId, sponsor_id);

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