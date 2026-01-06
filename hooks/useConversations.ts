import { api } from '@/services/api';
import { Conversation, Message } from '@/types/conversation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useChatSocket } from './useChatSocket';

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await api.get('/patients/conversations');
      setConversations(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useChatSocket({
    onConversationUpdate: fetchConversations,
  });

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const unreadCount = useMemo(() => {
    return conversations.reduce((acc, conv) => acc + (conv.unreadCount || 0), 0);
  }, [conversations]);

  return { conversations, loading, refetch: fetchConversations, unreadCount };
};

export const useMessages = (conversationId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await api.get(
        `/patients/conversations/${conversationId}/messages?limit=50`
      );
      setMessages(res.data.data.reverse());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  const { sendMessage: socketSendMessage } = useChatSocket({
    conversationId,
    onNewMessage: (msg) => setMessages((prev) => [...prev, msg]),
  });

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const sendMessage = async (content: string) => {
    try {
      const msg = await socketSendMessage(content);
      setMessages((prev) => [...prev, msg]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  return { messages, loading, sendMessage };
};
