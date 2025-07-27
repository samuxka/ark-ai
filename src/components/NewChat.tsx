'use client'

import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

interface NewChatProps {
  isClose: boolean;
}

function NewChat({ isClose }: NewChatProps) {
  const router = useRouter();

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
    try {
      // Criar novo chat no backend
      const response = await fetch('/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
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