import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

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
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ]
}; 