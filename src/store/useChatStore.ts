import { create } from "zustand";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
  createdAt: Date;
};

type ChatState = {
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));