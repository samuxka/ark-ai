import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    const chat = await prisma.chat.findFirst({
      where: { id: params.id, userId },
      include: {
        messages: {
          orderBy: { createdAt: 'asc' },
          select: { id: true, content: true, role: true, createdAt: true },
        },
      },
    });
    if (!chat) {
      return NextResponse.json({ error: 'Chat não encontrado ou não autorizado' }, { status: 404 });
    }

    return NextResponse.json({ chat, messages: chat.messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao carregar chat' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    const chat = await prisma.chat.findFirst({
      where: { id: params.id, userId },
    });
    if (!chat) {
      return NextResponse.json({ error: 'Chat não encontrado ou não autorizado' }, { status: 404 });
    }

    await prisma.chat.delete({
      where: { id: params.id },
    });
    return NextResponse.json({ message: 'Chat deletado' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao deletar chat' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const body = await request.json();
    const { title } = z.object({ title: z.string().min(1) }).parse(body);

    if (!userId) {
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 });
    }

    const chat = await prisma.chat.findFirst({
      where: { id: params.id, userId },
    });
    if (!chat) {
      return NextResponse.json({ error: 'Chat não encontrado ou não autorizado' }, { status: 404 });
    }

    const updatedChat = await prisma.chat.update({
      where: { id: params.id },
      data: { title },
    });
    return NextResponse.json(updatedChat);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar chat' }, { status: 500 });
  }
}