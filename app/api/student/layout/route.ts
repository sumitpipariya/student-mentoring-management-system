import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(userIdRaw);

        const student = await prisma.student.findFirst({
            where: { UserID: userId }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        const currentMentorAssignment = await prisma.studentmentor.findFirst({
            where: { StudentID: student.StudentID },
            orderBy: { FromDate: 'desc' }
        });

        let mentorName = "Unassigned";

        if (currentMentorAssignment) {
            const staff = await prisma.staff.findFirst({
                where: { StaffID: currentMentorAssignment.StaffID }
            });
            if (staff) {
                mentorName = staff.StaffName;
            }
        }

        return NextResponse.json({
            studentName: student.StudentName,
            enrollmentNo: student.EnrollmentNo,
            email: student.EmailAddress,
            mentorName: mentorName
        });

    } catch (error) {
        console.error("Layout API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
