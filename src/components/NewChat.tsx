'use client'

import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface NewChatProps {
  isClose: boolean;
}

function NewChat({ isClose }: NewChatProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const inputVariants = {
    open: {
      width: "100%",
      opacity: 1,
      display: "block",
    },
    closed: {
      width: 0,
      opacity: 0,
      display: "none",
      transitionEnd: { display: "none" },
    },
  };

  const handleNewChat = async () => {
    if (!session?.user?.id) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      // Criar novo chat no backend
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: session.user.id }),
      });
      if (!response.ok) throw new Error('Erro ao criar chat');
      const { chatId } = await response.json();
      // Redirecionar para a página do novo chat
      router.push(`/chat/${chatId}`);
    } catch (error) {
      console.error('Erro ao criar novo chat:', error);
    }
  };

  return (
    <Button
      className={`flex items-center justify-center bg-blue-600 hover:bg-blue-600/80 dark:text-white mb-3 ${isClose ? "" : "w-full"}`}
      onClick={handleNewChat}
      disabled={!session}
    >
      <Edit size={20} />
      <motion.h1
        variants={inputVariants}
        animate={isClose ? "closed" : "open"}
        transition={{ duration: 0.2 }}
      >
        New chat
      </motion.h1>
    </Button>
  );
}

export default NewChat;