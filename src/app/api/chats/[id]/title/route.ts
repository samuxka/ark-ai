import { NextResponse } from 'next/server';
import { z } from 'zod';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const TitleSchema = z.object({
  content: z.string(),
  userId: z.string(),
});

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { content, userId } = TitleSchema.parse(body);

    // Verificar se o chat pertence ao usuário
    const chat = await prisma.chat.findFirst({
      where: { id, userId },
    });
    if (!chat) {
      console.error('Chat não encontrado ou não pertence ao usuário:', { id, userId });
      return NextResponse.json({ error: 'Chat não encontrado' }, { status: 404 });
    }

    // Configurar Gemini API
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prompt otimizado pra gerar título curto e relevante
    const prompt = `
      Com base na mensagem a seguir, gere um título curto (máximo 6 palavras) e descritivo para um chat:
      Mensagem: "${content}"
      Retorne apenas o título, sem explicações ou formatação adicional.
    `;

    // Fazer chamada à Gemini API
    const result = await model.generateContent(prompt);
    const title = result.response.text().trim();
    console.log('Resposta da Gemini:', result.response.text());
    console.log('Título gerado:', title);

    // Atualizar o título no banco
    await prisma.chat.update({
      where: { id },
      data: { title },
    });

    return NextResponse.json({ title });
  } catch (error) {
    console.error('Erro ao gerar título:', error);
    return NextResponse.json({ error: 'Erro ao gerar título' }, { status: 500 });
  }
}