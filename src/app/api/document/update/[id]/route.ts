// app/api/tasks/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'; // Keep TaskType and Owner for type safety
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    const { title, content } = await req.json();

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUrl = req.nextUrl.pathname.split("/").pop();

    try {
        await db.documentation.update({
            where: {
                id: idUrl,
            },
            data: {
                title,
                content,
            }
        });

        return NextResponse.json({ message: 'Task deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error creating task:', error);
        return NextResponse.json({ error: 'Failed to create task' }, { status: 500 });
    }
}