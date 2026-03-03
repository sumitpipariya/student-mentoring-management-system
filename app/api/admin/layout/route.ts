import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        const userRole = request.cookies.get('userRole')?.value;

        if (!userIdRaw) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(userIdRaw);

        const user = await prisma.user.findUnique({
            where: { UserID: userId }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get counts for admin overview
        const totalMentors = await prisma.staff.count();
        const totalStudents = await prisma.student.count();
        const totalAssignments = await prisma.studentmentor.count();

        return NextResponse.json({
            username: user.Username,
            role: user.Role,
            userId: user.UserID,
            totalMentors,
            totalStudents,
            totalAssignments
        });

    } catch (error) {
        console.error("Admin Layout API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
