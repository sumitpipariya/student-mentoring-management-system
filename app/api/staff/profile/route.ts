import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userId = parseInt(userIdRaw);

        const staff = await prisma.staff.findFirst({
            where: { UserID: userId }
        });

        if (!staff) {
            return NextResponse.json(
                { error: "Staff not found" },
                { status: 404 }
            );
        }

        const user = await prisma.user.findFirst({
            where: { UserID: staff.UserID || undefined }
        });

        return NextResponse.json({
            staffId: staff.StaffID,
            name: staff.StaffName || 'Unknown Staff',
            email: staff.EmailAddress || 'No Email',
            phone: staff.MobileNo || 'No Phone',
            description: staff.Description || 'No description provided.',
            username: user?.Username || 'Not setup',
            role: user?.Role || 'STAFF',
            joined: staff.Created
                ? new Date(staff.Created).toLocaleString('en-us', {
                    month: 'long',
                    year: 'numeric'
                })
                : 'Unknown'
        });

    } catch (error) {
        console.error("Staff Profile API Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const userIdRaw = request.cookies.get('userId')?.value;
        if (!userIdRaw) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userId = parseInt(userIdRaw);

        const body = await request.json();
        const staff = await prisma.staff.findFirst({
            where: { UserID: userId }
        });

        if (!staff) {
            return NextResponse.json(
                { error: "Staff not found" },
                { status: 404 }
            );
        }

        const updatedStaff = await prisma.staff.update({
            where: { StaffID: staff.StaffID },
            data: {
                StaffName: body.name,
                EmailAddress: body.email,
                MobileNo: body.phone,
                Description: body.description,
                Modified: new Date()
            }
        });

        return NextResponse.json({ success: true, staff: updatedStaff });

    } catch (error) {
        console.error("Update Staff Profile Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
