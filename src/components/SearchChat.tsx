'use client'

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { motion } from "framer-motion";
import { useRef } from "react";

function SearchChat({ isClose, ToggleSidebar, onSearchChange }: SearchChatProps) {
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Função para abrir o sidebar e focar o input
  const handleIconClick = () => {
    if (isClose) {
      ToggleSidebar();
      setTimeout(() => {
        inputRef.current?.focus(); // Agora o TypeScript reconhece o método focus
      }, 300);
    }
  };

  return (
    <div className="w-full h-10 flex items-center justify-center mt-5 mb-3 border-2 rounded-lg">
      <div
        className={`w-12 h-10 flex items-center justify-center cursor-pointer ${isClose ? "rounded-lg" : "rounded-l-lg"}`}
        onClick={handleIconClick}
      >
        <Search size={20} />
      </div>
      <motion.div
        variants={inputVariants}
        animate={isClose ? "closed" : "open"}
        transition={{ duration: 0.3 }}
        className="flex-1"
      >
        <Input
          ref={inputRef}
          type="text"
          className="border-none h-10 rounded-r-lg rounded-l-none"
          placeholder="Search chat"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </motion.div>
    </div>
  );
}

export default SearchChat;