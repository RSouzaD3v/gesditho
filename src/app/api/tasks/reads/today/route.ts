import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client' // Keep TaskType and Owner for type safety
import { authOptions } from '@/lib/authOption'; 
import { getServerSession } from "next-auth";

const prisma = new PrismaClient()

export async function GET() {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const getTaskToday = await prisma.task.findMany({
            where: {
                date: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)), // Start of today
                    lt: new Date(new Date().setHours(23, 59, 59, 999)) // End of today
                }
            }
        });

        return NextResponse.json({ getTaskToday }, { status: 200 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}