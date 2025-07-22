// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client' // Keep TaskType and Owner for type safety
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    const { title, type, date, owner, priority, estimatedTime } = await req.json();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUrl = req.nextUrl.pathname.split("/").pop();

    try {
        await prisma.task.update({
            where: {
                id: Number(idUrl),
            },
            data: {
                title,
                type,
                date: new Date(date),
                owner,
                priority: priority.toString(), // Convert priority to string if needed
                estimatedTime: new Date(estimatedTime),
            }
        });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}