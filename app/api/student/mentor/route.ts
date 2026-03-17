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
            return NextResponse.json({
                assigned: false,
                staff: null,
                assignment: null,
                latestSession: null
            });
        }

        const staff = await prisma.staff.findFirst({
            where: { StaffID: currentMentorAssignment.StaffID }
        });

        const latestSession = await prisma.studentmentoring.findFirst({
            where: { StudentMentorID: currentMentorAssignment.StudentMentorID },
            orderBy: { DateOfMentoring: 'desc' }
        });

        return NextResponse.json({
            assigned: true,
            staff: {
                name: staff?.StaffName || 'Unknown',
                role: 'Faculty Mentor',
                email: staff?.EmailAddress || 'Not Provided',
                phone: staff?.MobileNo || 'Not Provided',
                dept: staff?.Description || 'Department not set',
                description: staff?.Description || 'No description available',
            },
            assignment: {
                fromDate: currentMentorAssignment.FromDate,
                status: "Active"
            },
            latestSession: {
                date: latestSession?.DateOfMentoring,
                stressLevel: latestSession?.StressLevel || 'N/A',
                learnerType: latestSession?.LearnerType || 'N/A',
                attendance: latestSession?.AttendanceStatus || 'N/A',
                agenda: latestSession?.MentoringMeetingAgenda || 'N/A',
                issues: latestSession?.IssuesDiscussed || 'N/A',
                staffOpinion: latestSession?.StaffOpinion || 'N/A'
            }
        });

    } catch (error) {
        console.error("Mentor API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

