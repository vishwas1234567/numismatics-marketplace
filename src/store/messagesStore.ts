import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  buyerId: string;
  sellerId: string;
  coinId?: string;
  updatedAt: string;
  messages: Message[];
  unreadCount: number;
}

interface MessagesState {
  conversations: Conversation[];
  sendMessage: (conversationId: string, senderId: string, text: string) => void;
  createConversation: (buyerId: string, sellerId: string, coinId?: string) => string;
  markAsRead: (conversationId: string) => void;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      conversations: [],
      createConversation: (buyerId, sellerId, coinId) => {
        const state = get();
        // Check if one already exists
        const existing = state.conversations.find(
          (c) => c.buyerId === buyerId && c.sellerId === sellerId && c.coinId === coinId
        );
        if (existing) return existing.id;
        
        const newId = `conv_${Date.now()}`;
        set((state) => ({
          conversations: [
            {
              id: newId,
              buyerId,
              sellerId,
              coinId,
              updatedAt: new Date().toISOString(),
              messages: [],
              unreadCount: 0
            },
            ...state.conversations
          ]
        }));
        return newId;
      },
      sendMessage: (conversationId, senderId, text) => {
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id === conversationId) {
              return {
                ...c,
                updatedAt: new Date().toISOString(),
                messages: [
                  ...c.messages,
                  {
                    id: `msg_${Date.now()}`,
                    senderId,
                    text,
                    createdAt: new Date().toISOString()
                  }
                ]
              };
            }
            return c;
          }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        }));
      },
      markAsRead: (conversationId) => {
        set((state) => ({
          conversations: state.conversations.map((c) => 
            c.id === conversationId ? { ...c, unreadCount: 0 } : c
          )
        }));
      }
    }),
    { name: 'market_messages' }
  )
);
