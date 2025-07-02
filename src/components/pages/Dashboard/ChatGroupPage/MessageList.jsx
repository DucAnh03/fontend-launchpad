// src/pages/chat/components/MessageList.jsx
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Avatar, Image, Typography } from 'antd';
import { UserOutlined, FileOutlined } from '@ant-design/icons';
import { format } from 'date-fns';

const MessageItem = ({ message, isSender }) => {
    const alignment = isSender ? 'justify-end' : 'justify-start';
    const bgColor = isSender ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black';

    const renderContent = () => {
        if (message.messageType === 'image') {
            return <Image src={message.attachment?.secure_url} width={200} className="rounded-lg" />;
        }
        if (message.messageType === 'video') {
            return <video src={message.attachment?.secure_url} width={250} controls className="rounded-lg"/>
        }
        if (message.messageType === 'file') {
             return <a href={message.attachment?.secure_url} target="_blank" rel="noopener noreferrer" className="flex items-center p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                 <FileOutlined className="mr-2"/>
                 <span>{message.content}</span>
             </a>
        }
        return <p>{message.content}</p>;
    }
    
    return (
        <div className={`flex items-end gap-2 my-2 ${alignment}`}>
            {!isSender && <Avatar src={message.senderId.avatar?.url} icon={<UserOutlined />} />}
            <div className="flex flex-col" style={{ maxWidth: '65%' }}>
                <div className={`px-4 py-2 rounded-2xl ${bgColor}`}>
                    {renderContent()}
                </div>
                <Typography.Text type="secondary" className={`text-xs mt-1 ${isSender ? 'text-right' : 'text-left'}`}>
                    {format(new Date(message.createdAt), 'HH:mm')}
                </Typography.Text>
            </div>
        </div>
    );
};

MessageItem.propTypes = {
    message: PropTypes.object.isRequired,
    isSender: PropTypes.bool.isRequired,
};

const MessageList = ({ messages, currentUser }) => {
    const endOfMessagesRef = useRef(null);

    useEffect(() => {
        endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div>
            {messages.map((msg) => (
                <MessageItem key={msg._id} message={msg} isSender={msg.senderId._id === currentUser.id} />
            ))}
            <div ref={endOfMessagesRef} />
        </div>
    );
};

MessageList.propTypes = {
    messages: PropTypes.array.isRequired,
    currentUser: PropTypes.object,
};

export default MessageList;