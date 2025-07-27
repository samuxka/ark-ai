import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const lastChat = await prisma.chat.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' },
    select: { id: true },
  });

  if (lastChat) {
    redirect(`/chat/${lastChat.id}`);
  } else {
    const newChat = await prisma.chat.create({
      data: {
        title: 'New Chat',
        userId: session.user.id,
      },
    });
    redirect(`/chat/${newChat.id}`);
  }
}