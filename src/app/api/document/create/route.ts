import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOption";
import { getServerSession } from "next-auth";

export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const newDocument = await db.documentation.create({
            data: {
                title: "Novo Documento",
                content: "Novo Conteúdo",
                userId: session.user.id
            }
        });

        return NextResponse.json(newDocument, { status: 201 });
    } catch (error) {
        console.error("Erro ao criar documento:", error);
        return NextResponse.json({ error: "Erro ao criar documento" }, { status: 500 });
    }
}