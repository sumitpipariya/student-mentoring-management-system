import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const mentors = await prisma.staff.count();
        const students = await prisma.student.count();
        const mappings = await prisma.studentmentor.count({
            where: { ToDate: null }
        });
        const highStressAlerts = await prisma.studentmentoring.count({
            where: { StressLevel: 'High' }
        });

        // Recent mappings
        const recentMappingsRaw = await prisma.studentmentor.findMany({
            take: 5,
            orderBy: { StudentMentorID: 'desc' }
        });

        const recentMappings = await Promise.all(
            recentMappingsRaw.map(async (mapping) => {
                const staff = await prisma.staff.findUnique({ where: { StaffID: mapping.StaffID } });
                const student = await prisma.student.findUnique({ where: { StudentID: mapping.StudentID } });
                return {
                    id: mapping.StudentMentorID,
                    StudentName: student?.StudentName || 'Unknown Student',
                    StaffName: staff?.StaffName || 'Unknown Staff',
                    FromDate: mapping.FromDate ? new Date(mapping.FromDate).toLocaleDateString('en-US') : 'N/A',
                    ToDate: mapping.ToDate ? new Date(mapping.ToDate).toLocaleDateString('en-US') : 'Ongoing',
                    Description: mapping.Description
                };
            })
        );

        return NextResponse.json({
            mentors,
            students,
            mappings,
            alerts: highStressAlerts,
            recentMappings
        });
    } catch (error) {
        console.error("Dashboard API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
