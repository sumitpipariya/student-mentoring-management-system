import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userId = parseInt(userIdRaw);

        const staff = await prisma.staff.findFirst({
            where: { UserID: userId }
        });

        if (!staff) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        // Get all mentor assignments for this staff
        const assignments = await prisma.studentmentor.findMany({
            where: { StaffID: staff.StaffID }
        });

        if (assignments.length === 0) {
            return NextResponse.json({ sessions: [] });
        }

        // Get all mentoring sessions for all assignments
        const allSessions = await prisma.studentmentoring.findMany({
            where: {
                StudentMentorID: {
                    in: assignments.map(a => a.StudentMentorID)
                }
            },
            orderBy: { DateOfMentoring: 'desc' }
        });

        // Map each session to include student info
        const historyData = [];
        for (const session of allSessions) {
            const assignment = assignments.find(
                a => a.StudentMentorID === session.StudentMentorID
            );

            let studentName = 'Unknown';
            let enrollmentNo = 'N/A';

            if (assignment) {
                const student = await prisma.student.findFirst({
                    where: { StudentID: assignment.StudentID }
                });
                studentName = student?.StudentName || 'Unknown';
                enrollmentNo = student?.EnrollmentNo || 'N/A';
            }

            historyData.push({
                id: session.StudentMentoringID,
                studentName,
                enrollmentNo,
                date: session.DateOfMentoring,
                agenda: session.MentoringMeetingAgenda || 'General Session',
                status: session.AttendanceStatus || 'Pending',
                stressLevel: session.StressLevel || 'N/A',
                learnerType: session.LearnerType || 'N/A',
                issues: session.IssuesDiscussed || '',
                staffOpinion: session.StaffOpinion || '',
                nextDate: session.NextMentoringDate
            });
        }

        return NextResponse.json({ sessions: historyData });

    } catch (error) {
        console.error("Staff Mentoring History API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
