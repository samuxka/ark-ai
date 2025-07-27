'use client'

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Ellipsis, Pen, Trash2 } from "lucide-react";

function ChatCard({ id, title, isClose, onDelete, onRename }: CardChatProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(title);

    useEffect(() => {
        setEditValue(title);
    }, [title]);

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
        <motion.div
            variants={inputVariants}
            animate={isClose ? "closed" : "open"}
            transition={{ duration: 0.2 }}
            className="w-full hover:bg-accent cursor-pointer transition-colors duration-300 pl-3 pr-2 py-1 rounded-sm"
        >
            <div className="flex items-center justify-between">
                {isEditing ? (
                    <div className="flex items-center gap-2 w-full">
                        <input
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            autoFocus
                            className="bg-transparent flex-1 outline-none text-sm border-b border-muted"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                onRename(id, editValue);
                                setIsEditing(false);
                            }}
                        >
                            Save
                        </Button>
                    </div>
                ) : (
                    <span className="text-sm">{title}</span>
                )}



                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        {isEditing ? "" : <Button variant="ghost" size="icon">
                            <Ellipsis className="w-4 h-4" />
                        </Button>}
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onClick={(e) => {
                                e.preventDefault();
                                setIsEditing(true);
                            }}
                        >
                            Rename
                            <DropdownMenuShortcut>
                                <Pen className="w-4 h-4" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => onDelete(id)}>
                            Delete
                            <DropdownMenuShortcut>
                                <Trash2 className="w-4 h-4" />
                            </DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </motion.div>
    );
}

export default ChatCard;
