'use client'

import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';
import React, { useRef } from 'react'
import { Button } from './ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from '@radix-ui/react-label';
import { ModeToggle } from './ModeToggle';

function ChatSettings({ isClose }: SettingsProps) {
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
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline" className={`flex items-center justify-center mt-3 ${isClose ? "" : "w-full"}`}>
            <Settings size={20} />
            <motion.h1
              variants={inputVariants}
              animate={isClose ? "closed" : "open"}
              transition={{ duration: 0.2 }}
            >
              Settings
            </motion.h1>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Toggle theme</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid grid-cols-6 gap-3">
              <Label className='col-span-2 flex items-center justify-start'>Theme:</Label>
              <div className='col-span-2'></div>
              <div className='col-span-2'>
                <ModeToggle />
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button type="submit">Save changes</Button>
            </DialogClose>

          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default ChatSettings