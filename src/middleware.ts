import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password'];

export async function middleware(request: NextRequest) {
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route || 
    request.nextUrl.pathname.startsWith(route + '?')
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    // Check for auth token
    const authToken = request.cookies.get('auth_token');

    // If no token found, redirect to signin
    if (!authToken) {
      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(signinUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
}; 