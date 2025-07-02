// src/pages/ChatPage.jsx (hoặc đường dẫn của bạn)

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Button, Input, Avatar, message as antdMessage } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import { useSocket } from '../../../contexts/SocketContext';
import { useAuthContext } from '../../../contexts/AuthContext';
import { getConversations, getMessagesByConversationId, startConversation } from '../../../services/api/Chat/chatservice';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

export default function ChatPage() {
    const { socket } = useSocket();
    const { user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // State
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const conversationsRef = useRef(conversations);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    // --- FUNCTIONS ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadAndSetConversations = async () => {
        try {
            const convos = await getConversations();
            // Lọc ra chỉ những cuộc trò chuyện private
            const privateConvos = convos.filter(c => c.type === 'private' || !c.type)
                                      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            setConversations(privateConvos);
            return privateConvos;
        } catch (error) {
            console.error("Lỗi khi tải danh sách trò chuyện:", error);
            return [];
        }
    };

    const handleSelectConversation = (convo) => {
        if (activeConversation && activeConversation._id === convo._id) return;
        setActiveConversation(convo);
        // Không cần navigate ở đây nếu bạn muốn giữ layout này
    };

    // [SỬA LỖI LOGIC] Gửi đúng sự kiện và payload cho chat 1-1
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket && activeConversation) {
            const receiver = activeConversation.participants?.find(p => p._id !== user.id);
            if (!receiver) {
                antdMessage.error("Không tìm thấy người nhận.");
                return;
            }

            // Gửi sự kiện 'send_private_message' như đã định nghĩa ở backend
            socket.emit('send_private_message', {
                receiverId: receiver._id,
                content: newMessage,
                messageType: 'text',
            });

            // Thêm tin nhắn vào giao diện ngay lập tức để người dùng không phải chờ
            const tempMessage = {
                _id: Date.now().toString(), // ID tạm thời
                conversationId: activeConversation._id,
                senderId: user,
                content: newMessage,
                messageType: 'text',
                createdAt: new Date().toISOString()
            }
            setMessages(prev => [...prev, tempMessage]);
            setNewMessage('');
        }
    };

    // --- USEEFFECT HOOKS ---
    useEffect(() => {
        if (!user) return;
        const initialLoad = async () => {
            setLoading(true);
            const convos = await loadAndSetConversations();
            
            // Xử lý nếu được điều hướng từ nơi khác đến để mở 1 cuộc trò chuyện cụ thể
            const targetUserId = location.state?.targetUserId;
            if (targetUserId) {
                const existingConvo = convos.find(c => c.participants.some(p => p._id === targetUserId));
                if (existingConvo) {
                    setActiveConversation(existingConvo);
                } else {
                    // Nếu chưa có, tạo cuộc trò chuyện mới
                    try {
                        const newConvo = await startConversation(targetUserId);
                        setActiveConversation(newConvo);
                        setConversations(prev => [newConvo, ...prev]);
                    } catch (error) {
                        antdMessage.error("Không thể bắt đầu cuộc trò chuyện mới.");
                    }
                }
            } else if (convos.length > 0) {
                // Mặc định chọn cuộc trò chuyện đầu tiên
                setActiveConversation(convos[0]);
            }
            setLoading(false);
        };
        initialLoad();
    }, [user, location.state]);

    useEffect(() => {
        if (!activeConversation?._id) { setMessages([]); return; }
        const loadMessages = async () => {
            const messageHistory = await getMessagesByConversationId(activeConversation._id);
            setMessages(messageHistory.reverse());
        };
        loadMessages();
    }, [activeConversation?._id]);

    useEffect(() => {
        if (!socket) return;
        
        // [SỬA LỖI LOGIC] Cập nhật state hiệu quả, không gọi API lại
        const handleReceiveMessage = (message) => {
            const currentConversations = conversationsRef.current;
            const updatedConversations = currentConversations.map(convo => {
                if (convo._id === message.conversationId) {
                    return { ...convo, lastMessage: { content: message.content }, updatedAt: message.createdAt };
                }
                return convo;
            });
            setConversations(updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            
            if (message.conversationId === activeConversation?._id) {
                setMessages(prev => [...prev, message]);
            }
        };

        socket.on('receiveMessage', handleReceiveMessage);
        return () => socket.off('receiveMessage', handleReceiveMessage);
    }, [socket, activeConversation?._id]);

    useEffect(scrollToBottom, [messages]);

    // --- RENDER ---
    if (loading) return <div className="flex items-center justify-center h-screen"><Spin size="large" /></div>;

    return (
        <div className="flex h-[calc(100vh-100px)] bg-gray-50">
            <aside className="w-1/3 bg-white border-r flex flex-col">
                <header className="p-4 border-b font-bold text-lg">Cuộc trò chuyện</header>
                <ul className="overflow-y-auto">
                    {conversations.map(convo => {
                        const otherUser = convo.participants?.find(p => p._id !== user.id);
                        if (!otherUser) return null; // Bỏ qua nếu không tìm thấy người còn lại (ví dụ: nhóm chat)
                        return (
                            <li key={convo._id} onClick={() => handleSelectConversation(convo)} className={`p-3 cursor-pointer flex items-center gap-3 hover:bg-gray-100 ${activeConversation?._id === convo._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}>
                                <Avatar src={otherUser.avatar?.url} size={48}>{otherUser.name?.charAt(0)}</Avatar>
                                <div className="overflow-hidden flex-1">
                                    <p className="font-semibold truncate">{otherUser.name}</p>
                                    <p className="text-sm text-gray-500 truncate">{convo.lastMessage?.content || '...'}</p>
                                </div>
                                {convo.lastMessage && <span className="text-xs text-gray-400">{formatDistanceToNow(new Date(convo.updatedAt), { addSuffix: true, locale: vi })}</span>}
                            </li>
                        )
                    })}
                </ul>
            </aside>
            <main className="w-2/3 flex flex-col">
                {activeConversation ? (
                    <>
                        <header className="p-4 border-b font-semibold bg-white flex items-center gap-3">
                           <Avatar src={activeConversation.participants?.find(p => p._id !== user.id)?.avatar?.url}>{activeConversation.participants?.find(p => p._id !== user.id)?.name?.charAt(0)}</Avatar>
                           {activeConversation.participants?.find(p => p._id !== user.id)?.name}
                        </header>
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-100">
                            {messages.map(msg => (
                                <div key={msg._id} className={`mb-4 flex items-end gap-2 ${msg.senderId?._id === user.id ? 'justify-end' : 'justify-start'}`}>
                                    {msg.senderId?._id !== user.id && <Avatar src={msg.senderId?.avatar?.url}>{msg.senderId?.name?.charAt(0)}</Avatar>}
                                    <div className={`max-w-lg p-3 rounded-2xl ${msg.senderId?._id === user.id ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
                                        <p>{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex items-center gap-2">
                            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Nhập tin nhắn..." className="rounded-full px-4" />
                            <Button type="primary" shape="circle" htmlType="submit" icon={<SendOutlined />} size="large" />
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">Chọn một cuộc trò chuyện để bắt đầu</div>
                )}
            </main>
        </div>
    );
}