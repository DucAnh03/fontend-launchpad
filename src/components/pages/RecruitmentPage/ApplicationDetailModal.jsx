import React from 'react';
import { Modal, Typography, Tag, Descriptions, Divider, Button } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

export default function ApplicationDetailModal({ open, application, onClose }) {
    if (!application) return null;
    const {
        reason,
        portfolioUrl,
        portfolioUrls = [],
        socialLinks = {},
        resumeUrl,
        languages = [],
        status,
        createdAt,
        applicantId,
    } = application;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={600}
            title={<span>Chi tiết đơn ứng tuyển</span>}
        >
            <Descriptions column={1} bordered size="small">
                <Descriptions.Item label="Ứng viên">
                    <Text strong>{applicantId?.fullName || applicantId?.name || 'Ẩn danh'}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái">
                    <Tag color={status === 'applied' ? 'blue' : status === 'accepted' ? 'green' : status === 'rejected' ? 'red' : 'orange'}>{status}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Nộp lúc">
                    {dayjs(createdAt).format('DD/MM/YYYY HH:mm')}
                </Descriptions.Item>
                {reason && (
                    <Descriptions.Item label="Lý do ứng tuyển">
                        <Text>{reason}</Text>
                    </Descriptions.Item>
                )}
                {portfolioUrl && (
                    <Descriptions.Item label="Portfolio (cũ)">
                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer">{portfolioUrl}</a>
                    </Descriptions.Item>
                )}
                {portfolioUrls.length > 0 && (
                    <Descriptions.Item label="Portfolio khác">
                        {portfolioUrls.map((url, idx) => (
                            <div key={idx}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></div>
                        ))}
                    </Descriptions.Item>
                )}
                {resumeUrl && (
                    <Descriptions.Item label="CV/Resume">
                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer">Xem CV</a>
                    </Descriptions.Item>
                )}
                {(socialLinks.linkedin || socialLinks.github || socialLinks.website) && (
                    <Descriptions.Item label="Mạng xã hội">
                        {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                        {socialLinks.github && <span style={{ marginLeft: 8 }}><a href={socialLinks.github} target="_blank" rel="noopener noreferrer">Github</a></span>}
                        {socialLinks.website && <span style={{ marginLeft: 8 }}><a href={socialLinks.website} target="_blank" rel="noopener noreferrer">Website</a></span>}
                    </Descriptions.Item>
                )}
                {languages.length > 0 && (
                    <Descriptions.Item label="Ngôn ngữ">
                        {languages.map((lang, idx) => (
                            <Tag key={idx}>{lang.language} ({lang.proficiency})</Tag>
                        ))}
                    </Descriptions.Item>
                )}
            </Descriptions>
            <Divider />
            <div style={{ textAlign: 'right' }}>
                <Button onClick={onClose}>Đóng</Button>
            </div>
        </Modal>
    );
} 