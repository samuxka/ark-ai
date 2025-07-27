'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Button } from './ui/button';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import SearchChat from './SearchChat';
import NewChat from './NewChat';
import Settings from './Settings';
import ChatCard from './ChatCard';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

function Sidebar() {
  const [isClose, setIsClose] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState<{ id: string; title: string }[]>([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user?.id) return;

    async function fetchChats() {
      try {
        const res = await fetch(`/api/chats?userId=${session?.user.id}`);
        if (!res.ok) throw new Error('Erro ao buscar chats');
        const data = await res.json();
        setChats(data);
      } catch (error) {
        console.error('Erro ao carregar chats:', error);
      }
    }
    fetchChats();
  }, [session?.user?.id]);

  function ToggleSidebar() {
    setIsClose(!isClose);
  }

  const buttonVariants = {
    open: { x: 0 },
    closed: { x: -70 },
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`/api/chats/${id}?userId=${session.user.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao deletar chat');
      setChats((prev) => prev.filter((chat) => chat.id !== id));
    } catch (error) {
      console.error('Erro ao deletar chat:', error);
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`/api/chats/${id}?userId=${session.user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!res.ok) throw new Error('Erro ao renomear chat');
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === id ? { ...chat, title: newTitle } : chat
        )
      );
    } catch (error) {
      console.error('Erro ao renomear chat:', error);
    }
  };

  const handleChatClick = (id: string) => {
    router.push(`/chat/${id}`);
  };

  return (
    <motion.div
      variants={{
        open: { width: '24rem' },
        closed: { width: '5rem' },
      }}
      animate={isClose ? 'closed' : 'open'}
      transition={{ duration: 0.3 }}
      className="border-r-2 p-5 h-screen flex flex-col"
    >
      <div className="sidebar__header flex items-center justify-between">
        <div className="logo flex items-center justify-start gap-2">
          <Icon icon="fa6-solid:sailboat" width={40} />
          <motion.h1
            className="text-2xl"
            animate={{ opacity: isClose ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            Ark.ai
          </motion.h1>
        </div>
        <motion.div
          variants={buttonVariants}
          animate={isClose ? 'closed' : 'open'}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative' }}
        >
          <Button
            variant="ghost"
            onClick={ToggleSidebar}
            className="z-50 size-10"
          >
            {isClose ? <ChevronsRight className="size-5" /> : <ChevronsLeft className="size-5" />}
          </Button>
        </motion.div>
      </div>
      <SearchChat isClose={isClose} ToggleSidebar={ToggleSidebar} onSearchChange={(term) => setSearchTerm(term)} />
      <NewChat isClose={isClose} />
      {isClose ? null : <Label className="dark:text-white/30 text-zinc-500 my-3">Chats</Label>}
      <div className="w-full h-full flex flex-col gap-3">
        {filteredChats.length === 0 ? (
          !isClose && <span className="dark:text-accent text-zinc-500">Nenhum chat encontrado :(</span>
        ) : (
          filteredChats.map((chat) => (
            <Link href={chat.id} key={chat.id}>
              <ChatCard
                id={chat.id}
                title={chat.title}
                isClose={isClose}
                onDelete={handleDelete}
                onRename={handleRename}
                onClick={() => handleChatClick(chat.id)}
              />
            </Link>
          ))
        )}
      </div>
      <Settings isClose={isClose} />
    </motion.div>
  );
}

export default Sidebar;