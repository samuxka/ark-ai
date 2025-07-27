import { create } from 'zustand';

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  createdAt: Date;
};

type ChatState = {
  messages: Message[];
  currentChatId: string | null;
  setChatId: (chatId: string | null) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
};

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  currentChatId: null,
  setChatId: (chatId) => set({ currentChatId: chatId }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));