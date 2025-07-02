// pages/chat/components/ChatWindow.jsx
import React from 'react';
import PropTypes from 'prop-types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { Avatar, Skeleton, Typography } from 'antd';
import { UserOutlined, MessageOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext'; 

const ChatWindow = ({ conversation, messages, loading }) => {
    const { user: currentUser } = useAuthContext();

    if (!conversation) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <MessageOutlined style={{ fontSize: '48px' }} />
                <p className="mt-4 text-lg">Chọn một cuộc trò chuyện để bắt đầu</p>
            </div>
        );
    }

    const getOtherUser = (conv) => {
        if (!conv || !currentUser) return null;
        return conv.participants.find(p => p._id !== currentUser.id);
    }
    
    const getConversationTitle = () => {
        if (conversation.name) return conversation.name;
        const otherUser = getOtherUser(conversation);
        return (otherUser && otherUser.name) || "Cuộc trò chuyện";
    }

    const otherUserForAvatar = getOtherUser(conversation);
    const avatarUrl = otherUserForAvatar && otherUserForAvatar.avatar && otherUserForAvatar.avatar.url;

    return (
        <div className="flex flex-col h-full">
            <header className="flex items-center p-4 border-b border-gray-200 shadow-sm">
                 <Avatar size="large" src={avatarUrl} icon={<UserOutlined />} />
                 <div className="ml-4">
                     <Typography.Title level={5} className="!mb-0">{getConversationTitle()}</Typography.Title>
                     <Typography.Text type="secondary">Online</Typography.Text>
                 </div>
            </header>
            <div className="flex-1 p-4 overflow-y-auto">
                {loading ? (
                    <Skeleton active paragraph={{ rows: 10 }} />
                ) : (
                    <MessageList messages={messages} currentUser={currentUser} />
                )}
            </div>
            <div className="p-4 border-t border-gray-200">
                <MessageInput conversation={conversation} />
            </div>
        </div>
    );
};

ChatWindow.propTypes = {
    conversation: PropTypes.object,
    messages: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
};

export default ChatWindow;