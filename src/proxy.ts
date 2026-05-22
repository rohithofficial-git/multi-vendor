import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('aetheris_role')?.value;
  const isAuth = request.cookies.get('aetheris_auth')?.value === 'true';

  const { pathname } = request.nextUrl;

  // Protect Admin Routes
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!isAuth || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Protect Seller Routes
  if (pathname.startsWith('/seller') && pathname !== '/seller/login' && pathname !== '/seller/register') {
    if (!isAuth || role !== 'seller') {
      return NextResponse.redirect(new URL('/seller/login', request.url));
    }
  }
  
  // Protect Buyer Routes that require login
  const protectedBuyerRoutes = ['/checkout', '/profile', '/order'];
  const isProtectedBuyerRoute = protectedBuyerRoutes.some(route => pathname.startsWith(route));
  
  if (isProtectedBuyerRoute) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Prevent logged in users from visiting login pages
  if (isAuth) {
    if (pathname === '/login' && role === 'buyer') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname === '/seller/login' && role === 'seller') {
      return NextResponse.redirect(new URL('/seller', request.url));
    }
    if (pathname === '/admin/login' && role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
