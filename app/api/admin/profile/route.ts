import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function PUT(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(userIdRaw);
        const { currentPassword, newPassword } = await request.json();

        const user = await prisma.user.findUnique({
            where: { UserID: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify current password
        if (user.Password !== currentPassword) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        // Update password
        await prisma.user.update({
            where: { UserID: userId },
            data: { Password: newPassword }
        });

        return NextResponse.json({ success: true, message: "Password updated successfully" });

    } catch (error) {
        console.error("Admin Profile API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
