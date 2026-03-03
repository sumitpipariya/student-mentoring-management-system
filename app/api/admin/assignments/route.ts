import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const assignmentsRaw = await prisma.studentmentor.findMany({
            orderBy: { StudentMentorID: 'desc' },
        });

        const assignments = await Promise.all(
            assignmentsRaw.map(async (mapping) => {
                const staff = await prisma.staff.findUnique({ where: { StaffID: mapping.StaffID } });
                const student = await prisma.student.findUnique({ where: { StudentID: mapping.StudentID } });

                return {
                    id: mapping.StudentMentorID,
                    StaffName: staff?.StaffName || 'Unknown Staff',
                    StudentName: student?.StudentName || 'Unknown Student',
                    StudentID: mapping.StudentID,
                    StaffID: mapping.StaffID,
                    FromDate: mapping.FromDate ? new Date(mapping.FromDate).toISOString().split('T')[0] : '',
                    ToDate: mapping.ToDate ? new Date(mapping.ToDate).toISOString().split('T')[0] : 'Ongoing',
                    Description: mapping.Description || ''
                };
            })
        );

        return NextResponse.json(assignments);
    } catch (error) {
        console.error("Assignments API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Validate
        if (!data.StaffID || !data.StudentID || !data.FromDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const newAssignment = await prisma.studentmentor.create({
            data: {
                StaffID: parseInt(data.StaffID),
                StudentID: parseInt(data.StudentID),
                FromDate: new Date(data.FromDate),
                ToDate: data.ToDate && data.ToDate !== 'Ongoing' ? new Date(data.ToDate) : null,
                Description: data.Description || null,
            }
        });

        const staff = await prisma.staff.findUnique({ where: { StaffID: newAssignment.StaffID } });
        const student = await prisma.student.findUnique({ where: { StudentID: newAssignment.StudentID } });

        return NextResponse.json({
            id: newAssignment.StudentMentorID,
            StaffName: staff?.StaffName || 'Unknown Staff',
            StudentName: student?.StudentName || 'Unknown Student',
            FromDate: newAssignment.FromDate ? new Date(newAssignment.FromDate).toISOString().split('T')[0] : '',
            ToDate: newAssignment.ToDate ? new Date(newAssignment.ToDate).toISOString().split('T')[0] : 'Ongoing',
            Description: newAssignment.Description
        });
    } catch (error) {
        console.error("Assignment Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
