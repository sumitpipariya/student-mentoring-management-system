import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { username, password, role } = await request.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { Username: username }
        });

        if (!user || user.Password !== password) {
            return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
        }

        // Verify if the requested role matches the database role
        if (user.Role.toLowerCase() !== role.toLowerCase()) {
            return NextResponse.json({ error: `User is not registered as a ${role}` }, { status: 403 });
        }

        // Determine default redirect path based on role
        const redirectPath = `/${role.toLowerCase()}/dashboard`;

        const response = NextResponse.json({
            success: true,
            redirect: redirectPath,
            user: {
                id: user.UserID,
                username: user.Username,
                role: user.Role
            }
        });

        // Set basic auth cookies
        response.cookies.set('userId', String(user.UserID), { httpOnly: true, path: '/' });
        response.cookies.set('userRole', user.Role, { httpOnly: true, path: '/' });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
