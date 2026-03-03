import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL('/auth/login', request.url);
    const response = NextResponse.redirect(url);

    // Clear cookies
    response.cookies.delete('userId');
    response.cookies.delete('userRole');

    return response;
}

export async function POST() {
    const response = NextResponse.json({ success: true });

    // Clear cookies
    response.cookies.delete('userId');
    response.cookies.delete('userRole');

    return response;
}
