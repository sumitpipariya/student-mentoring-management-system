import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Get cookies set during login
    const userRoleRaw = request.cookies.get('userRole')?.value;
    const userId = request.cookies.get('userId')?.value;

    // Normalize role to uppercase for strict role comparisons
    const userRole = userRoleRaw ? userRoleRaw.toUpperCase() : null;

    const isAuthRoute = pathname.startsWith('/auth');

    // 1. If currently on auth page but already logged in -> Redirect to their dashboard
    if (isAuthRoute && userRole && userId) {
        return NextResponse.redirect(new URL(`/${userRole.toLowerCase()}/dashboard`, request.url));
    }

    // 2. Protect Admin Routes
    if (pathname.startsWith('/admin')) {
        if (!userRole || userRole !== 'ADMIN') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 3. Protect Staff/Mentor Routes
    if (pathname.startsWith('/staff')) {
        if (!userRole || userRole !== 'STAFF') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 4. Protect Student Routes
    if (pathname.startsWith('/student')) {
        if (!userRole || userRole !== 'STUDENT') {
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 5. Allow Next to proceed normally
    return NextResponse.next();
}

/**
 * Define which routes should run this middleware
 */
export const config = {
    matcher: [
        '/admin/:path*',
        '/staff/:path*',
        '/student/:path*',
        '/auth/:path*'
    ]
};
