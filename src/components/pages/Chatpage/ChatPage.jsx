import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Spin, Button, Upload, message, Input } from 'antd';
import { PaperClipOutlined, SendOutlined } from '@ant-design/icons';

// --- Contexts ---
import { useSocket } from '../../../contexts/SocketContext';
import { useAuthContext } from '../../../contexts/AuthContext';

// --- Services ---
import { getConversations, getMessagesByConversationId, startConversation, uploadChatFile } from '../../../services/api/Chat/chatservice';

export default function ChatPage() {
    // --- HOOKS & CONTEXT ---
    const { socket } = useSocket();
    const { user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);

    // --- COMPONENT STATES ---
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [unreadConversations, setUnreadConversations] = useState(new Set());
    const [uploading, setUploading] = useState(false);

    // --- FUNCTIONS ---
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const loadConversations = async () => {
        try {
            const convos = await getConversations();
            setConversations(convos || []);
            return convos || [];
        } catch (error) {
            console.error("Lỗi khi tải danh sách trò chuyện:", error);
            return [];
        }
    };

    const handleSelectConversation = (convo) => {
        setActiveConversation(convo);
        setUnreadConversations(prev => {
            const newSet = new Set(prev);
            newSet.delete(convo._id);
            return newSet;
        });
        navigate(`/dashboard/messages/${convo._id}`, { replace: true });
    };

    const handleFileUpload = async (file) => {
        if (!activeConversation) {
            message.error("Vui lòng chọn một cuộc trò chuyện trước khi gửi file.");
            return;
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('attachment', file);
        try {
            const attachmentData = await uploadChatFile(formData);
            const receiver = activeConversation.participants.find(p => p._id !== user._id);
            if (!receiver) return;
            const messageData = {
                receiverId: receiver._id,
                conversationId: activeConversation._id,
                messageType: attachmentData.resource_type || 'image', // Mặc định là 'image' nếu không có
                attachment: attachmentData,
            };
            socket.emit('sendMessage', messageData);
        } catch (error) {
            message.error("Tải file lên thất bại!");
        } finally {
            setUploading(false);
        }
    };

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (newMessage.trim() && socket && activeConversation) {
            const receiver = activeConversation.participants?.find(p => p._id !== user._id);
            if (!receiver) return;
            const messageData = {
                receiverId: receiver._id,
                content: newMessage,
                messageType: 'text',
                conversationId: activeConversation._id,
            };
            socket.emit('sendMessage', messageData);
            setNewMessage('');
        }
    };

    // --- SIDE EFFECTS (useEffect) ---
    useEffect(() => {
        if (!user) return;
        const initialLoad = async () => {
            setLoading(true);
            const convos = await loadConversations();
            const initialConvoId = location.state?.activeConversationId;
            if (initialConvoId) {
                const initialConvo = convos.find(c => c._id === initialConvoId);
                if (initialConvo) handleSelectConversation(initialConvo);
            }
            setLoading(false);
        };
        initialLoad();
    }, [user, location.state]);

    useEffect(() => {
        if (!activeConversation?._id) {
            setMessages([]);
            return;
        }
        const loadMessages = async () => {
            try {
                const messageHistory = await getMessagesByConversationId(activeConversation._id);
                setMessages(messageHistory.reverse());
            } catch (err) {
                console.error("Lỗi khi tải lịch sử tin nhắn:", err);
                setMessages([]);
            }
        };
        loadMessages();
    }, [activeConversation?._id]);
    
    useEffect(() => {
        if (!socket) return;
        const handleReceiveMessage = (message) => {
            const isChatOpen = message.conversationId === activeConversation?._id;
            if (isChatOpen) {
                setMessages(prev => [...prev, message]);
            } else {
                setUnreadConversations(prev => new Set(prev).add(message.conversationId));
            }
            loadConversations();
        };

        socket.on('receiveMessage', handleReceiveMessage);
        return () => socket.off('receiveMessage', handleReceiveMessage);
    }, [socket, activeConversation?._id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (loading) return <div className="flex items-center justify-center h-screen"><Spin size="large" /></div>;

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* Cột danh sách cuộc trò chuyện */}
            <aside className="w-1/4 bg-white border-r flex flex-col">
                <header className="p-4 border-b">
                    <h2 className="font-bold text-xl text-gray-800">Trò chuyện</h2>
                </header>
                <ul className="overflow-y-auto flex-1">
                    {conversations?.map(convo => {
                        const otherUser = convo.participants?.find(p => p._id !== user._id);
                        const isUnread = unreadConversations.has(convo._id);
                        return (
                            <li 
                                key={convo._id} 
                                onClick={() => handleSelectConversation(convo)} 
                                className={`p-3 cursor-pointer flex items-center gap-4 hover:bg-gray-100 transition-colors ${activeConversation?._id === convo._id ? 'bg-blue-50 border-r-4 border-blue-500' : ''}`}
                            >
                                <div className="relative flex-shrink-0">
                                    <img src={otherUser?.avatar?.url || '/default-avatar.png'} alt={otherUser?.name} className="w-12 h-12 rounded-full object-cover" />
                                    {isUnread && <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white" title="Tin nhắn mới"></span>}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className={`font-semibold ${isUnread ? 'text-gray-900' : 'text-gray-700'}`}>{otherUser?.name || 'Người dùng'}</p>
                                    <p className={`text-sm truncate ${isUnread ? 'text-gray-800 font-medium' : 'text-gray-500'}`}>{convo.lastMessage?.content || "..."}</p>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </aside>

            {/* Cửa sổ chat chính */}
            <main className="w-3/4 flex flex-col">
                {activeConversation ? (
                    <>
                        <header className="p-4 border-b font-semibold bg-white flex items-center gap-3">
                            <img src={activeConversation.participants?.find(p => p._id !== user._id)?.avatar?.url || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" />
                            {activeConversation.participants?.find(p => p._id !== user._id)?.name}
                        </header>
                        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
                            {messages?.map(msg => (
                                <div key={msg._id} className={`mb-2 flex ${msg.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-lg p-2 rounded-2xl ${msg.senderId._id === user._id ? 'bg-blue-500 text-white' : 'bg-white shadow-sm'}`}>
                                        {msg.messageType === 'text' && (
                                            <p className="px-2 py-1 whitespace-pre-wrap">{msg.content}</p>
                                        )}
                                        {msg.messageType === 'image' && msg.attachment?.secure_url && (
                                            <img src={msg.attachment.secure_url} alt="Ảnh đã gửi" className="rounded-xl max-w-xs block cursor-pointer" onClick={() => window.open(msg.attachment.secure_url, '_blank')} />
                                        )}
                                        {msg.messageType === 'video' && msg.attachment?.secure_url && (
                                            <video src={msg.attachment.secure_url} controls className="rounded-xl max-w-xs block" />
                                        )}
                                        <p className="text-xs opacity-70 mt-1 text-right px-2">{new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex items-center gap-2">
                            <Upload customRequest={({ file }) => handleFileUpload(file)} showUploadList={false} disabled={uploading || !activeConversation}>
                                <Button icon={<PaperClipOutlined />} shape="circle" loading={uploading} />
                            </Upload>
                            <Input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} className="flex-1 px-4 py-2 border rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Nhập tin nhắn..." />
                            <Button type="primary" htmlType="submit" shape="circle" icon={<SendOutlined />} />
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        <div className="text-center">
                           <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                           <h3 className="mt-2 text-lg font-medium text-gray-800">Chào mừng đến với Trò chuyện</h3>
                           <p className="mt-1 text-sm text-gray-500">Chọn một cuộc trò chuyện để bắt đầu.</p>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}