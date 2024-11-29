import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers';
 
// Middleware function
export function middleware(request: NextRequest) {
    const cookieStore = cookies().get("isLoggedIn")?.value || "";

    const path = request.nextUrl.pathname;
    const isPublicPath = (path === "/login" || path === "/register")

    if(isPublicPath && cookieStore){
        return NextResponse.redirect(new URL('/', request.url))
    }
    
    if (!isPublicPath && !cookieStore) {
        return NextResponse.redirect(new URL('/login', request.url));
    } 
    
}
 
// Middleware configuration
export const config = {
    matcher: [
      '/',
      '/login',
      '/dashboard',
      '/register', 
      '/customer',
      '/home',
      '/products',
    ],
};
