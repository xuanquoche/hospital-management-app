import { api } from '@/services/api';
import { Conversation, Message } from '@/types/conversation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useChatSocket } from './useChatSocket';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const lastFetchRef = useRef<number>(0);
  const THROTTLE_MS = 5000;

  const fetchConversations = useCallback(async (force = false) => {
    const now = Date.now();
    if (!force && now - lastFetchRef.current < THROTTLE_MS) {
      return;
    }
    lastFetchRef.current = now;

    try {
      setLoading(true);
      const res = await api.get('/patients/conversations');
      setConversations(res.data.data || []);
    } catch (e) {
      console.error('Failed to fetch conversations:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useChatSocket({
    onConversationUpdate: () => fetchConversations(true),
  });

  useEffect(() => {
    fetchConversations(true);
  }, [fetchConversations]);

  const unreadCount = useMemo(() => {
    return conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
  }, [conversations]);

  return { 
    conversations, 
    loading, 
    refetch: () => fetchConversations(true), 
    unreadCount 
  };
};

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const lastFetchRef = useRef<number>(0);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    
    try {
      setLoading(true);
      const res = await api.get(
        `/patients/conversations/${conversationId}/messages?limit=100`
      );
      const data = res.data.data || [];
      setMessages(data.reverse());
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const handleNewMessage = useCallback((msg: Message) => {
    setMessages((prev) => {
      const exists = prev.some((m) => m.id === msg.id);
      if (exists) return prev;
      return [...prev, msg];
    });
  }, []);

  const { sendMessage: socketSendMessage, isConnected } = useChatSocket({
    conversationId,
    onNewMessage: handleNewMessage,
  });

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = useCallback(async (content: string) => {
    try {
      if (isConnected) {
        const msg = await socketSendMessage(content);
        handleNewMessage(msg);
        return msg;
      } else {
        const res = await api.post(
          `/patients/conversations/${conversationId}/messages`,
          { content, messageType: 'TEXT' }
        );
        const msg = res.data.data;
        handleNewMessage(msg);
        return msg;
      }
    } catch (e) {
      console.error('Failed to send message:', e);
      throw e;
    }
  }, [conversationId, socketSendMessage, isConnected, handleNewMessage]);

  return { 
    messages, 
    loading, 
    sendMessage,
    refetch: fetchMessages,
  };
};

export const useUnreadCount = () => {
  const [count, setCount] = useState(0);

  const fetchCount = useCallback(async () => {
    try {
      const res = await api.get('/patients/conversations/unread-count');
      setCount(res.data.data?.count || 0);
    } catch (e) {
      console.error('Failed to fetch unread count:', e);
    }
  }, []);

  useChatSocket({
    onConversationUpdate: fetchCount,
  });

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return count;
};
