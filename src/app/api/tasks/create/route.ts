// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient, TaskType, Owner } from '@prisma/client' // Keep TaskType and Owner for type safety
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, type, date, owner, priority, estimatedTime } = await req.json();

    if (!title || !type) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    try {
        const task = await prisma.task.create({
            data: {
                title,
                type: type as TaskType, // Ensure type is correctly cast
                date: new Date(date),
                owner: owner as Owner, // Ensure owner is correctly cast
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