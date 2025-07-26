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
  tempId?: string; // Thêm tempId để đồng bộ với socket
}

export interface IConversation {
    _id: string;
    participants: IParticipant[];
    type: 'private' | 'group'; // Thêm type để phân biệt chat 1-1 và nhóm
    name?: string; // Tên nhóm (chỉ có với group chat)
    avatar?: { url: string }; // Avatar nhóm
    admins?: string[]; // Danh sách admin (chỉ có với group chat)
    lastMessage?: {
        content: string;
        sender: { name: string };
    };
    updatedAt: string;
}

// Existing services
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

// ===== GROUP CHAT SERVICES =====

// Tạo nhóm chat mới
export const createGroup = async (groupData: {
    name: string;
    participantIds: string[];
    avatar?: string;
}): Promise<IConversation> => {
    const { data } = await api.post('/conversations/group', groupData);
    return data.data;
};

// Thêm thành viên vào nhóm
export const addMembersToGroup = async (
    conversationId: string, 
    memberIds: string[]
): Promise<IConversation> => {
    const { data } = await api.patch(`/conversations/${conversationId}/add-members`, {
        memberIds
    });
    return data.data;
};

// Xóa thành viên khỏi nhóm
export const removeMemberFromGroup = async (
    conversationId: string, 
    memberId: string
): Promise<IConversation> => {
    const { data } = await api.patch(`/conversations/${conversationId}/remove-member/${memberId}`);
    return data.data;
};

// Rời khỏi nhóm
export const leaveGroup = async (conversationId: string): Promise<void> => {
    await api.patch(`/conversations/${conversationId}/leave`);
};

// Cập nhật thông tin nhóm (tên, avatar)
export const updateGroupInfo = async (
    conversationId: string, 
    updates: {
        name?: string;
        avatar?: string;
    }
): Promise<IConversation> => {
    const { data } = await api.patch(`/conversations/${conversationId}/update`, updates);
    return data.data;
};

// Cập nhật quyền admin
export const updateGroupAdmins = async (
    conversationId: string, 
    memberId: string, 
    action: 'promote' | 'demote'
): Promise<IConversation> => {
    const { data } = await api.patch(`/conversations/${conversationId}/admin/${memberId}`, {
        action
    });
    return data.data;
};

// ===== HELPER FUNCTIONS =====

// Kiểm tra xem user có phải admin của nhóm không
export const isGroupAdmin = (conversation: IConversation, userId: string): boolean => {
    return conversation.admins?.includes(userId) || false;
};

// Lấy danh sách thành viên nhóm (trừ bản thân)
export const getGroupMembers = (conversation: IConversation, currentUserId: string): IParticipant[] => {
    return conversation.participants.filter(p => p._id !== currentUserId);
};
export const getAllUsers = async () => {
  const res = await api.get('/users/all');
  return res.data.data; // ✅ trả về mảng users
};
export const searchUsers = async (keyword: string) => {
  const res = await api.get(`/users/search?keyword=${encodeURIComponent(keyword)}`);
  return res.data.users; // Trả về danh sách users khớp keyword
};


// Format tên hiển thị cho conversation
export const getConversationDisplayName = (conversation: IConversation, currentUserId: string): string => {
    if (conversation.type === 'group') {
        return conversation.name || 'Nhóm chat';
    }
    
    // Với chat 1-1, lấy tên của người kia
    const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);
    return otherParticipant?.name || 'Người dùng';
};

// Lấy avatar hiển thị cho conversation
export const getConversationAvatar = (conversation: IConversation, currentUserId: string): string => {
    if (conversation.type === 'group') {
        return conversation.avatar?.url || '/default-group-avatar.png';
    }
    
    // Với chat 1-1, lấy avatar của người kia
    const otherParticipant = conversation.participants.find(p => p._id !== currentUserId);
    return otherParticipant?.avatar?.url || '/default-avatar.png';
};