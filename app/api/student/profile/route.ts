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
            // Return default profile so the page still renders
            const user = await prisma.user.findFirst({ where: { UserID: userId } });
            return NextResponse.json({
                name: user?.Username || 'Student',
                enrollmentNo: 'N/A',
                email: 'Not set',
                phone: 'Not set',
                description: 'No description provided.',
                parentName: 'Not provided',
                parentMobileNo: 'Not provided',
                username: user?.Username || 'Not setup',
                role: user?.Role || 'STUDENT',
                joined: 'Unknown'
            });
        }

        let user = null;
        if (student.UserID) {
            user = await prisma.user.findFirst({
                where: { UserID: student.UserID }
            });
        }

        return NextResponse.json({
            name: student.StudentName || 'Unknown Student',
            enrollmentNo: student.EnrollmentNo || 'N/A',
            email: student.EmailAddress || 'No Email',
            phone: student.MobileNo || 'No Phone',
            description: student.Description || 'No description provided.',
            parentName: student.ParentName || 'Not provided',
            parentMobileNo: student.ParentMobileNo || 'Not provided',
            username: user?.Username || 'Not setup',
            role: user?.Role || 'STUDENT',
            joined: student.Created
                ? new Date(student.Created).toLocaleString('en-us', {
                    month: 'long',
                    year: 'numeric'
                })
                : 'Unknown'
        });

    } catch (error) {
        console.error("Profile API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = parseInt(userIdRaw);
        const body = await request.json();

        const student = await prisma.student.findFirst({
            where: { UserID: userId }
        });

        if (!student) {
            return NextResponse.json(
                { error: "Student not found" },
                { status: 404 }
            );
        }

        const updatedStudent = await prisma.student.update({
            where: { StudentID: student.StudentID },
            data: {
                StudentName: body.name,
                EmailAddress: body.email,
                MobileNo: body.phone,
                Description: body.description,
                ParentName: body.parentName,
                ParentMobileNo: body.parentMobileNo,
                Modified: new Date()
            }
        });

        return NextResponse.json({ success: true, student: updatedStudent });

    } catch (error) {
        console.error("Update Profile Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}