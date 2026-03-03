import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const staff = await prisma.staff.findMany({
            orderBy: { StaffID: 'desc' },
        });

        const transformedStaff = staff.map(s => ({
            ...s,
            id: s.StaffID
        }));

        return NextResponse.json(transformedStaff);
    } catch (error) {
        console.error("Staff API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const data = await request.json();

        // Use Prisma Transaction to create user then staff
        const result = await prisma.$transaction(async (tx) => {
            // Create user account first to link
            const newUser = await tx.user.create({
                data: {
                    Username: data.EmailAddress, // using email as username
                    Password: data.Password || 'staff123',
                    Role: 'STAFF'
                }
            });

            // Create staff record linked to new UserID
            const newStaff = await tx.staff.create({
                data: {
                    StaffName: data.StaffName,
                    EmailAddress: data.EmailAddress,
                    MobileNo: data.MobileNo,
                    Description: data.Description,
                    UserID: newUser.UserID,
                }
            });

            return newStaff;
        });

        return NextResponse.json({ ...result, id: result.StaffID });
    } catch (error) {
        console.error("Staff Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
