import api from '../axios';

interface IParticipant {
  _id: string;
  name: string;
  avatar: { url: string };
}
export interface IChatAttachment {
    secure_url: string;
    public_id: string;
    resource_type: string;
    format: string;
    bytes: number;
    duration?: number;
}

export interface IMessage {
  _id: string;
  conversationId: string;
  senderId: IParticipant; 
  messageType: 'text' | 'image' | 'video';
  content?: string;
  attachment?: {
    secure_url: string;
    resource_type: string;
  
  };
  createdAt: string;
}

export interface IConversation {
    _id: string;
    participants: IParticipant[];
    lastMessage?: {
        content: string;
        sender: { name: string };
    };
    updatedAt: string;
}
export const getConversations = async (): Promise<IConversation[]> => {
    const { data } = await api.get('/conversations');
    return data.data || [];
};
export const getMessagesByConversationId = async (
    conversationId: string, 
    page: number = 1
): Promise<IMessage[]> => {
    const { data } = await api.get(`/messages/${conversationId}?page=${page}&limit=30`);
    return data.data || [];
};
export const startConversation = async (receiverId: string): Promise<IConversation> => {
    const { data } = await api.post('/conversations/find-or-create', { receiverId });
    return data.data; 
};
export const uploadChatFile = async (formData: FormData): Promise<IChatAttachment> => {
    const { data } = await api.post('/messages/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return data.data;
};