'use client'

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { ChevronRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useChatStore } from '@/store/useChatStore';

interface ChatInputProps {
  onMessageSent?: (content: string) => void;
  chatId: string;
  setInputRef?: (sendMessage: (content: string) => void) => void;
}


function ChatInput({ onMessageSent, chatId, setInputRef }: ChatInputProps) {
  const { data: session } = useSession();
  const [input, setInput] = useState('');
  const { addMessage } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !session?.user?.id) return;

    onMessageSent?.(input);

    const userMessage = {
      id: crypto.randomUUID(),
      content: input,
      role: 'user' as const,
      createdAt: new Date(),
    };
    addMessage(userMessage);

    try {
      const response = await fetch('/api/chats/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: input,
          role: 'user',
          userId: session.user.id,
          chatId,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch response');

      const { response: botResponse } = await response.json();

      const assistantMessage = {
        id: crypto.randomUUID(),
        content: botResponse,
        role: 'assistant' as const,
        createdAt: new Date(),
      };
      addMessage(assistantMessage);
    } catch (error) {
      console.error('Erro ao buscar resposta do assistente:', error);
      addMessage({
        id: crypto.randomUUID(),
        content: 'Desculpe, algo deu errado. Tente novamente.',
        role: 'assistant' as const,
        createdAt: new Date(),
      });
    }

    setInput('');
  };

  const sendMessageFromCard = (content: string) => {
    setInput(content);
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
      handleSubmit(fakeEvent);
    }, 100);
  };

  useEffect(() => {
    if (setInputRef) {
      setInputRef(sendMessageFromCard);
    }
  }, [setInputRef]);

  return (
    <div className="w-full h-48 flex items-center justify-center">
      <div className="w-3/4 border-2 rounded-lg p-2">
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta bíblica..."
            className="resize-none dark:text-zinc-400 border-none"
          />
          <div className="w-full flex items-center justify-end">
            <Button type="submit" disabled={!session} className="cursor-pointer">
              Enviar <ChevronRight />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;