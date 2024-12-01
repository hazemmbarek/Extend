import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/signin', '/signup', '/forgot-password', '/reset-password'];

// Define static asset paths that should be ignored
const staticPaths = [
  '/assets',
  '/images',
  '/_next',
  '/favicon.ico',
  '/api',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static assets
  if (staticPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(route + '?')
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
      signinUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(signinUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Vérifier si nous sommes en production
  if (process.env.NODE_ENV === 'production') {
    // Vérifier si la requête est en HTTP
    if (!request.headers.get('x-forwarded-proto')?.includes('https')) {
      // Rediriger vers HTTPS
      return NextResponse.redirect(
        `https://${request.headers.get('host')}${request.nextUrl.pathname}`,
        301
      );
    }
  }

  // Ajouter les en-têtes de sécurité
  const response = NextResponse.next();
  
  // Strict-Transport-Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Content-Security-Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY');
  
  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}; 