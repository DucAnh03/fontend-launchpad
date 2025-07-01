import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api/axios';
import { Card, Avatar, Spin, Typography, Tag, Button, message, Row, Col, Divider } from 'antd';
import { UserOutlined, MailOutlined, TrophyOutlined, StarOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

export default function UserPublicProfile() {
    const { username } = useParams();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUser();
        // eslint-disable-next-line
    }, [username]);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/users/${username}`);
            setUser(data.data || data);
        } catch (err) {
            message.error('Không thể tải thông tin người dùng');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Text type="secondary">Không tìm thấy người dùng</Text>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <Card className="max-w-3xl mx-auto rounded-xl shadow-lg p-8">
                <Row gutter={32} align="middle">
                    <Col xs={24} md={8} className="flex flex-col items-center justify-center">
                        <Avatar
                            size={128}
                            src={user.avatar?.url}
                            icon={<UserOutlined />}
                            className="border-4 border-blue-100 shadow-xl mb-4"
                        />
                        <Title level={3} style={{ marginBottom: 0 }}>{user.name}</Title>
                        <Text type="secondary">@{user.username}</Text>
                        <Divider />
                        <div className="flex flex-col items-center gap-2">
                            <div><TrophyOutlined className="text-yellow-500 mr-1" /> Level {user.level}</div>
                            <div><StarOutlined className="text-yellow-400 mr-1" /> {user.points} điểm</div>
                            <div><TeamOutlined className="text-blue-500 mr-1" /> {user.userRank}</div>
                        </div>
                    </Col>
                    <Col xs={24} md={16}>
                        <div className="mb-6">
                            <Title level={4}>Giới thiệu</Title>
                            <Paragraph>{user.bio || 'Chưa có thông tin giới thiệu.'}</Paragraph>
                        </div>
                        <div className="mb-6">
                            <Title level={4}>Kỹ năng</Title>
                            <div className="flex flex-wrap gap-2">
                                {user.skills && user.skills.length > 0 ? (
                                    user.skills.map((skill, idx) => (
                                        <Tag key={idx} color="blue">{skill.skill} - Level {skill.level}</Tag>
                                    ))
                                ) : (
                                    <Text type="secondary">Chưa có kỹ năng</Text>
                                )}
                            </div>
                        </div>
                        <div className="mb-6">
                            <Title level={4}>Mạng xã hội</Title>
                            <div className="flex flex-wrap gap-2">
                                {user.socialLinks?.linkedin && <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                                {user.socialLinks?.github && <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer">Github</a>}
                                {user.socialLinks?.website && <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer">Website</a>}
                                {(!user.socialLinks?.linkedin && !user.socialLinks?.github && !user.socialLinks?.website) && <Text type="secondary">Không có</Text>}
                            </div>
                        </div>
                        <div className="mb-6">
                            <Title level={4}>Portfolio</Title>
                            {user.portfolioUrl && <div><a href={user.portfolioUrl} target="_blank" rel="noopener noreferrer">{user.portfolioUrl}</a></div>}
                            {user.portfolioUrls && user.portfolioUrls.length > 0 && user.portfolioUrls.map((url, idx) => (
                                <div key={idx}><a href={url} target="_blank" rel="noopener noreferrer">{url}</a></div>
                            ))}
                            {(!user.portfolioUrl && (!user.portfolioUrls || user.portfolioUrls.length === 0)) && <Text type="secondary">Không có</Text>}
                        </div>
                        <div className="mb-6">
                            <Title level={4}>Followers / Following</Title>
                            <div className="flex gap-6">
                                <div><b>{user.followers?.length || 0}</b> followers</div>
                                <div><b>{user.following?.length || 0}</b> following</div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
} 