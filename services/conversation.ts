import { Conversation, Message } from '@/types/conversation';
import { api } from './api';

interface CreateConversationParams {
  subject?: string;
  initialMessage?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export const createConversation = async (params: CreateConversationParams): Promise<Conversation> => {
  const response = await api.post('/patients/conversations', params);
  return response.data.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get('/patients/conversations');
  return response.data.data;
};

export const getConversationById = async (id: string): Promise<Conversation> => {
  const response = await api.get(`/patients/conversations/${id}`);
  return response.data.data;
};

export const getMessages = async (conversationId: string, limit = 50): Promise<Message[]> => {
  const response = await api.get(`/patients/conversations/${conversationId}/messages?limit=${limit}`);
  return response.data.data;
};

export const sendMessage = async (conversationId: string, content: string): Promise<Message> => {
  const response = await api.post(`/patients/conversations/${conversationId}/messages`, {
    content,
    messageType: 'TEXT',
  });
  return response.data.data;
};

export const markAsRead = async (conversationId: string): Promise<void> => {
  await api.patch(`/patients/conversations/${conversationId}/read`);
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get('/patients/conversations/unread-count');
  return response.data.data?.count || 0;
};

