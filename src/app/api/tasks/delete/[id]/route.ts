// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client' // Keep TaskType and Owner for type safety
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUrl = req.nextUrl.pathname.split("/").pop();

    try {
        await prisma.task.delete({
            where: {
                id: Number(idUrl),
            }
        });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}