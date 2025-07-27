'use client'

import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from './ui/dropdown-menu';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import Component from './comp-331';

interface HeaderProps {
  title?: string;
}

function Header({ title = 'New Chat' }: HeaderProps) {
  const { data: session } = useSession();
  const fullName = session?.user?.name || '';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];

  function handleSignOut() {
    signOut();
  }

  return (
    <header className="w-full p-5 flex items-center justify-between border-b">
      <div className="ChatName">
        <h1>{title}</h1>
      </div>
      <div className="UserArea">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="py-7 flex items-center gap-3">
              <Image
                src={session?.user?.image || '/user.jpeg'}
                alt={`${session?.user?.name} photo`}
                width={1080}
                height={1080}
                className="size-10 rounded-full"
              />
              {session?.user?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Welcome to Ark.ai</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="flex flex-col gap-2">
              <Component />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                Logout
                <DropdownMenuShortcut>
                  <LogOut />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;