'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';

interface ApiMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  read_by: string[];
  is_edited: boolean;
  created_at: string;
  sender_name?: string;
}

interface Participant {
  full_name_en: string;
  full_name_ar?: string;
  company_name: string;
  account_type: string;
}

interface ApiConversation {
  id: string;
  participant_ids: string[];
  deal_id: string | null;
  title: string;
  is_group: boolean;
  last_message_text: string;
  last_message_at: string;
  created_at: string;
  messages: ApiMessage[];
  participants: Participant[];
}

function getAuthHeaders(): Record<string, string> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function getCurrentUserId(): string | null {
  if (typeof window === 'undefined') return null;
  try {
    const profile = JSON.parse(localStorage.getItem('user_profile') || '{}');
    return profile.id || null;
  } catch {
    return null;
  }
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<ApiMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentUserId(getCurrentUserId());
  }, []);

  // Fetch conversations list
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch('/api/messages?limit=50', {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError('Please log in to view messages');
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const json = await res.json();
      if (json.success) {
        const convs = json.data || [];
        setConversations(convs);
        // Auto-select first conversation if none selected
        if (convs.length > 0 && !selectedConvId) {
          setSelectedConvId(convs[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [selectedConvId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Fetch messages for selected conversation
  const fetchMessages = useCallback(async (convId: string) => {
    try {
      setMessagesLoading(true);

      const res = await fetch(`/api/messages/${convId}?limit=100`, {
        headers: { ...getAuthHeaders() },
        credentials: 'include',
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        setSelectedMessages(json.data[0].messages || []);
      } else {
        setSelectedMessages([]);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setSelectedMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedConvId) {
      fetchMessages(selectedConvId);
    }
  }, [selectedConvId, fetchMessages]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedMessages]);

  // Send message
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConvId || sending) return;

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    // Optimistic: add message locally
    const optimisticMsg: ApiMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: selectedConvId,
      sender_id: currentUserId || '',
      content: text,
      message_type: 'text',
      read_by: [],
      is_edited: false,
      created_at: new Date().toISOString(),
    };
    setSelectedMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await fetch(`/api/messages/${selectedConvId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        credentials: 'include',
        body: JSON.stringify({ content: text }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      if (json.success && json.data) {
        // Replace optimistic message with real one
        setSelectedMessages(prev =>
          prev.map(m => (m.id === optimisticMsg.id ? json.data : m))
        );
        // Update conversation list
        setConversations(prev =>
          prev.map(c =>
            c.id === selectedConvId
              ? { ...c, last_message_text: text, last_message_at: new Date().toISOString() }
              : c
          )
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Remove optimistic message on failure
      setSelectedMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
      setMessageText(text); // Restore text
    } finally {
      setSending(false);
    }
  };

  // Get display name for a conversation's other participant
  const getContactInfo = (conv: ApiConversation) => {
    if (conv.participants && conv.participants.length > 0) {
      const p = conv.participants[0];
      return {
        name: p.full_name_en || 'Unknown',
        company: p.company_name || '',
        initials: (p.full_name_en || 'U')[0].toUpperCase(),
      };
    }
    return { name: conv.title || 'Conversation', company: '', initials: 'C' };
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
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

  const formatMessageTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const selectedConv = conversations.find(c => c.id === selectedConvId);

  // Filter conversations by search
  const filteredConversations = searchQuery
    ? conversations.filter(c => {
        const contact = getContactInfo(c);
        return (
          contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.last_message_text || '').toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : conversations;

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

        {/* Error State */}
        {error && (
          <div className="bg-[#1a1d23] border border-red-600 rounded-lg p-6 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button
              onClick={fetchConversations}
              className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="bg-[#1a1d23] border border-[#242830] rounded-lg p-12 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-400">Loading conversations...</p>
          </div>
        )}

        {/* Main Chat UI */}
        {!loading && !error && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
            {/* Conversations List */}
            <div className="lg:col-span-1 bg-[#1a1d23] border border-[#242830] rounded-lg overflow-hidden flex flex-col">
              <div className="p-4 border-b border-[#242830]">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-[#c41e3a] outline-none"
                />
              </div>

              <div className="flex-1 overflow-y-auto space-y-1 p-2">
                {filteredConversations.length === 0 && (
                  <div className="p-4 text-center">
                    <p className="text-gray-500 text-sm">No conversations yet</p>
                  </div>
                )}
                {filteredConversations.map(conv => {
                  const contact = getContactInfo(conv);
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedConvId(conv.id)}
                      className={`w-full text-left px-3 py-3 rounded-lg transition-colors border ${
                        selectedConvId === conv.id
                          ? 'bg-[#c41e3a] border-[#c41e3a]'
                          : 'border-transparent hover:bg-[#242830]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-[#d4a843] flex items-center justify-center text-[#0c0f14] font-bold text-sm">
                            {contact.initials}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-white text-sm">{contact.name}</p>
                          {contact.company && (
                            <p className="text-gray-400 text-xs truncate">{contact.company}</p>
                          )}
                          <p className="text-gray-500 text-xs truncate">{conv.last_message_text || 'No messages yet'}</p>
                          {conv.last_message_at && (
                            <p className="text-gray-600 text-xs mt-1">{formatTime(conv.last_message_at)}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Area */}
            {selectedConv ? (
              <div className="lg:col-span-3 bg-[#1a1d23] border border-[#242830] rounded-lg flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-[#242830] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#d4a843] flex items-center justify-center text-[#0c0f14] font-bold">
                      {getContactInfo(selectedConv).initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{getContactInfo(selectedConv).name}</p>
                      {getContactInfo(selectedConv).company && (
                        <p className="text-gray-400 text-sm">{getContactInfo(selectedConv).company}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messagesLoading && (
                    <div className="text-center py-8">
                      <div className="animate-spin w-6 h-6 border-2 border-[#c41e3a] border-t-transparent rounded-full mx-auto" />
                    </div>
                  )}
                  {!messagesLoading && selectedMessages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">No messages yet. Start the conversation!</p>
                    </div>
                  )}
                  {selectedMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender_id === currentUserId
                            ? 'bg-[#c41e3a] text-white'
                            : 'bg-[#242830] text-gray-200'
                        }`}
                      >
                        {msg.sender_name && msg.sender_id !== currentUserId && (
                          <p className="text-xs font-semibold mb-1 opacity-75">{msg.sender_name}</p>
                        )}
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex items-center gap-2 mt-1 text-xs opacity-75">
                          <span>{formatMessageTime(msg.created_at)}</span>
                          {msg.sender_id === currentUserId && (
                            <span>{msg.id.startsWith('temp-') ? '⏳' : '✓✓'}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-[#242830]">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      className="flex-1 bg-[#0c0f14] border border-[#242830] rounded px-3 py-2 text-white placeholder-gray-500 text-sm focus:border-[#c41e3a] outline-none"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!messageText.trim() || sending}
                      className="px-4 py-2 bg-[#c41e3a] text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold text-sm"
                    >
                      {sending ? '...' : 'Send'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lg:col-span-3 bg-[#1a1d23] border border-[#242830] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl mb-4">💬</p>
                  <p className="text-gray-400">
                    {conversations.length === 0
                      ? 'No conversations yet'
                      : 'Select a conversation to start messaging'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
