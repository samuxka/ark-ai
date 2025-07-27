import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const CreateChatSchema = z.object({
  userId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = CreateChatSchema.parse(body);

    const chat = await prisma.chat.create({
      data: {
        title: 'New Chat',
        userId,
      },
    });
    return NextResponse.json({ chatId: chat.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao criar chat' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    const chats = await prisma.chat.findMany({
      where: { userId },
      select: { id: true, title: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(chats);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao listar chats' }, { status: 500 });
  }
}