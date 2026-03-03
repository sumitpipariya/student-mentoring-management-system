import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: paramId } = await params;
        const id = parseInt(paramId);

        // Delete related mentoring sessions first if necessary
        await prisma.studentmentoring.deleteMany({
            where: { StudentMentorID: id },
        });

        await prisma.studentmentor.delete({
            where: { StudentMentorID: id },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Assignment Deletion Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
