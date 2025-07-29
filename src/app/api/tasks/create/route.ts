// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client' // Keep TaskType and Owner for type safety
import { authOptions } from '@/lib/authOption';
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, type, date, priority, estimatedTime } = await req.json();

    if (!title || !type) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const task = await prisma.task.create({
            data: {
                title,
                taskType: type, // Ensure type is correctly cast
                date: new Date(date),
                priority: priority.toString(), // Convert priority to number
                estimatedTime: new Date(estimatedTime),
                userId: session.user.id, // Use session user ID
            },
        });

        return NextResponse.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}