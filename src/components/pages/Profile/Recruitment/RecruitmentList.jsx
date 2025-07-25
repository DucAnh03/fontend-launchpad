import React, { useEffect, useState } from 'react';
import api from '@/services/api/axios';
import { List, Card, Spin, message, Button, Modal, DatePicker, Tag, Space, Typography, Row, Col, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import { PlusOutlined, CalendarOutlined, EditOutlined, EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import './RecruitmentList.css';
import PostApplications from '../../RecruitmentPage/PostApplications';

const { Title, Text, Paragraph } = Typography;

export default function RecruitmentList() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateModalVisible, setUpdateModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newDeadline, setNewDeadline] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showApplicationsModal, setShowApplicationsModal] = useState(false);
    const [selectedPostId, setSelectedPostId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecruitmentPosts();
    }, []);

    const fetchRecruitmentPosts = () => {
        api.get('/recruitment-posts')
            .then(res => setData(res.data.data || []))
            .catch(() => {
                message.error('Không load được recruitment');
                setData([]);
            })
            .finally(() => setLoading(false));
    };

    const handleUpdateDeadline = () => {
        if (!newDeadline) {
            message.error('Vui lòng chọn deadline mới');
            return;
        }

        setUpdating(true);
        api.patch(`/recruitment-posts/${selectedPost._id}/deadline`, {
            deadline: newDeadline.toISOString()
        })
            .then(() => {
                message.success('Cập nhật deadline thành công');
                setUpdateModalVisible(false);
                setSelectedPost(null);
                setNewDeadline(null);
                fetchRecruitmentPosts(); // Refresh data
            })
            .catch(() => {
                message.error('Không thể cập nhật deadline');
            })
            .finally(() => setUpdating(false));
    };

    const openUpdateModal = (post) => {
        setSelectedPost(post);
        setNewDeadline(post.deadline ? dayjs(post.deadline) : null);
        setUpdateModalVisible(true);
    };

    const getStatusColor = (status) => {
        return status === 'open' ? 'green' : 'red';
    };

    const getExperienceColor = (level) => {
        const colors = {
            junior: 'blue',
            mid: 'orange',
            senior: 'purple'
        };
        return colors[level] || 'default';
    };

    const isDeadlinePassed = (deadline) => {
        return deadline && dayjs(deadline).isBefore(dayjs(), 'day');
    };

    if (loading) {
        return (
            <div className="loading-container">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="recruitment-list-container">
            {/* Header */}
            <div className="recruitment-header">
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '16px'
                }}>
                    <div>
                        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                            Quản lý bài đăng tuyển dụng
                        </Title>
                        <Text type="secondary">
                            Tổng cộng {data.length} bài đăng
                        </Text>
                    </div>
                    <Button
                        type="primary"
                        size="large"
                        icon={<PlusOutlined />}
                        onClick={() => navigate('/recruitment/create')}
                        className="create-button"
                    >
                        Tạo bài đăng mới
                    </Button>
                </div>
            </div>

            {/* Recruitment List */}
            {data.length === 0 ? (
                <div className="empty-state">
                    <Empty
                        description="Chưa có bài đăng tuyển dụng nào"
                        style={{ marginTop: '60px' }}
                    >
                        <Button type="primary" onClick={() => navigate('/recruitment/create')}>
                            Tạo bài đăng đầu tiên
                        </Button>
                    </Empty>
                </div>
            ) : (
                <List
                    grid={{
                        gutter: [24, 24],
                        xs: 1,
                        sm: 1,
                        md: 2,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                    }}
                    dataSource={data}
                    renderItem={item => (
                        <List.Item className="w-full">
                            <Card
                                hoverable
                                className="recruitment-card w-full"
                                style={{
                                    height: '100%',
                                    width: '100%',
                                    maxWidth: '100%',
                                    border: isDeadlinePassed(item.deadline) ? '2px solid #ff4d4f' : '1px solid #f0f0f0'
                                }}
                                actions={[
                                    <Button
                                        type="text"
                                        icon={<EyeOutlined />}
                                        onClick={() => {
                                            setSelectedPostId(item._id);
                                            setShowApplicationsModal(true);
                                        }}
                                    >
                                        Xem chi tiết
                                    </Button>,
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => openUpdateModal(item)}
                                    >
                                        Cập nhật deadline
                                    </Button>
                                ]}
                            >
                                <div style={{ marginBottom: '16px' }}>
                                    <Title level={4} style={{
                                        margin: 0,
                                        marginBottom: '8px',
                                        color: '#262626',
                                        lineHeight: '1.4'
                                    }}>
                                        {item.title}
                                    </Title>

                                    <Space wrap style={{ marginBottom: '12px' }}>
                                        <Tag color={getStatusColor(item.status)} className="status-tag">
                                            {item.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                                        </Tag>
                                        <Tag color={getExperienceColor(item.experienceLevel)} className="experience-tag">
                                            {item.experienceLevel === 'junior' ? 'Junior' :
                                                item.experienceLevel === 'mid' ? 'Mid-level' : 'Senior'}
                                        </Tag>
                                    </Space>
                                </div>

                                <Paragraph
                                    ellipsis={{
                                        rows: 3,
                                        expandable: true,
                                        symbol: 'Xem thêm'
                                    }}
                                    style={{
                                        color: '#595959',
                                        lineHeight: '1.6',
                                        marginBottom: '16px'
                                    }}
                                >
                                    {item.description}
                                </Paragraph>

                                {item.requiredSkills && item.requiredSkills.length > 0 && (
                                    <div style={{ marginBottom: '16px' }}>
                                        <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                            Kỹ năng yêu cầu:
                                        </Text>
                                        <div className="skills-container">
                                            {item.requiredSkills.slice(0, 3).map((skill, index) => (
                                                <Tag key={index} color="blue" className="skill-tag">{skill}</Tag>
                                            ))}
                                            {item.requiredSkills.length > 3 && (
                                                <Tag color="default" className="skill-tag">+{item.requiredSkills.length - 3}</Tag>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {item.deadline && (
                                    <div className={`deadline-badge ${isDeadlinePassed(item.deadline) ? 'expired' : 'active'}`}>
                                        <ClockCircleOutlined />
                                        <Text style={{
                                            color: isDeadlinePassed(item.deadline) ? 'white' : 'white',
                                            fontWeight: 500
                                        }}>
                                            Deadline: {dayjs(item.deadline).format('DD/MM/YYYY')}
                                            {isDeadlinePassed(item.deadline) && ' (Đã hết hạn)'}
                                        </Text>
                                    </div>
                                )}

                                <div style={{
                                    marginTop: '16px',
                                    paddingTop: '16px',
                                    borderTop: '1px solid #f0f0f0',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <Text type="secondary" style={{ fontSize: '12px' }}>
                                        Tạo lúc: {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                    </Text>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            )}

            {/* Update Deadline Modal */}
            <Modal
                title="Cập nhật deadline"
                open={updateModalVisible}
                onOk={handleUpdateDeadline}
                onCancel={() => {
                    setUpdateModalVisible(false);
                    setSelectedPost(null);
                    setNewDeadline(null);
                }}
                confirmLoading={updating}
                okText="Cập nhật"
                cancelText="Hủy"
                width={500}
                className="deadline-modal"
            >
                {selectedPost && (
                    <div>
                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Bài đăng: </Text>
                            <Text>{selectedPost.title}</Text>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <Text strong>Deadline hiện tại: </Text>
                            <Text type="secondary">
                                {selectedPost.deadline
                                    ? dayjs(selectedPost.deadline).format('DD/MM/YYYY HH:mm')
                                    : 'Chưa có deadline'
                                }
                            </Text>
                        </div>

                        <div>
                            <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                Deadline mới:
                            </Text>
                            <DatePicker
                                showTime
                                format="DD/MM/YYYY HH:mm"
                                placeholder="Chọn deadline mới"
                                value={newDeadline}
                                onChange={setNewDeadline}
                                style={{ width: '100%' }}
                                disabledDate={(current) => current && current < dayjs().startOf('day')}
                            />
                        </div>
                    </div>
                )}
            </Modal>

            {/* Applications Modal */}
            <Modal
                open={showApplicationsModal}
                onCancel={() => {
                    setShowApplicationsModal(false);
                    setSelectedPostId(null);
                }}
                footer={null}
                width={900}
                title="Danh sách ứng viên ứng tuyển"
                destroyOnClose
            >
                {selectedPostId && <PostApplications postId={selectedPostId} />}
            </Modal>
        </div>
    );
} 