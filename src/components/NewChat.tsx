'use client'

import { motion } from 'framer-motion';
import { Edit } from 'lucide-react';
import React, { useRef } from 'react'
import { Button } from './ui/button';

function NewChat({ isClose }: NewChatProps) {
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

    return (
        <Button className={`flex items-center justify-center bg-blue-600 hover:bg-blue-600/80 dark:text-white mb-3 ${isClose ? "" : "w-full"}`}>
            <Edit size={20} />
            <motion.h1
                variants={inputVariants}
                animate={isClose ? "closed" : "open"}
                transition={{ duration: 0.2 }}
            >
                New chat
            </motion.h1>
        </Button>
    )
}

export default NewChat