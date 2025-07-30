'use client'

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ScrollArea } from '@/components/ui/scroll-area';
import Header from '@/components/Header';
import ChatInput from '@/components/ChatInput';
import InputCard from '@/components/InputCard';
import { useChatStore } from '@/store/useChatStore';
import { mockInput } from '@/db/mock-inputs';
import type { MockInput } from '@/db/mock-inputs';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

function getRandomUniqueItems<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default function ChatPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  const { messages, addMessage, clearMessages } = useChatStore();
  const [chatTitle, setChatTitle] = useState('New Chat');
  const [showInputCard, setShowInputCard] = useState(true);

  useEffect(() => {
    console.log('showInputCard:', showInputCard);
    console.log('Messages:', messages);
  }, [showInputCard, messages]);

  useEffect(() => {
    if (!session?.user?.id || !id) return;

    async function fetchChat() {
      try {
        const res = await fetch(`/api/chats/${id}?userId=${session?.user.id}`);
        if (!res.ok) throw new Error('Erro ao carregar chat');
        const { chat, messages: chatMessages } = await res.json();
        setChatTitle(chat.title);
        setShowInputCard(!chat.hasFirstMessage); // Definir com base em hasFirstMessage
        clearMessages();
        chatMessages.forEach((msg: any) =>
          addMessage({
            id: msg.id,
            content: msg.content,
            role: msg.role as 'user' | 'assistant',
            createdAt: new Date(msg.createdAt),
          })
        );
        console.log('Chat carregado:', { title: chat.title, hasFirstMessage: chat.hasFirstMessage });
      } catch (error) {
        console.error('Erro ao carregar chat:', error);
        router.push('/');
      }
    }
    fetchChat();
  }, [id, session?.user?.id, clearMessages, addMessage, router]);

  const handleFirstMessage = async (content: string) => {
    if (!session?.user?.id || messages.length !== 0) return;

    try {
      console.log('Enviando mensagem para gerar título:', content);
      const res = await fetch(`/api/chats/${id}/title`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, userId: session.user.id }),
      });
      if (res.ok) {
        const { title } = await res.json();
        console.log('Título recebido da API:', title);
        setChatTitle(title);
      } else {
        console.error('Erro na resposta da API:', res.status, await res.text());
      }
    } catch (error) {
      console.error('Erro ao gerar título:', error);
    }
  };

  const [randomInputs, setRandomInputs] = useState<MockInput[]>([]);

  useEffect(() => {
    const inputs = getRandomUniqueItems(mockInput, 3);
    setRandomInputs(inputs);
  }, []);

  const inputRef = useRef<any>(null);

  const handleCardClick = (content: string) => {
    if (inputRef.current) {
      inputRef.current(content);
      setShowInputCard(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full flex flex-col"
    >
      <Header title={chatTitle} />
      <ScrollArea className="flex-1 w-full px-7 overflow-y-auto">
        <div className="flex flex-col justify-end min-h-full">
          {messages.map((msg) => (
            <div key={msg.id} className={`my-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div
                className={`inline-block p-2 ${msg.role === 'user' ? 'bg-blue-600 text-white max-w-[60%] rounded-t-lg rounded-bl-lg rounded-br' : ''}`}
              >
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{msg.content}</ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className='w-full px-10 bg-transparent'>
        {showInputCard && <InputCard inputs={randomInputs} onCardClick={handleCardClick} />}
      </div>
      <ChatInput onMessageSent={handleFirstMessage} chatId={id as string} />
    </motion.section>
  );
}