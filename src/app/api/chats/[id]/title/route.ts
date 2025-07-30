import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const TitleSchema = z.object({
  content: z.string().min(1),
  userId: z.string(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { content, userId } = TitleSchema.parse(body);
    const chatId = params.id;

    // Verificar se o chat pertence ao usuário
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userId },
    });
    if (!chat) {
      console.error('Chat não encontrado ou não autorizado:', { chatId, userId });
      return NextResponse.json({ error: 'Chat não encontrado ou não autorizado' }, { status: 403 });
    }

    // Gerar título com IA
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Com base na mensagem a seguir, gere um título curto (máximo 6 palavras) em português, que resuma o tema da conversa bíblica:
      Mensagem: "${content}"
      Retorne apenas o título, sem explicações, listas ou formatação Markdown.
    `;
    const result = await model.generateContent(prompt);
    const title = result.response.text().trim().slice(0, 50);
    console.log('Resposta da Gemini:', result.response.text());
    console.log('Título gerado:', title);

    // Atualizar título do chat
    await prisma.chat.update({
      where: { id: chatId },
      data: { title },
    });

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Erro ao gerar título:', error);
    return NextResponse.json({ error: 'Erro ao gerar título' }, { status: 500 });
  }
}