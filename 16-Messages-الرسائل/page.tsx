'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isRead: boolean;
  attachmentType?: 'image' | 'pdf';
}

interface Conversation {
  id: string;
  contactId: string;
  contactName: string;
  company: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

const demoConversations: Conversation[] = [
  {
    id: 'conv-001',
    contactId: 'user-001',
    contactName: 'Ahmed Al-Rashid',
    company: 'Rashid Trading Company',
    lastMessage: 'Perfect! I will send the quotation by tomorrow.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15),
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'msg-001',
        senderId: 'user-001',
        senderName: 'Ahmed Al-Rashid',
        text: 'السلام عليكم، هل لديك توفرية للأنابيب المعدنية؟',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        isRead: true,
      },
      {
        id: 'msg-002',
        senderId: 'current-user',
        senderName: 'You',
        text: 'Hello! We have several types of steel pipes available. What specifications are you looking for?',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        isRead: true,
      },
      {
        id: 'msg-003',
        senderId: 'user-001',
        senderName: 'Ahmed Al-Rashid',
        text: 'نحتاج إلى 5000 طن من الأنابيب بقطر 6 بوصة',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        isRead: true,
      },
      {
        id: 'msg-004',
        senderId: 'current-user',
        senderName: 'You',
        text: 'Perfect! I will send the quotation by tomorrow.',
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        isRead: true,
      },
    ],
  },
  {
    id: 'conv-002',
    contactId: 'user-002',
    contactName: 'Sarah Chen',
    company: 'Shanghai Electronics Ltd',
    lastMessage: 'Thank you for the quality report. Everything looks good!',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 120),
    unreadCount: 1,
    isOnline: false,
    messages: [
      {
        id: 'msg-005',
        senderId: 'current-user',
        senderName: 'You',
        text: 'Hi Sarah, I have completed the quality inspection for the shipment.',
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
        isRead: true,
      },
      {
        id: 'msg-006',
        senderId: 'user-002',
        senderName: 'Sarah Chen',
        text: 'Thank you for the quality report. Everything looks good!',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
        isRead: false,
      },
    ],
  },
  {
    id: 'conv-003',
    contactId: 'user-003',
    contactName: 'Mohammed Hassan',
    company: 'Hassan Industrial Supply',
    lastMessage: 'Can you provide the packaging details?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 240),
    unreadCount: 0,
    isOnline: true,
    messages: [
      {
        id: 'msg-007',
        senderId: 'user-003',
        senderName: 'Mohammed Hassan',
        text: 'Is this product available for partnership arrangements?',
        timestamp: new Date(Date.now() - 1000 * 60 * 300),
        isRead: true,
      },
      {
        id: 'msg-008',
        senderId: 'current-user',
        senderName: 'You',
        text: 'Yes, we offer partnership programs. Are you interested?',
        timestamp: new Date(Date.now() - 1000 * 60 * 280),
        isRead: true,
      },
      {
        id: 'msg-009',
        senderId: 'user-003',
        senderName: 'Mohammed Hassan',
        text: 'Can you provide the packaging details?',
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
        isRead: true,
      },
    ],
  },
];

export default function MessagesPage() {
  const [conversations, setConversations] = useState(demoConversations);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(conversations[0].id);
  const [messageText, setMessageText] = useState('');
  const [showTranslation, setShowTranslation] = useState(false);

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConv) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user',
      senderName: 'You',
      text: messageText,
      timestamp: new Date(),
      isRead: true,
    };

    setConversations(
      conversations.map(conv =>
        conv.id === selectedConvId
          ? {
              ...conv,
              messages: [...conv.messages, newMessage],
              lastMessage: messageText,
              lastMessageTime: new Date(),
            }
          : conv
      )
    );

    setMessageText('');
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <DashboardLayout
      user={{ name: 'User', initials: 'U' }}
      isAuthenticated={true}
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Messages</h1>
          <p className="text-gray-400">Communicate with buyers and suppliers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#242830]">
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-[#c41e3a] outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1 p-2">
              {conversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => {
                    setSelectedConvId(conv.id);
                    if (conv.unreadCount > 0) {
                      setConversations(
                        conversations.map(c =>
                          c.id === conv.id ? { ...c, unreadCount: 0 } : c
                        )
                      );
                    }
                  }}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors border ${
                    selectedConvId === conv.id
                      ? 'bg-[#c41e3a] border-[#c41e3a]'
                      : 'border-transparent hover:bg-[#242830]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#d4a843] flex items-center justify-center text-[#0c0f14] font-bold text-sm">
                        {conv.contactName.split(' ')[0][0]}
                      </div>
                      {conv.isOnline && (
                        <div className="w-3 h-3 bg-green-500 rounded-full absolute translate-x-7 -translate-y-2 border-2 border-[#1a1d23]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="font-semibold text-white text-sm">{conv.contactName}</p>
                        {conv.unreadCount > 0 && (
                          <span className="bg-[#c41e3a] text-white text-xs rounded-full px-2 py-0.5 ml-auto">
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs truncate">{conv.company}</p>
                      <p className="text-gray-500 text-xs truncate">{conv.lastMessage}</p>
                      <p className="text-gray-600 text-xs mt-1">{formatTime(conv.lastMessageTime)}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          {selectedConv ? (
            <div className="lg:col-span-3 bg-[#1a1d23] border border-[#242830] rounded-lg flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-[#242830] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#d4a843] flex items-center justify-center text-[#0c0f14] font-bold">
                    {selectedConv.contactName.split(' ')[0][0]}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{selectedConv.contactName}</p>
                    <p className="text-gray-400 text-sm">{selectedConv.company}</p>
                    {selectedConv.isOnline && (
                      <p className="text-green-500 text-xs">Online</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    title="Translation coming soon"
                    className="p-2 hover:bg-[#242830] rounded-lg transition-colors"
                    onClick={() => setShowTranslation(!showTranslation)}
                  >
                    <span className="text-white text-sm">ترجمة</span>
                  </button>
                  <div className="relative group">
                    <svg className="w-5 h-5 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="absolute right-0 bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-xs text-gray-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      Translation: Coming Soon
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConv.messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.senderId === 'current-user'
                          ? 'bg-[#c41e3a] text-white'
                          : 'bg-[#242830] text-gray-200'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {msg.senderId === 'current-user' && (
                          <span>✓✓</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-[#242830] space-y-3">
                <div className="flex gap-3">
                  <button className="p-2 hover:bg-[#242830] rounded-lg transition-colors flex-shrink-0">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1 4.5 4.5 0 11-4.384 5.98z" />
                    </svg>
                  </button>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-[#c41e3a] outline-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim()}
                    className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold text-sm"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="lg:col-span-3 bg-[#1a1d23] border border-[#242830] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <p className="text-gray-400">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
