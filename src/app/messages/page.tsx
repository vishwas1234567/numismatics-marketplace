'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search, Send, User, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import { format } from 'date-fns';

export default function MessagesPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  // Mock data for UI only
  const conversations = [
    { id: '1', name: 'Alexander Sterling', item: '1943 Steel Penny', date: new Date(), lastMessage: 'Is the price negotiable?', unread: 2, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
    { id: '2', name: 'Maria Rossi', item: 'Roman Denarius', date: new Date(Date.now() - 86400000), lastMessage: 'Thanks for the quick shipping!', unread: 0, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' },
    { id: '3', name: 'David Chen', item: 'Morgan Silver Dollar', date: new Date(Date.now() - 172800000), lastMessage: 'Great coin, thanks.', unread: 0, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // Just clear for UI demo
    setMessage('');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-zinc-50 dark:bg-zinc-900 overflow-hidden flex flex-col sm:flex-row">
      
      {/* Sidebar - Conversations List */}
      <div className={`w-full sm:w-1/3 lg:w-1/4 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h1 className="text-xl font-bold font-black text-zinc-900 dark:text-white mb-4">
            {user.role === 'buyer' ? 'Buying Inquiries' : user.role === 'seller' ? 'Selling Inquiries' : 'All Messages'}
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
          {conversations.map((conv) => (
            <button 
              key={conv.id} 
              onClick={() => setActiveChat(conv.id)}
              className={`w-full text-left p-4 border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors flex gap-3 ${activeChat === conv.id ? 'bg-amber-50 dark:bg-amber-900/10' : ''}`}
            >
              <div className="relative h-12 w-12 rounded-full overflow-hidden flex-shrink-0 bg-zinc-200 dark:bg-zinc-800">
                <Image src={conv.avatar} alt={conv.name} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-zinc-900 dark:text-white text-sm line-clamp-1">{conv.name}</h3>
                  <span className="text-xs text-zinc-500">{format(conv.date, 'MMM d')}</span>
                </div>
                <p className="text-xs text-amber-600 mb-1 line-clamp-1">{conv.item}</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-1">{conv.lastMessage}</p>
                  {conv.unread > 0 && (
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{conv.unread}</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className={`flex-1 bg-zinc-50 dark:bg-zinc-900 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
        {!activeChat ? (
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 bg-white/50 dark:bg-zinc-950/50">
            <User className="h-16 w-16 mb-4 text-zinc-300 dark:text-zinc-800" />
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">Select a conversation</h2>
            <p className="text-zinc-500">Choose a chat from the left to start messaging.</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
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
                    <Image src={conversations.find(c => c.id === activeChat)?.avatar || ''} alt="User" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="font-bold text-zinc-900 dark:text-white">{conversations.find(c => c.id === activeChat)?.name}</h2>
                    <p className="text-xs text-amber-600">Re: {conversations.find(c => c.id === activeChat)?.item}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              <div className="text-center text-xs text-zinc-500 my-6">Today</div>
              
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                  <p className="text-zinc-900 dark:text-zinc-100 text-sm">Hello! I saw your listing for the 1943 Steel Penny.</p>
                  <span className="text-[10px] text-zinc-400 mt-2 block text-right">10:42 AM</span>
                </div>
              </div>
              
              <div className="flex justify-start">
                <div className="bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80%] shadow-sm">
                  <p className="text-zinc-900 dark:text-zinc-100 text-sm">Is it still available and is the price negotiable?</p>
                  <span className="text-[10px] text-zinc-400 mt-2 block text-right">10:43 AM</span>
                </div>
              </div>
              
              <div className="flex justify-end">
                <div className="bg-amber-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm max-w-[80%] shadow-sm">
                  <p className="text-white text-sm">Yes, it's still available. I can do 5% off the listed price.</p>
                  <span className="text-[10px] text-amber-200 mt-2 block text-right">10:55 AM</span>
                </div>
              </div>
            </div>
            
            {/* Chat input */}
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
