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

        // Get all mentor assignments for this staff member
        const mentorAssignments = await prisma.studentmentor.findMany({
            where: { StaffID: staff.StaffID }
        });

        if (mentorAssignments.length === 0) {
            return NextResponse.json({ mentees: [] });
        }

        // For each assignment, get the student details and latest session info
        const mentees = [];
        for (const assignment of mentorAssignments) {
            const student = await prisma.student.findFirst({
                where: { StudentID: assignment.StudentID }
            });

            // Get the latest mentoring session for stress/learner type info
            const latestSession = await prisma.studentmentoring.findFirst({
                where: { StudentMentorID: assignment.StudentMentorID },
                orderBy: { DateOfMentoring: 'desc' }
            });

            // Get next mentoring date
            const nextSession = await prisma.studentmentoring.findFirst({
                where: {
                    StudentMentorID: assignment.StudentMentorID,
                    ScheduledMeetingDate: { gte: new Date() }
                },
                orderBy: { ScheduledMeetingDate: 'asc' }
            });

            mentees.push({
                id: student?.StudentID,
                name: student?.StudentName || 'Unknown',
                roll: student?.EnrollmentNo || 'N/A',
                email: student?.EmailAddress || 'N/A',
                phone: student?.MobileNo || 'N/A',
                parentName: student?.ParentName || 'N/A',
                parentMobileNo: student?.ParentMobileNo || 'N/A',
                stress: latestSession?.StressLevel || 'N/A',
                type: latestSession?.LearnerType || 'N/A',
                dept: 'Engineering',
                assignedFrom: assignment.FromDate,
                nextMentoringDate: nextSession?.ScheduledMeetingDate || latestSession?.NextMentoringDate || null
            });
        }

        return NextResponse.json({ mentees });

    } catch (error) {
        console.error("Staff Mentees API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
