import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Empty, Button } from 'antd';
import { getConversations } from '@/services/api/Chat/chatservice'; // Điều chỉnh đường dẫn nếu cần
import { useAuthContext } from '@/contexts/AuthContext';

export default function MessagesDropdown() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setLoading(true);
                const convos = await getConversations();
                setConversations(convos || []);
            } catch (error) {
                console.error("Lỗi khi tải cuộc trò chuyện cho dropdown:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchConversations();
    }, []);

    const handleConversationClick = (convo) => {
        // Điều hướng đến trang chat và truyền ID để trang đó tự động mở đúng cuộc trò chuyện
        navigate('/dashboard/messages', {
            state: { activeConversationId: convo._id }
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-2xl border w-80 md:w-96">
            <div className="p-4 border-b">
                <h3 className="text-lg font-bold">Tin nhắn</h3>
            </div>

            {loading ? (
                <div className="h-48 flex items-center justify-center">
                    <Spin />
                </div>
            ) : conversations.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto">
                    {conversations.map(convo => {
                        const otherUser = convo.participants?.find(p => p._id !== user._id);
                        return (
                            <li 
                                key={convo._id} 
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b"
                                onClick={() => handleConversationClick(convo)}
                            >
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={otherUser?.avatar?.url || '/default-avatar.png'} 
                                        alt={otherUser?.name} 
                                        className="w-10 h-10 rounded-full object-cover" 
                                    />
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-semibold text-gray-800 truncate">{otherUser?.name || 'Người dùng'}</p>
                                        <p className="text-sm text-gray-500 truncate">{convo.lastMessage?.content || '...'}</p>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="h-48 flex items-center justify-center">
                    <Empty description="Không có tin nhắn nào" />
                </div>
            )}

            <div className="p-2 text-center border-t">
                <Button type="link" onClick={() => navigate('/dashboard/messages')}>
                    Xem tất cả trong Messenger
                </Button>
            </div>
        </div>
    );
}
