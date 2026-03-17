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

        if (!currentMentorAssignment) {
            return NextResponse.json({ sessions: [] });
        }

        const staff = await prisma.staff.findFirst({
            where: { StaffID: currentMentorAssignment.StaffID }
        });

        const sessions = await prisma.studentmentoring.findMany({
            where: { StudentMentorID: currentMentorAssignment.StudentMentorID },
            orderBy: { DateOfMentoring: 'desc' }
        });

        // Map DB data to frontend shape
        const historyData = sessions.map((session: any) => ({
            id: session.StudentMentoringID,
            date: session.DateOfMentoring,
            mentor: staff?.StaffName || 'Unknown',
            agenda: session.MentoringMeetingAgenda || 'General Session',
            status: session.AttendanceStatus || 'Pending',
            stress: session.StressLevel || 'N/A',
            learner: session.LearnerType || 'N/A'
        }));

        return NextResponse.json({ sessions: historyData });
    } catch (error) {
        console.error("History API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
