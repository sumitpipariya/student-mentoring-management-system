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

        let nextSession = null;
        let latestSession = null;
        let attendancePercentage = 100;

        if (currentMentorAssignment) {
            const sessions = await prisma.studentmentoring.findMany({
                where: { StudentMentorID: currentMentorAssignment.StudentMentorID },
                orderBy: { DateOfMentoring: 'desc' }
            });

            if (sessions.length > 0) {
                latestSession = sessions[0];
                const presentCount = sessions.filter((s: any) => s.AttendanceStatus === 'Present').length;
                attendancePercentage = Math.round((presentCount / sessions.length) * 100);
            }

            const upcomingSession = await prisma.studentmentoring.findFirst({
                where: {
                    StudentMentorID: currentMentorAssignment.StudentMentorID,
                    ScheduledMeetingDate: { gte: new Date() }
                },
                orderBy: { ScheduledMeetingDate: 'asc' }
            });

            if (upcomingSession) {
                nextSession = upcomingSession;
            }
        }

        return NextResponse.json({
            student,
            attendancePercentage,
            stressLevel: latestSession?.StressLevel || 'Moderate',
            learnerType: latestSession?.LearnerType || 'Visual',
            nextSessionDate: nextSession?.ScheduledMeetingDate || latestSession?.NextMentoringDate || null,
            nextSessionAgenda: nextSession?.MentoringMeetingAgenda || 'General Review',
            chartData: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                data: [85, 88, 92, 94, attendancePercentage]
            }
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
