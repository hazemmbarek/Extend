import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { initDB } from '@/lib/db';
import jwt from 'jsonwebtoken';

// Define public routes that don't require authentication
const publicRoutes = ['/', '/login', '/register', '/signup', '/profile'];

export async function middleware(request: NextRequest) {
  const isPublicRoute = publicRoutes.some(route => 
    request.nextUrl.pathname === route
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  try {
    // Check for auth token
    const authToken = request.cookies.get('auth_token');
    const profileToken = request.cookies.get('profile_creation_token');
    const isEditing = request.nextUrl.searchParams.get('edit') === 'true';

    // If no token found, redirect to login
    if (!authToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // For the profile creation page specifically
    if (request.nextUrl.pathname === '/profile') {
      // Decode token to get user ID
      const decoded = jwt.verify(authToken.value, process.env.JWT_SECRET!) as { userId: string };
      const userId = decoded.userId;

      // Check if profile exists
      const pool = await initDB();
      const [rows] = await pool.execute(
        'SELECT id_profile FROM profiles WHERE id_user = ?',
        [userId]
      );
      const profiles = rows as any[];

      // Allow access if editing or if it's a new profile with token
      if (profiles.length > 0 && !isEditing) {
        return NextResponse.redirect(new URL('/profile/view', request.url));
      }
      
      // Require profile_creation_token for new profile creation
      if (!profiles.length && !profileToken) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to home page
    return NextResponse.redirect(new URL('/', request.url));
  }
}

// Configure which routes should be protected
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ]
}; 