import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendToAi } from "@/lib/ai-api";
import { z } from "zod";

const RequestSchema = z.object({
  content: z.string().min(1),
  userId: z.string(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { content, userId } = RequestSchema.parse(body);

    const response = await sendToAi(content, userId);

    await prisma.message.create({
      data: {
        content,
        role: "user",
        userId,
      },
    });
    await prisma.message.create({
      data: {
        content: response,
        role: "assistant",
        userId,
      },
    });

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao processar a mensagem" }, { status: 500 });
  }
}