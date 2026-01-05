import * as Storage from '@/services/storage';
import { Message } from '@/types/conversation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://10.0.2.2:3000';

interface UseChatSocketOptions {
  conversationId?: string;
  onNewMessage?: (message: Message) => void;
  onConversationUpdate?: () => void;
}

export const useChatSocket = (options: UseChatSocketOptions = {}) => {
  const { conversationId, onNewMessage, onConversationUpdate } = options;
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(async () => {
    if (socketRef.current?.connected) return;

    const token = await Storage.getToken();
    if (!token) return;

    const socketUrl = `${BASE_URL}/chat`;
    console.log('Connecting to socket:', socketUrl);

    socketRef.current = io(socketUrl, {
      auth: { token },
      transports: ['websocket'], // React Native prefers websocket
      forceNew: true,
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });
    
    socketRef.current.on('new_message', (data: { conversationId: string; message: Message }) => {
        if (data.conversationId === conversationId) {
            onNewMessage?.(data.message);
        }
        onConversationUpdate?.(); // Update list count etc
    });

  }, [conversationId, onNewMessage, onConversationUpdate]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);
  
  const sendMessage = async (content: string) => {
    return new Promise<Message>((resolve, reject) => {
        if (!socketRef.current?.connected || !conversationId) {
            reject(new Error('No connection'));
            return;
        }
        socketRef.current.emit('send_message', { conversationId, content, messageType: 'TEXT' }, (response: any) => {
            if (response?.success) {
                resolve(response.message);
            } else {
                reject(new Error(response?.error || 'Failed to send'));
            }
        });
    });
  };

  const joinConversation = (id: string) => {
      socketRef.current?.emit('join_conversation', { conversationId: id });
  };

  useEffect(() => {
      if (isConnected && conversationId) {
          joinConversation(conversationId);
      }
  }, [isConnected, conversationId]);

  return { isConnected, sendMessage };
};
