import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// GET: Fetch all mentoring sessions for the staff's mentees
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

        // For each assignment, get the associated student and latest session
        const sessions = [];
        for (const assignment of assignments) {
            const student = await prisma.student.findFirst({
                where: { StudentID: assignment.StudentID }
            });

            const latestSession = await prisma.studentmentoring.findFirst({
                where: { StudentMentorID: assignment.StudentMentorID },
                orderBy: { DateOfMentoring: 'desc' }
            });

            sessions.push({
                id: assignment.StudentMentorID,
                studentId: student?.StudentID,
                name: student?.StudentName || 'Unknown',
                enrollment: student?.EnrollmentNo || 'N/A',
                type: latestSession?.LearnerType || 'N/A',
                nextDate: latestSession?.NextMentoringDate || latestSession?.ScheduledMeetingDate || null,
                lastDate: latestSession?.DateOfMentoring || null,
                stressLevel: latestSession?.StressLevel || 'N/A'
            });
        }

        return NextResponse.json({ sessions });

    } catch (error) {
        console.error("Staff Mentoring API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create a new mentoring session
export async function POST(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userId = parseInt(userIdRaw);

        const body = await request.json();

        const staff = await prisma.staff.findFirst({
            where: { UserID: userId }
        });
        if (!staff) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        // Find the mentor assignment for this student
        const assignment = await prisma.studentmentor.findFirst({
            where: {
                StaffID: staff.StaffID,
                StudentID: body.studentId
            },
            orderBy: { FromDate: 'desc' }
        });

        if (!assignment) {
            return NextResponse.json(
                { error: "No mentor assignment found for this student" },
                { status: 404 }
            );
        }

        // Create the mentoring session
        const newSession = await prisma.studentmentoring.create({
            data: {
                StudentMentorID: assignment.StudentMentorID,
                DateOfMentoring: body.date ? new Date(body.date) : new Date(),
                ScheduledMeetingDate: body.scheduledDate ? new Date(body.scheduledDate) : null,
                NextMentoringDate: body.nextDate ? new Date(body.nextDate) : null,
                IssuesDiscussed: body.issues || null,
                MentoringMeetingAgenda: body.agenda || null,
                AttendanceStatus: body.attendance || 'Present',
                StressLevel: body.stressLevel || null,
                LearnerType: body.learnerType || null,
                StaffOpinion: body.staffOpinion || null,
                StudentsOpinion: body.studentOpinion || null,
                IsParentPresent: body.isParentPresent || false,
                ParentName: body.parentName || null,
                ParentMobileNo: body.parentMobileNo || null,
                ParentsOpinion: body.parentOpinion || null,
                Description: body.description || null,
                Created: new Date(),
                Modified: new Date()
            }
        });

        return NextResponse.json({ success: true, session: newSession });

    } catch (error) {
        console.error("Create Mentoring Session Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
