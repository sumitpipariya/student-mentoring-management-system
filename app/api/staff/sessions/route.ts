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

        // Get all mentor assignments for this staff
        const assignments = await prisma.studentmentor.findMany({
            where: { StaffID: staff.StaffID }
        });

        if (assignments.length === 0) {
            return NextResponse.json({ sessions: [], stats: { total: 0, present: 0, absent: 0, pending: 0 } });
        }

        // Get all mentoring sessions
        const allSessions = await prisma.studentmentoring.findMany({
            where: {
                StudentMentorID: {
                    in: assignments.map(a => a.StudentMentorID)
                }
            },
            orderBy: { DateOfMentoring: 'desc' }
        });

        // Enrich sessions with student info
        const enrichedSessions = [];
        for (const session of allSessions) {
            const assignment = assignments.find(
                a => a.StudentMentorID === session.StudentMentorID
            );

            let studentName = 'Unknown';
            let enrollmentNo = 'N/A';
            let studentEmail = 'N/A';
            let studentPhone = 'N/A';

            if (assignment) {
                const student = await prisma.student.findFirst({
                    where: { StudentID: assignment.StudentID }
                });
                studentName = student?.StudentName || 'Unknown';
                enrollmentNo = student?.EnrollmentNo || 'N/A';
                studentEmail = student?.EmailAddress || 'N/A';
                studentPhone = student?.MobileNo || 'N/A';
            }

            enrichedSessions.push({
                id: session.StudentMentoringID,
                studentMentorId: session.StudentMentorID,
                studentName,
                enrollmentNo,
                studentEmail,
                studentPhone,
                dateOfMentoring: session.DateOfMentoring,
                scheduledMeetingDate: session.ScheduledMeetingDate,
                nextMentoringDate: session.NextMentoringDate,
                issuesDiscussed: session.IssuesDiscussed || '',
                mentoringMeetingAgenda: session.MentoringMeetingAgenda || '',
                attendanceStatus: session.AttendanceStatus || 'Pending',
                absentRemarks: session.AbsentRemarks || '',
                isParentPresent: session.IsParentPresent || false,
                parentName: session.ParentName || '',
                parentMobileNo: session.ParentMobileNo || '',
                studentsOpinion: session.StudentsOpinion || '',
                parentsOpinion: session.ParentsOpinion || '',
                staffOpinion: session.StaffOpinion || '',
                stressLevel: session.StressLevel || 'N/A',
                learnerType: session.LearnerType || 'N/A',
                mentoringDocument: session.MentoringDocument || '',
                description: session.Description || '',
                created: session.Created,
                modified: session.Modified
            });
        }

        // Stats
        const total = enrichedSessions.length;
        const present = enrichedSessions.filter(s => s.attendanceStatus === 'Present').length;
        const absent = enrichedSessions.filter(s => s.attendanceStatus === 'Absent').length;
        const pending = total - present - absent;

        return NextResponse.json({
            sessions: enrichedSessions,
            stats: { total, present, absent, pending }
        });

    } catch (error) {
        console.error("Staff Sessions API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Create a new mentoring session
export async function POST(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(userIdRaw);
        const body = await request.json();

        const staff = await prisma.staff.findFirst({
            where: { UserID: userId }
        });

        if (!staff) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        // Find the mentor assignment for this student under this staff
        const assignment = await prisma.studentmentor.findFirst({
            where: {
                StaffID: staff.StaffID,
                StudentID: parseInt(body.studentId)
            },
            orderBy: { FromDate: 'desc' }
        });

        if (!assignment) {
            return NextResponse.json(
                { error: "No mentor assignment found for this student" },
                { status: 404 }
            );
        }

        // Create the mentoring session with all fields
        const newSession = await prisma.studentmentoring.create({
            data: {
                StudentMentorID: assignment.StudentMentorID,
                DateOfMentoring: body.dateOfMentoring ? new Date(body.dateOfMentoring) : new Date(),
                ScheduledMeetingDate: body.scheduledMeetingDate ? new Date(body.scheduledMeetingDate) : null,
                NextMentoringDate: body.nextMentoringDate ? new Date(body.nextMentoringDate) : null,
                IssuesDiscussed: body.issuesDiscussed || null,
                MentoringMeetingAgenda: body.mentoringMeetingAgenda || null,
                AttendanceStatus: body.attendanceStatus || 'Present',
                AbsentRemarks: body.absentRemarks || null,
                IsParentPresent: body.isParentPresent || false,
                ParentName: body.parentName || null,
                ParentMobileNo: body.parentMobileNo || null,
                StudentsOpinion: body.studentsOpinion || null,
                ParentsOpinion: body.parentsOpinion || null,
                StaffOpinion: body.staffOpinion || null,
                StressLevel: body.stressLevel || null,
                LearnerType: body.learnerType || null,
                MentoringDocument: body.mentoringDocument || null,
                Description: body.description || null,
                Created: new Date(),
                Modified: new Date()
            }
        });

        return NextResponse.json({ success: true, session: newSession });

    } catch (error) {
        console.error("Create Session Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
