"use client";

import React, { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useChatStore } from '@/store/useChatStore';
import { useSession } from 'next-auth/react';
import { Textarea } from './ui/textarea';
import { ChevronRight } from 'lucide-react';

function ChatInput() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const { addMessage } = useChatStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message to the store
    const userMessage = {
      id: crypto.randomUUID(),
      content: input,
      role: "user" as const,
      createdAt: new Date(),
    };
    addMessage(userMessage);

    try {
      // Send request to API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input, userId: session?.user?.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await response.json();

      // Add assistant response to the store
      addMessage({
        id: crypto.randomUUID(),
        content: data.response,
        role: "assistant" as const,
        createdAt: new Date(),
      });
    } catch (error) {
      console.error("Error fetching assistant response:", error);
      addMessage({
        id: crypto.randomUUID(),
        content: "Sorry, something went wrong. Please try again.",
        role: "assistant" as const,
        createdAt: new Date(),
      });
    }

    setInput("");
  };

  return (
    <div className='w-full h-48 flex items-center justify-center'>
      <div className='w-3/4 border-2 rounded-lg p-2'>
        <form onSubmit={handleSubmit} className="w-full h-full flex flex-col gap-2">
          <Textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua pergunta bíblica..."
            className='resize-none dark:text-zinc-400 border-none'
          >
            
          </Textarea>
          <div className='w-full flex items-center justify-end'>
            <Button type="submit" disabled={!session} className='cursor-pointer'>
              Send <ChevronRight/>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChatInput;