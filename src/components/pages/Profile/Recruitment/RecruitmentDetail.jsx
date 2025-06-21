import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRecruitmentById } from '@/services/api/recruitment/recruitment';
import { Card, Spin, Tag, Typography, Image, Space } from 'antd';
import { ClockCircleOutlined, UserOutlined, TeamOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function RecruitmentDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getRecruitmentById(id);
                setPost(data);
            } catch (err) {
                setError('Không thể tải thông tin bài đăng');
                console.error('Error fetching recruitment:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (loading) return <Spin size="large" className="flex justify-center items-center h-screen" />;
    if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
    if (!post) return <div className="text-center p-8">Không tìm thấy bài đăng</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <Card className="shadow-lg">
                <Space direction="vertical" size="large" className="w-full">
                    <div>
                        <Title level={2}>{post.title}</Title>
                        <Space size="middle">
                            <Tag color={post.status === 'open' ? 'green' : 'red'}>
                                {post.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                            </Tag>
                            <Tag color="blue">
                                <TeamOutlined /> {post.experienceLevel}
                            </Tag>
                            {post.deadline && (
                                <Tag color="orange">
                                    <ClockCircleOutlined /> Hạn chót: {new Date(post.deadline).toLocaleDateString()}
                                </Tag>
                            )}
                        </Space>
                    </div>

                    <div>
                        <Title level={4}>Mô tả</Title>
                        <Paragraph>{post.description}</Paragraph>
                    </div>

                    <div>
                        <Title level={4}>Kỹ năng yêu cầu</Title>
                        <Space wrap>
                            {post.requiredSkills.map((skill, index) => (
                                <Tag key={index} color="purple">{skill}</Tag>
                            ))}
                        </Space>
                    </div>

                    {post.recruitmentLinkToImages && post.recruitmentLinkToImages.length > 0 && (
                        <div>
                            <Title level={4}>Hình ảnh</Title>
                            <Image.PreviewGroup>
                                <Space wrap>
                                    {post.recruitmentLinkToImages.map((image, index) => (
                                        <Image
                                            key={index}
                                            width={200}
                                            src={image}
                                            alt={`Recruitment image ${index + 1}`}
                                        />
                                    ))}
                                </Space>
                            </Image.PreviewGroup>
                        </div>
                    )}

                    <div className="text-gray-500 text-sm">
                        <p>Đăng bởi: <UserOutlined /> {post.leaderId}</p>
                        <p>Ngày đăng: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                </Space>
            </Card>
        </div>
    );
} 