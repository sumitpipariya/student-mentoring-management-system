import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const studentId = parseInt(id);

        if (isNaN(studentId)) {
            return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
        }

        const student = await prisma.student.findFirst({
            where: { StudentID: studentId }
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Get the mentor assignment for this student
        const assignment = await prisma.studentmentor.findFirst({
            where: { StudentID: studentId },
            orderBy: { FromDate: 'desc' }
        });

        let sessions: any[] = [];
        let attendancePercentage = 0;
        let latestSession = null;

        if (assignment) {
            sessions = await prisma.studentmentoring.findMany({
                where: { StudentMentorID: assignment.StudentMentorID },
                orderBy: { DateOfMentoring: 'desc' }
            });

            if (sessions.length > 0) {
                latestSession = sessions[0];
                const presentCount = sessions.filter((s: any) => s.AttendanceStatus === 'Present').length;
                attendancePercentage = Math.round((presentCount / sessions.length) * 100);
            }
        }

        // Build mentoring history
        const mentoringHistory = sessions.map((session: any) => ({
            id: session.StudentMentoringID,
            date: session.DateOfMentoring,
            agenda: session.MentoringMeetingAgenda || 'General Session',
            status: session.AttendanceStatus || 'Pending',
            stressLevel: session.StressLevel || 'N/A',
            learnerType: session.LearnerType || 'N/A',
            issues: session.IssuesDiscussed || '',
            staffOpinion: session.StaffOpinion || '',
            studentOpinion: session.StudentsOpinion || ''
        }));

        return NextResponse.json({
            student: {
                id: student.StudentID,
                name: student.StudentName,
                enrollmentNo: student.EnrollmentNo,
                email: student.EmailAddress || 'N/A',
                phone: student.MobileNo || 'N/A',
                parentName: student.ParentName || 'N/A',
                parentPhone: student.ParentMobileNo || 'N/A',
                description: student.Description || '',
                joined: student.Created
            },
            stats: {
                stressLevel: latestSession?.StressLevel || 'N/A',
                learnerType: latestSession?.LearnerType || 'N/A',
                attendancePercentage,
                totalSessions: sessions.length
            },
            mentoringHistory,
            assignment: assignment ? {
                fromDate: assignment.FromDate,
                toDate: assignment.ToDate,
                status: assignment.ToDate ? 'Inactive' : 'Active'
            } : null
        });

    } catch (error) {
        console.error("Mentee Detail API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
