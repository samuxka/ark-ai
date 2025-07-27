"use client";

import Header from "./Header";
import ChatInput from "./ChatInput";
import { useChatStore } from "@/store/useChatStore";
import { ScrollArea } from "./ui/scroll-area";

export default function ChatInterface() {
  const { messages } = useChatStore();

  return (
    <section className="w-full h-screen flex flex-col">
      <Header />

      <ScrollArea className="flex-2 w-full px-7 overflow-y-auto">
        <div className="flex flex-col justify-end min-h-full">
          {messages.map((msg) => (
            <div key={msg.id} className={`my-4 ${msg.role === "user" ? "text-right" : "text-left"}`}>
              <div
                className={`inline-block p-2 rounded ${msg.role === "user" ? "bg-blue-600 max-w-[60%]" : ""}`}
                dangerouslySetInnerHTML={{ __html: msg.content }}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      <ChatInput />
    </section>
  );
}
