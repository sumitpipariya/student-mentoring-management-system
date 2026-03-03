import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        // Find the student first to get UserID
        const student = await prisma.student.findUnique({
            where: { StudentID: id },
        });

        if (!student) {
            return NextResponse.json({ error: "Student not found" }, { status: 404 });
        }

        // Delete mappings related to this student first to avoid foreign key errors
        await prisma.studentmentor.deleteMany({
            where: { StudentID: id },
        });

        // Delete Student Record
        await prisma.student.delete({
            where: { StudentID: id },
        });

        // Optionally, Delete the linked User identity
        if (student.UserID) {
            await prisma.user.delete({
                where: { UserID: student.UserID }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Student Deletion Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);
        const data = await request.json();

        // Ensure we don't update UserID or StudentID directly from form data if they are passed
        const { StudentID, UserID, Password, ...updateData } = data;

        const updatedStudent = await prisma.student.update({
            where: { StudentID: id },
            data: updateData,
        });

        // If a password was provided and we need to update the User record, we'd do it here. 
        // For now, form ignores password for edit.

        return NextResponse.json(updatedStudent);
    } catch (error: any) {
        console.error("Student Update Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update student" }, { status: 500 });
    }
}
