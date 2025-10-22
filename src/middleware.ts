import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Xử lý trailing slash cho tất cả API routes
  if (pathname.endsWith('/') && pathname !== '/') {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(0, -1); // Bỏ dấu / cuối
    
    console.log(`Rewriting ${pathname} to ${url.pathname}`);
    
    return NextResponse.rewrite(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
};