import { NextResponse } from 'next/server';
import { initDB } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const pool = initDB();
  
  try {
    const { email, password, rememberMe } = await request.json();

    const [rows] = await pool.query(
      'SELECT * FROM extend.users WHERE email = ?',
      [email]
    );
    const users = rows as any[];

    if (users.length === 0) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // Set expiration based on rememberMe
    const expiresIn = rememberMe ? '30d' : '24h';

    // Create JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        username: user.username
      },
      process.env.JWT_SECRET!,
      { expiresIn }
    );

    // Create response
    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    // Set cookie with expiration based on rememberMe
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : undefined, // 30 days if rememberMe, otherwise session cookie
      expires: rememberMe ? new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) : undefined // 30 days if rememberMe
    });

    return response;

  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 