import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, message, Modal, Space, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import api from '@/services/api/axios';
import dayjs from 'dayjs';
import { useParams, useNavigate } from 'react-router-dom';
import ApplicationDetailModal from './ApplicationDetailModal';

const { Text } = Typography;

export default function PostApplications({ postId: propPostId }) {
    const params = useParams();
    const postId = propPostId || params.postId;
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [detailModalOpen, setDetailModalOpen] = useState(false);

    useEffect(() => {
        if (postId) fetchApplications();
        // eslint-disable-next-line
    }, [postId]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/recruitment-posts/${postId}/applications`);
            setApplications(data.data || data);
        } catch (err) {
            message.error('Không thể tải danh sách ứng viên');
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        Modal.confirm({
            title: action === 'accept' ? 'Duyệt ứng viên này?' : 'Từ chối ứng viên này?',
            onOk: async () => {
                try {
                    await api.patch(`/recruitment-posts/${postId}/applications/${id}/${action}`);
                    message.success(action === 'accept' ? 'Đã duyệt ứng viên!' : 'Đã từ chối ứng viên!');
                    fetchApplications();
                } catch (err) {
                    message.error('Thao tác thất bại');
                }
            },
        });
    };

    const columns = [
        {
            title: 'Ứng viên',
            dataIndex: 'applicantId',
            key: 'applicantId',
            render: (user) => (
                <Space>
                    <Text strong>{user?.fullName || user?.name || 'Ẩn danh'}</Text>
                    <Button size="small" icon={<EyeOutlined />} onClick={() => navigate(`/users/${user.username}`)}>
                        Xem profile
                    </Button>
                </Space>
            ),
        },
        {
            title: 'Xem chi tiết',
            key: 'detail',
            render: (_, record) => (
                <Button size="small" onClick={() => { setSelectedApplication(record); setDetailModalOpen(true); }}>
                    Xem chi tiết
                </Button>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => {
                let color = 'default';
                if (status === 'applied') color = 'blue';
                if (status === 'accepted') color = 'green';
                if (status === 'rejected') color = 'red';
                if (status === 'interview') color = 'orange';
                return <Tag color={color}>{status}</Tag>;
            },
        },
        {
            title: 'Nộp lúc',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (val) => dayjs(val).format('DD/MM/YYYY HH:mm'),
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        size="small"
                        disabled={record.status !== 'applied'}
                        onClick={() => handleAction(record._id, 'accept')}
                    >
                        Accept
                    </Button>
                    <Button
                        danger
                        icon={<CloseOutlined />}
                        size="small"
                        disabled={record.status !== 'applied'}
                        onClick={() => handleAction(record._id, 'reject')}
                    >
                        Reject
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-xl font-bold mb-4">Danh sách ứng viên ứng tuyển</h2>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={applications}
                loading={loading}
                pagination={{ pageSize: 10 }}
            />
            <ApplicationDetailModal
                open={detailModalOpen}
                application={selectedApplication}
                onClose={() => setDetailModalOpen(false)}
            />
        </div>
    );
} 