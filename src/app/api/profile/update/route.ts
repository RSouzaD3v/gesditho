import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { userId, name } = await req.json();

  if (!userId || !name) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  await db.user.update({
    where: { id: userId },
    data: { name },
  });

  return NextResponse.json({ ok: true });
}
