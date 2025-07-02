// src/pages/chat/ChatGroupPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Layout, message as antdMessage } from 'antd';
import { getConversations, getMessagesByConversationId } from '@/services/api/Chat/chatservice';
import { useSocket } from '@/contexts/SocketContext';
import { useAuthContext } from '@/contexts/AuthContext';
import ConversationList from './ConversationList';
import ChatWindow from './ChatWindow';

const { Sider, Content } = Layout;

const ChatGroupPage = () => {
    const { socket } = useSocket();
    const { user } = useAuthContext();

    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);

    // Dùng useRef để lưu trữ conversations, tránh các vấn đề về closure trong socket listener
    const conversationsRef = useRef(conversations);
    useEffect(() => {
        conversationsRef.current = conversations;
    }, [conversations]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const data = await getConversations();
                // Sắp xếp ngay từ đầu để cuộc trò chuyện mới nhất luôn ở trên
                const sortedData = data.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
                setConversations(sortedData);
            } catch (error) {
                antdMessage.error('Không thể tải danh sách cuộc trò chuyện.');
            } finally {
                setLoadingConversations(false);
            }
        };
        if (user) {
            fetchConversations();
        }
    }, [user]);

    const handleSelectConversation = async (conversation) => {
        if (selectedConversation && selectedConversation._id === conversation._id) return;
        
        setSelectedConversation(conversation);
        setMessages([]); 
        setLoadingMessages(true);

        try {
            const messagesData = await getMessagesByConversationId(conversation._id);
            setMessages(messagesData.reverse());
        } catch (error) {
            antdMessage.error('Không thể tải tin nhắn cho cuộc trò chuyện này.');
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
            // Lấy danh sách conversations mới nhất từ ref
            const currentConversations = conversationsRef.current;
            let conversationExists = false;

            const updatedConversations = currentConversations.map(convo => {
                if (convo._id === newMessage.conversationId) {
                    conversationExists = true;
                    // Cập nhật lastMessage và thời gian
                    return { 
                        ...convo, 
                        lastMessage: { 
                            content: newMessage.content || `[${newMessage.messageType}]`, 
                            sender: { name: newMessage.senderId.name } 
                        }, 
                        updatedAt: newMessage.createdAt 
                    };
                }
                return convo;
            });
            
            // Nếu là cuộc trò chuyện mới hoàn toàn (chưa có trong danh sách)
            if (!conversationExists) {
                // Cần một cơ chế để fetch thông tin của cuộc trò chuyện mới này
                // Tạm thời chỉ log ra để xử lý sau
                console.log("Nhận được tin nhắn từ cuộc trò chuyện mới, cần fetch lại danh sách");
            }

            // Sắp xếp lại và cập nhật state
            setConversations(updatedConversations.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
            
            // Cập nhật cửa sổ chat đang mở
            if (selectedConversation && newMessage.conversationId === selectedConversation._id) {
                setMessages(prevMessages => [...prevMessages, newMessage]);
            }
        };

        socket.on('receiveMessage', handleNewMessage);
        return () => {
            socket.off('receiveMessage', handleNewMessage);
        };
    }, [socket, selectedConversation]);

    return (
        <div className="h-[calc(100vh-120px)]">
            <Layout className="h-full bg-white shadow-lg rounded-xl border border-gray-200">
                <Sider width={320} className="h-full overflow-y-auto bg-white border-r border-gray-200" theme="light">
                    <ConversationList
                        conversations={conversations}
                        onSelectConversation={handleSelectConversation}
                        selectedConversationId={selectedConversation && selectedConversation._id}
                        loading={loadingConversations}
                    />
                </Sider>
                <Content className="h-full">
                    <ChatWindow
                        conversation={selectedConversation}
                        messages={messages}
                        loading={loadingMessages}
                    />
                </Content>
            </Layout>
        </div>
    );
};

export default ChatGroupPage;