import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const students = await prisma.student.findMany({
            orderBy: { StudentID: 'desc' },
        });

        const transformedStudents = students.map(s => ({
            ...s,
            id: s.StudentID,
            created: s.Created.toISOString().split('T')[0]
        }));

        return NextResponse.json(transformedStudents);
    } catch (error) {
        console.error("Students API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Use Prisma Transaction to create user then student
        const result = await prisma.$transaction(async (tx) => {
            // Create user account first to link
            const newUser = await tx.user.create({
                data: {
                    Username: data.EnrollmentNo, // using enrollment no as username
                    Password: data.Password || 'student123',
                    Role: 'STUDENT'
                }
            });

            // Create student record linked to new UserID
            const newStudent = await tx.student.create({
                data: {
                    StudentName: data.StudentName,
                    EnrollmentNo: data.EnrollmentNo,
                    EmailAddress: data.EmailAddress,
                    MobileNo: data.MobileNo,
                    Description: data.Description || null,
                    ParentName: data.ParentName || null,
                    ParentMobileNo: data.ParentMobileNo || null,
                    UserID: newUser.UserID,
                }
            });

            return newStudent;
        });

        return NextResponse.json({
            ...result,
            id: result.StudentID,
            created: result.Created.toISOString().split('T')[0]
        });
    } catch (error) {
        console.error("Student Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
