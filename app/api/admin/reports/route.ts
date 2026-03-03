import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const totalMentors = await prisma.staff.count();
        const totalMentees = await prisma.student.count();
        const totalSessions = await prisma.studentmentoring.count();

        // Calculate Average Stress Level roughly based on high/medium/low distribution
        const highStress = await prisma.studentmentoring.count({ where: { StressLevel: 'High' } });
        const mediumStress = await prisma.studentmentoring.count({ where: { StressLevel: 'Medium' } });
        const lowStress = await prisma.studentmentoring.count({ where: { StressLevel: 'Low' } });

        let avgStressLevel = 'Low';
        if (highStress > (mediumStress + lowStress) / 2) {
            avgStressLevel = 'High';
        } else if (mediumStress > lowStress) {
            avgStressLevel = 'Medium';
        }

        const mentors = await prisma.staff.findMany();
        const students = await prisma.student.findMany();
        const studentMentors = await prisma.studentmentor.findMany();
        const mentorings = await prisma.studentmentoring.findMany({
            orderBy: { DateOfMentoring: 'desc' }
        });

        const mentorWise = mentors.map(mentor => {
            const assignedMentees = studentMentors.filter(sm => sm.StaffID === mentor.StaffID);
            const menteeCount = assignedMentees.length;
            const smIds = assignedMentees.map(sm => sm.StudentMentorID);
            const mentorSessions = mentorings.filter(m => smIds.includes(m.StudentMentorID));

            const completedPercentage = menteeCount > 0 ? Math.min(100, Math.round((mentorSessions.length / (menteeCount * 2)) * 100)) : 0;
            const lastActivity = mentorSessions.length > 0 && mentorSessions[0].DateOfMentoring
                ? mentorSessions[0].DateOfMentoring.toISOString().split('T')[0]
                : 'N/A';

            return {
                id: mentor.StaffID,
                name: mentor.StaffName,
                department: mentor.Description || 'General',
                menteeCount,
                completedPercentage,
                lastActivity
            };
        });

        const progress = students.map(student => {
            const assignedMentor = studentMentors.find(sm => sm.StudentID === student.StudentID);
            const mentor = mentors.find(m => m.StaffID === assignedMentor?.StaffID);

            let stressLevel = 'Low';
            let learnerType = 'Standard';
            let lastActivity = 'N/A';
            let progressPercentage = 0;

            if (assignedMentor) {
                const studentSessions = mentorings.filter(m => m.StudentMentorID === assignedMentor.StudentMentorID);
                if (studentSessions.length > 0) {
                    stressLevel = studentSessions[0].StressLevel || 'Low';
                    learnerType = studentSessions[0].LearnerType || 'Standard';
                    if (studentSessions[0].DateOfMentoring) {
                        lastActivity = studentSessions[0].DateOfMentoring.toISOString().split('T')[0];
                    }
                    progressPercentage = Math.min(100, studentSessions.length * 20);
                }
            }

            return {
                id: student.StudentID,
                name: student.StudentName,
                enrollmentNo: student.EnrollmentNo,
                mentorName: mentor ? mentor.StaffName : 'Unassigned',
                stressLevel,
                learnerType,
                lastActivity,
                progressPercentage
            };
        });

        return NextResponse.json({
            totalMentors,
            totalMentees,
            totalSessions,
            avgStressLevel,
            mentorWise,
            progress
        });
    } catch (error) {
        console.error("Reports API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
