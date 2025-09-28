import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  console.log('Middleware - pathname:', pathname);
  
  if (!pathname.startsWith('/Admin')) {
    console.log('Middleware - allowing non-Admin path');
    return NextResponse.next();
  }

  const token = req.cookies.get('auth_token')?.value;
  console.log('Middleware - token exists:', !!token);
  
  if (!token) {
    console.log('Middleware - redirecting to login');
    const url = req.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  
  console.log('Middleware - allowing Admin access');
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/Admin/:path*',
  ],
};