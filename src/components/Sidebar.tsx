"use client"

import { Icon } from "@iconify/react";
import { Button } from "./ui/button";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import SearchChat from "./SearchChat";
import NewChat from "./NewChat";
import { mockChat as initialChats } from "@/db/mock-chat";
import ChatCard from "./ChatCard";
import { Label } from "./ui/label";
import Settings from "./Settings";

function Sidebar() {
  const [isClose, setIsClose] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState(initialChats);


  function ToggleSidebar() {
    setIsClose(!isClose);
  }

  const buttonVariants = {
    open: { x: 0 },
    closed: { x: -70 }
  };

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== id));
  };

  const handleRename = (id: string, newTitle: string) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle } : chat
      )
    );
  };



  return (
    <motion.div
      variants={{
        open: { width: "24rem" },
        closed: { width: "5rem" }
      }}
      animate={isClose ? "closed" : "open"}
      transition={{ duration: 0.3 }}
      className="border-r-2 p-5 h-screen flex flex-col justify-center"
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
          animate={isClose ? "closed" : "open"}
          transition={{ duration: 0.3 }}
          style={{ position: "relative" }}
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
      {isClose ? "" : <Label className="dark:text-white/30 text-zinc-500 my-3">Chats</Label>}

      <div className="w-full h-full flex flex-col gap-3">
        {filteredChats.length === 0 ? (
          !isClose && <span className="dark:text-accent text-zinc-500">Nenhum chat encontrado :(</span>
        ): (filteredChats.map((chat) => (
        <ChatCard
          key={chat.id}
          id={String(chat.id)}
          title={chat.title}
          isClose={isClose}
          onDelete={handleDelete}
          onRename={handleRename}
        />
        )))}

      </div>
      <Settings isClose={isClose} />
    </motion.div>
  );
}

export default Sidebar;