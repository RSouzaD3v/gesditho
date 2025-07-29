// app/api/tasks/completed/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/lib/authOption';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = parseInt(params.id);

  if (isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: { isCompleted: true },
    });

    return NextResponse.json({ task }, { status: 200 });
  } catch (error) {
    console.error('Erro ao completar tarefa:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
