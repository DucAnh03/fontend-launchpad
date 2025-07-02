// src/pages/chat/components/ConversationList.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { List, Avatar, Typography, Skeleton } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { useAuthContext } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const { Text } = Typography;

const ConversationList = ({ conversations, onSelectConversation, selectedConversationId, loading }) => {
    const { user } = useAuthContext();

    const getConversationDisplayInfo = (conversation) => {
        // [QUAN TRỌNG] Phải kiểm tra 'type' để phân biệt
        if (conversation.type === 'project_group') {
            return {
                name: conversation.name || 'Nhóm chat dự án',
                avatar: <Avatar icon={<UserOutlined />} />
            };
        }
        
        // Mặc định là chat 1-1
        const otherParticipant = conversation.participants.find(p => p._id !== (user && user.id));
        return {
            name: (otherParticipant && otherParticipant.name) || 'Người dùng không xác định',
            avatar: <Avatar src={otherParticipant && otherParticipant.avatar && otherParticipant.avatar.url} icon={<UserOutlined />} />
        };
    };

    return (
        <div>
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold">Trò chuyện</h2>
            </div>
            <Skeleton loading={loading} active avatar paragraph={{ rows: 4 }}>
                <List
                    itemLayout="horizontal"
                    dataSource={conversations}
                    // Thêm rowKey để Ant Design biết cách xác định mỗi item
                    rowKey={item => item._id} 
                    renderItem={item => {
                        const { name, avatar } = getConversationDisplayInfo(item);
                        const isSelected = item._id === selectedConversationId;
                        return (
                            <List.Item
                                // [QUAN TRỌNG] Đảm bảo key được gán ở đây
                                key={item._id} 
                                onClick={() => onSelectConversation(item)}
                                className={`cursor-pointer hover:bg-gray-100 px-4 py-3 ${isSelected ? 'bg-blue-50' : ''}`}
                            >
                                <List.Item.Meta
                                    avatar={avatar}
                                    title={<Text strong>{name}</Text>}
                                    description={
                                        <Text type="secondary" ellipsis>
                                            {(item.lastMessage && item.lastMessage.content) || 'Chưa có tin nhắn'}
                                        </Text>
                                    }
                                />
                                {item.lastMessage && (
                                  <div className="text-xs text-gray-400">
                                    {formatDistanceToNow(new Date(item.updatedAt), { addSuffix: true, locale: vi })}
                                  </div>
                                )}
                            </List.Item>
                        );
                    }}
                />
            </Skeleton>
        </div>
    );
};
// Sử dụng PropTypes để kiểm tra kiểu dữ liệu của props
ConversationList.propTypes = {
    conversations: PropTypes.array.isRequired,
    onSelectConversation: PropTypes.func.isRequired,
    selectedConversationId: PropTypes.string,
    loading: PropTypes.bool.isRequired,
};

export default ConversationList;