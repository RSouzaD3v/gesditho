import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'; // Keep TaskType and Owner for type safety
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions); // Ensure authOptions is correctly typed as discussed previously

    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const idUrl = req.nextUrl.pathname.split("/").pop();

    try {
        const document = await db.documentation.findUnique({
            where: {
                id: idUrl,
            }
        });

        if (!document) {
            return NextResponse.json({ error: 'Document not found' }, { status: 404 });
        }

        return NextResponse.json(document, { status: 200 });
    } catch (error) {
        console.error('Error fetching document:', error);
        return NextResponse.json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}