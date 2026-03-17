'use client';

import { Suspense } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMessagesStore } from '@/store/messagesStore';
import { useListingStore } from '@/store/listingStore';
import { dummySellers } from '@/data/sellers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Search, Send, User, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

function MessagesContent() {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  const { conversations, createConversation, sendMessage, markAsRead } = useMessagesStore();
  const { coins } = useListingStore();

  const sellerIdParam = searchParams.get('sellerId');
  const coinIdParam = searchParams.get('coinId');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Automatically open or create conversation if we clicked "Contact Seller"
    if (sellerIdParam && user.id !== sellerIdParam) {
      const convId = createConversation(user.id, sellerIdParam, coinIdParam || undefined);
      if (convId) {
        setActiveChat(convId);
        // Clear query parameters silently so a refresh doesn't trigger this again unnecessarily
        router.replace('/messages');
      }
    }
  }, [user, router, sellerIdParam, coinIdParam, createConversation]);

  useEffect(() => {
     if(activeChat) {
        markAsRead(activeChat);
     }
  }, [activeChat, markAsRead, conversations]);

  if (!user) return null;

  // Compute display data for the conversations list based on whether user is buyer or seller
  const displayConversations = conversations
    .filter(c => c.buyerId === user.id || c.sellerId === user.id)
    .map(c => {
      const isBuyer = user.id === c.buyerId;
      const otherPartyId = isBuyer ? c.sellerId : c.buyerId;
      
      // Attempt to resolve real names/avatars
      const sellerProfile = dummySellers.find(s => s.id === otherPartyId);
      const name = sellerProfile ? sellerProfile.name : (otherPartyId === 'buyer_1' ? 'Local Buyer' : otherPartyId);
      const avatar = sellerProfile ? sellerProfile.avatar : `https://i.pravatar.cc/150?u=${otherPartyId}`;
      
      const coin = coins.find(coin => coin.id === c.coinId);
      const itemTitle = coin ? coin.title : (c.coinId ? 'Unknown Item' : 'General Inquiry');
      
      const lastMsg = c.messages.length > 0 ? c.messages[c.messages.length - 1] : null;

      return {
        ...c,
        displayName: name,
        displayAvatar: avatar,
        itemTitle,
        lastMsg,
        isUnread: c.unreadCount > 0 && lastMsg?.senderId !== user.id // very simplified unread logic
      };
    });

  const activeConversationData = displayConversations.find(c => c.id === activeChat);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChat) return;
    sendMessage(activeChat, user.id, message.trim());
    setMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-900 overflow-hidden flex flex-col sm:flex-row">
      <div className={`w-full sm:w-1/3 lg:w-1/4 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold font-black text-zinc-900 dark:text-white mb-4">
            {user.role === 'buyer' ? 'Buying Inquiries' : user.role === 'seller' ? 'Selling Inquiries' : 'Messages'}
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 h-5 w-5" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-amber-500 outline-none placeholder:text-zinc-500 text-zinc-900 dark:text-white"
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {displayConversations.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              <p>No conversations yet.</p>
            </div>
          ) : (
            displayConversations.map((conv) => (
              <button 
                key={conv.id} 
                onClick={() => setActiveChat(conv.id)}
                className={`w-full text-left p-4 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex gap-3 ${activeChat === conv.id ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}
              >
                <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
                  <Image src={conv.displayAvatar} alt={conv.displayName} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{conv.displayName}</h3>
                    <span className="text-xs text-zinc-500">{format(new Date(conv.updatedAt), 'MMM d')}</span>
                  </div>
                  <p className="text-xs text-amber-600 mb-1 line-clamp-1">{conv.itemTitle}</p>
                  <div className="flex justify-between items-center">
                    <p className={`text-sm line-clamp-1 ${conv.isUnread ? 'text-zinc-900 dark:text-white font-bold' : 'text-zinc-500 dark:text-zinc-400'}`}>
                      {conv.lastMsg ? conv.lastMsg.text : 'New Conversation...'}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      
      <div className={`flex-1 bg-zinc-50 dark:bg-zinc-900 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
        {!activeConversationData ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-white/50 dark:bg-zinc-950/50">
            <User className="h-16 w-16 mb-4 text-zinc-300 dark:text-zinc-800" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Select a conversation</h2>
            <p className="text-zinc-500">Choose a chat from the left to start messaging.</p>
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setActiveChat(null)}
                  className="sm:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    <Image src={activeConversationData.displayAvatar} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-bold text-zinc-900 dark:text-white">{activeConversationData.displayName}</h2>
                    <p className="text-xs text-amber-600">Re: {activeConversationData.itemTitle}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {activeConversationData.messages.length === 0 ? (
                <div className="text-center text-xs text-zinc-500 my-6">Start of conversation</div>
              ) : (
                activeConversationData.messages.map((msg) => {
                  const isMe = msg.senderId === user.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`px-4 py-3 rounded-2xl max-w-[80%] shadow-sm ${
                        isMe 
                          ? 'bg-amber-600 text-white rounded-tr-sm' 
                          : 'bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 rounded-tl-sm'
                      }`}>
                        <p className={`text-sm ${isMe ? 'text-white' : ''}`}>{msg.text}</p>
                        <span className={`text-[10px] mt-2 block text-right ${isMe ? 'text-amber-200' : 'text-zinc-400'}`}>
                          {format(new Date(msg.createdAt), 'p')}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            
            <div className="bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 p-4">
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input 
                    type="text" 
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..." 
                    className="w-full bg-zinc-100 dark:bg-zinc-900 border-none rounded-full py-3 px-5 text-sm focus:ring-2 focus:ring-amber-500 outline-none text-zinc-900 dark:text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={!message.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-full flex items-center justify-center transition-colors shadow-sm"
                >
                  <Send className="h-5 w-5 ml-1" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-zinc-50 dark:bg-zinc-900 text-amber-600 font-medium">Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  );
}
