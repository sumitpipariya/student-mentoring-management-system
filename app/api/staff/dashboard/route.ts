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

        // Get all mentee assignments for this staff
        const mentorAssignments = await prisma.studentmentor.findMany({
            where: { StaffID: staff.StaffID }
        });

        const totalMentees = mentorAssignments.length;

        // Get all mentoring sessions for this staff's mentees
        const allSessions = await prisma.studentmentoring.findMany({
            where: {
                StudentMentorID: {
                    in: mentorAssignments.map(a => a.StudentMentorID)
                }
            },
            orderBy: { DateOfMentoring: 'desc' }
        });

        // Calculate attendance percentage
        let attendancePercentage = 100;
        if (allSessions.length > 0) {
            const presentCount = allSessions.filter((s: any) => s.AttendanceStatus === 'Present').length;
            attendancePercentage = Math.round((presentCount / allSessions.length) * 100);
        }

        // Count high stress students
        const highStressCount = allSessions.filter(
            (s: any) => s.StressLevel === 'High'
        ).length;

        // Get pending feedback (sessions without StaffOpinion)
        const pendingFeedbackCount = allSessions.filter(
            (s: any) => !s.StaffOpinion || s.StaffOpinion.trim() === ''
        ).length;

        // Get upcoming sessions
        const upcomingSessions = await prisma.studentmentoring.findMany({
            where: {
                StudentMentorID: {
                    in: mentorAssignments.map(a => a.StudentMentorID)
                },
                ScheduledMeetingDate: { gte: new Date() }
            },
            orderBy: { ScheduledMeetingDate: 'asc' },
            take: 5
        });

        // Get recent mentee activity (latest sessions with student info)
        const recentActivity = [];
        for (const session of allSessions.slice(0, 5)) {
            const assignment = mentorAssignments.find(
                a => a.StudentMentorID === session.StudentMentorID
            );
            if (assignment) {
                const student = await prisma.student.findFirst({
                    where: { StudentID: assignment.StudentID }
                });
                recentActivity.push({
                    studentName: student?.StudentName || 'Unknown',
                    enrollmentNo: student?.EnrollmentNo || 'N/A',
                    lastMeeting: session.DateOfMentoring,
                    stressLevel: session.StressLevel || 'N/A',
                    attendance: session.AttendanceStatus || 'N/A'
                });
            }
        }

        return NextResponse.json({
            staff,
            totalMentees,
            attendancePercentage,
            highStressCount,
            pendingFeedbackCount,
            upcomingSessions,
            recentActivity,
            chartData: {
                labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                data: [85, 88, 92, 94, attendancePercentage]
            }
        });

    } catch (error) {
        console.error("Staff Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
