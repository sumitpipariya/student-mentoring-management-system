import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(userIdRaw);

        const staff = await prisma.staff.findFirst({
            where: { UserID: userId }
        });

        if (!staff) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        // Count mentees
        const menteeCount = await prisma.studentmentor.count({
            where: { StaffID: staff.StaffID }
        });

        const user = await prisma.user.findFirst({
            where: { UserID: staff.UserID || undefined }
        });

        return NextResponse.json({
            staffName: staff.StaffName,
            email: staff.EmailAddress,
            role: user?.Role || 'STAFF',
            menteeCount
        });

    } catch (error) {
        console.error("Staff Layout API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
