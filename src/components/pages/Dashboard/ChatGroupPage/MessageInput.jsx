// pages/chat/components/MessageInput.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Button, Upload, message as antdMessage } from 'antd';
import { SendOutlined, PaperClipOutlined } from '@ant-design/icons';
import { useSocket } from '@/contexts/SocketContext';
import { useAuthContext } from '@/contexts/AuthContext';
import { uploadChatFile } from '@/services/api/Chat/chatservice';

const MessageInput = ({ conversation }) => {
    const { socket } = useSocket();
    const { user } = useAuthContext();
    const [text, setText] = useState('');

    const getPayload = (messageContent, messageType, attachment) => {
        // Nếu là chat nhóm, gửi sự kiện `send_group_message`
        if (conversation.type === 'project_group') {
            return {
                event: 'send_group_message',
                data: { conversationId: conversation._id, content: messageContent, messageType, attachment }
            };
        }
        
        // Ngược lại, là chat 1-1, gửi sự kiện `send_private_message`
        const otherUser = conversation.participants.find(p => p._id !== user.id);
        if (otherUser) {
            return {
                event: 'send_private_message',
                data: { receiverId: otherUser._id, content: messageContent, messageType, attachment }
            };
        }
        return null;
    };

    const handleSendMessage = () => {
        if (!socket || !text.trim() || !conversation) return;
        const payload = getPayload(text, 'text', undefined);
        
        if (payload) {
            socket.emit(payload.event, payload.data);
        } else {
            antdMessage.error("Lỗi: Không thể xác định người nhận.");
        }
        setText('');
    };

    const handleFileUpload = async (file) => {
        if (!socket || !conversation) return;
        
        const formData = new FormData();
        formData.append('file', file);
        
        try {
            antdMessage.loading({ content: 'Đang tải lên...', key: 'upload' });
            const attachment = await uploadChatFile(formData);
            const messageType = attachment.resource_type === 'image' ? 'image' : (attachment.resource_type === 'video' ? 'video' : 'file');
            const payload = getPayload(file.name, messageType, attachment);

            if (payload) {
                socket.emit(payload.event, payload.data);
            } else {
                 antdMessage.error("Lỗi: Không thể gửi file.");
            }
            antdMessage.success({ content: 'Tải lên thành công!', key: 'upload' });
        } catch (error) {
            antdMessage.error({ content: 'Tải lên thất bại.', key: 'upload' });
        }
    }

    return (
        <div className="flex items-center gap-2">
            <Upload customRequest={({ file }) => handleFileUpload(file)} showUploadList={false}>
                <Button icon={<PaperClipOutlined />} shape="circle" />
            </Upload>
            <Input.TextArea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPressEnter={(e) => {
                    if (!e.shiftKey) { e.preventDefault(); handleSendMessage(); }
                }}
                placeholder="Nhập tin nhắn..."
                autoSize={{ minRows: 1, maxRows: 4 }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} />
        </div>
    );
};

MessageInput.propTypes = {
    conversation: PropTypes.object.isRequired,
};

export default MessageInput;