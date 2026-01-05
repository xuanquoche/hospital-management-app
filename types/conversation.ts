export type ConversationStatus = 'OPEN' | 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type MessageType = 'TEXT' | 'IMAGE' | 'FILE';
export type UserRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: UserRole;
  content: string;
  messageType: MessageType;
  attachmentUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  status: ConversationStatus;
  lastMessageAt: string | null;
  lastMessage: {
    content: string;
    senderRole: UserRole;
    createdAt: string;
    isRead: boolean;
  } | null;
  patient: {
    id: string;
    name: string;
    avatar?: string;
  };
  unreadCount?: number;
}
