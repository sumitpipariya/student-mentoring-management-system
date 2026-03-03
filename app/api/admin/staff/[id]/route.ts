import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        // Find the staff first to get UserID
        const staff = await prisma.staff.findUnique({
            where: { StaffID: id },
        });

        if (!staff) {
            return NextResponse.json({ error: "Staff not found" }, { status: 404 });
        }

        // Delete mappings related to this staff first to avoid foreign key errors
        await prisma.studentmentor.deleteMany({
            where: { StaffID: id },
        });

        // Delete Staff Record
        await prisma.staff.delete({
            where: { StaffID: id },
        });

        // Optionally, Delete the linked User identity
        if (staff.UserID) {
            await prisma.user.delete({
                where: { UserID: staff.UserID }
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Staff Deletion Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);
        const data = await request.json();

        // Ensure we don't update UserID or StaffID directly
        const { StaffID, UserID, Password, ...updateData } = data;

        const updatedStaff = await prisma.staff.update({
            where: { StaffID: id },
            data: updateData,
        });

        return NextResponse.json(updatedStaff);
    } catch (error: any) {
        console.error("Staff Update Error:", error);
        return NextResponse.json({ error: error.message || "Failed to update staff" }, { status: 500 });
    }
}
