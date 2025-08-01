import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendToAi } from '@/lib/ai-api';
import { z } from 'zod';

const MessageSchema = z.object({
  content: z.string().min(1),
  role: z.enum(['user', 'assistant']),
  userId: z.string(),
  chatId: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { content, role, userId, chatId } = MessageSchema.parse(body);

    // Verificar se o chat pertence ao usuário
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId },
    });
    if (!chat) {
      console.error('Chat não encontrado ou não autorizado:', { chatId, userId });
      return NextResponse.json({ error: 'Chat não encontrado ou não autorizado' }, { status: 403 });
    }

    // Verificar se é a primeira mensagem do chat
    if (!chat.hasFirstMessage && role === 'user') {
      await prisma.chat.update({
        where: { id: chatId },
        data: { hasFirstMessage: true },
      });
      console.log('hasFirstMessage atualizado para true no chat:', chatId);
    }

    // Salvar mensagem do usuário
    const userMessage = await prisma.message.create({
      data: {
        content,
        role,
        userId,
        chatId,
      },
    });

    // Se for mensagem do usuário, obter resposta do bot
    let botResponse = '';
    if (role === 'user') {
      botResponse = await sendToAi(content, userId);
      await prisma.message.create({
        data: {
          content: botResponse,
          role: 'assistant',
          userId,
          chatId,
        },
      });
    }

    return NextResponse.json({ message: userMessage, assistantMessage: botResponse });
  } catch (error) {
    console.error('Erro ao salvar mensagem:', error);
    return NextResponse.json({ error: 'Erro ao salvar mensagem' }, { status: 500 });
  }
}