import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Handle login page access
  if (request.nextUrl.pathname === '/login') {
    if (token) {
      // Check token validity through API
      const response = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.authenticated) {
        // Redirect authenticated users away from login page based on role
        const isAdminRole = ['admin', 'teacher', 'assistant'].includes(data.user.role);
        return NextResponse.redirect(
          new URL(isAdminRole ? '/admin/users' : '/dashboard', request.url)
        );
      }
    }
    return NextResponse.next();
  }

  // Handle protected routes
  if (request.nextUrl.pathname === '/') {
    return NextResponse.next();
  }

  // Check for admin routes
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Verify token through API
  const response = await fetch(`${request.nextUrl.origin}/api/auth/check`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  
  if (!data.authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Check admin access for admin routes
  if (isAdminRoute && !['admin', 'teacher', 'assistant'].includes(data.user.role)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};