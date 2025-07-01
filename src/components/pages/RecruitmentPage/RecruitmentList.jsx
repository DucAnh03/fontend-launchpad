import React, { useEffect, useState } from 'react';
import {
    List,
    Card,
    Spin,
    message,
    Button,
    Tag,
    Space,
    Typography,
    Empty,
    Image,
    Avatar,
    Divider,
    Row,
    Col,
    Input,
    Select,
    Badge,
    Carousel
} from 'antd';
import {
    SearchOutlined,
    FilterOutlined,
    CalendarOutlined,
    UserOutlined,
    ClockCircleOutlined,
    EyeOutlined,
    SendOutlined,
    StarOutlined,
    PlusOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { listRecruitmentPosts } from '@/services/api/recruitment/recruitment';
import ApplyRecruitmentModal from './ApplyRecruitmentModal';
import './RecruitmentList.css';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function PublicRecruitmentList() {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [experienceFilter, setExperienceFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [applyModalVisible, setApplyModalVisible] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecruitmentPosts();
    }, []);

    useEffect(() => {
        filterData();
    }, [data, searchText, experienceFilter, statusFilter]);

    const fetchRecruitmentPosts = async () => {
        try {
            setLoading(true);
            const posts = await listRecruitmentPosts();
            setData(posts);
        } catch (error) {
            message.error('Không thể tải danh sách tuyển dụng');
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    const filterData = () => {
        let filtered = data.filter(post => {
            // Search filter
            const matchesSearch = searchText === '' ||
                post.title.toLowerCase().includes(searchText.toLowerCase()) ||
                post.description.toLowerCase().includes(searchText.toLowerCase()) ||
                post.requiredSkills.some(skill =>
                    skill.toLowerCase().includes(searchText.toLowerCase())
                );

            // Experience filter
            const matchesExperience = experienceFilter === 'all' ||
                post.experienceLevel === experienceFilter;

            // Status filter
            const matchesStatus = statusFilter === 'all' ||
                post.status === statusFilter;

            return matchesSearch && matchesExperience && matchesStatus;
        });

        setFilteredData(filtered);
    };

    const handleApply = (post) => {
        setSelectedPost(post);
        setApplyModalVisible(true);
    };

    const handleApplySuccess = () => {
        message.success('Đã gửi đơn ứng tuyển thành công!');
        // Optionally refresh the data or update the UI
    };

    const handleApplyCancel = () => {
        setApplyModalVisible(false);
        setSelectedPost(null);
    };

    const handleViewDetail = (postId) => {
        navigate(`/recruitment/${postId}`);
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

    const getExperienceText = (level) => {
        const texts = {
            junior: 'Junior',
            mid: 'Mid-level',
            senior: 'Senior'
        };
        return texts[level] || level;
    };

    const isDeadlinePassed = (deadline) => {
        return deadline && dayjs(deadline).isBefore(dayjs(), 'day');
    };

    const isDeadlineNear = (deadline) => {
        return deadline && dayjs(deadline).isBefore(dayjs().add(3, 'day')) && !isDeadlinePassed(deadline);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Spin size="large" />
                    <Text style={{ marginTop: 16, display: 'block' }}>Đang tải danh sách tuyển dụng...</Text>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Header Section */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full mr-3"></div>
                        Cơ hội nghề nghiệp
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Khám phá các vị trí công việc hấp dẫn từ các leader hàng đầu
                    </p>

                    {/* Search and Filter Bar */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
                        <Row gutter={[16, 16]} align="middle">
                            <Col xs={24} sm={24} md={12} lg={10}>
                                <div className="relative">
                                    <Input
                                        placeholder="Tìm kiếm theo tiêu đề, mô tả hoặc kỹ năng..."
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        size="large"
                                        prefix={<SearchOutlined className="text-gray-400" />}
                                        className="w-full pl-10 pr-4 py-3 rounded-full border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                    />
                                </div>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <select
                                    value={experienceFilter}
                                    onChange={e => setExperienceFilter(e.target.value)}
                                    className="w-full h-10 px-3 rounded border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="junior">Junior</option>
                                    <option value="mid">Mid-level</option>
                                    <option value="senior">Senior</option>
                                </select>
                            </Col>
                            <Col xs={12} sm={12} md={6} lg={4}>
                                <select
                                    value={statusFilter}
                                    onChange={e => setStatusFilter(e.target.value)}
                                    className="w-full h-10 px-3 rounded border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                                >
                                    <option value="all">Tất cả</option>
                                    <option value="open">Đang mở</option>
                                    <option value="closed">Đã đóng</option>
                                </select>
                            </Col>
                            <Col xs={24} sm={24} md={12} lg={6}>
                                <div className="text-center p-3 bg-blue-50 rounded-xl">
                                    <Text className="text-blue-600 font-medium">
                                        {filteredData.length} kết quả
                                    </Text>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>

                {/* Recruitment List */}
                {filteredData.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Empty
                            description={
                                searchText || experienceFilter !== 'all' || statusFilter !== 'all'
                                    ? "Không tìm thấy bài đăng phù hợp"
                                    : "Chưa có bài đăng tuyển dụng nào"
                            }
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                        >
                            {(searchText || experienceFilter !== 'all' || statusFilter !== 'all') && (
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        setSearchText('');
                                        setExperienceFilter('all');
                                        setStatusFilter('all');
                                    }}
                                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-full px-6 shadow-md"
                                >
                                    Xóa bộ lọc
                                </Button>
                            )}
                        </Empty>
                    </div>
                ) : (
                    <div className="space-y-5">
                        {filteredData.map(item => (
                            <div
                                key={item._id}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                            >
                                <div className="p-6">
                                    {/* Post Header */}
                                    <div className="flex items-start gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                            <UserOutlined />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Leader</h4>
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Tag color={getStatusColor(item.status)} className="status-tag-modern">
                                                        {item.status === 'open' ? 'Đang mở' : 'Đã đóng'}
                                                    </Tag>
                                                    <Tag color={getExperienceColor(item.experienceLevel)} className="experience-tag-modern">
                                                        {getExperienceText(item.experienceLevel)}
                                                    </Tag>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Post Content */}
                                    <div className="mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.title}</h3>
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    {/* Skills Section */}
                                    {item.requiredSkills && item.requiredSkills.length > 0 && (
                                        <div className="mb-4">
                                            <Text strong className="text-gray-900 mb-2 block">
                                                Kỹ năng yêu cầu:
                                            </Text>
                                            <div className="flex flex-wrap gap-2">
                                                {item.requiredSkills.slice(0, 4).map((skill, index) => (
                                                    <Tag key={index} className="bg-blue-50 text-blue-600 border-blue-100 rounded-full px-3 py-1 text-xs font-medium">
                                                        {skill}
                                                    </Tag>
                                                ))}
                                                {item.requiredSkills.length > 4 && (
                                                    <Tag className="bg-gray-50 text-gray-600 border-gray-100 rounded-full px-3 py-1 text-xs font-medium">
                                                        +{item.requiredSkills.length - 4}
                                                    </Tag>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Deadline Section */}
                                    {item.deadline && (
                                        <div className={`mb-4 p-3 rounded-xl ${isDeadlinePassed(item.deadline)
                                            ? 'bg-red-50 border border-red-200'
                                            : isDeadlineNear(item.deadline)
                                                ? 'bg-orange-50 border border-orange-200'
                                                : 'bg-green-50 border border-green-200'
                                            }`}>
                                            <div className="flex items-center gap-2">
                                                <ClockCircleOutlined className={`${isDeadlinePassed(item.deadline)
                                                    ? 'text-red-500'
                                                    : isDeadlineNear(item.deadline)
                                                        ? 'text-orange-500'
                                                        : 'text-green-500'
                                                    }`} />
                                                <Text className={`font-medium ${isDeadlinePassed(item.deadline)
                                                    ? 'text-red-600'
                                                    : isDeadlineNear(item.deadline)
                                                        ? 'text-orange-600'
                                                        : 'text-green-600'
                                                    }`}>
                                                    Deadline: {dayjs(item.deadline).format('DD/MM/YYYY')}
                                                    {isDeadlinePassed(item.deadline) && ' (Đã hết hạn)'}
                                                    {isDeadlineNear(item.deadline) && !isDeadlinePassed(item.deadline) && ' (Sắp hết hạn)'}
                                                </Text>
                                            </div>
                                        </div>
                                    )}

                                    {/* Image Section - Moved below content */}
                                    {item.recruitmentLinkToImages && item.recruitmentLinkToImages.length > 0 && (
                                        <div className="recruitment-carousel-container">
                                            <Carousel dots draggable={false}>
                                                {item.recruitmentLinkToImages.map((img, idx) => (
                                                    <div key={idx} className="carousel-image-wrapper">
                                                        <img
                                                            alt={item.title}
                                                            src={img}
                                                            style={{
                                                                width: '100%',
                                                                height: '300px',
                                                                objectFit: 'cover',
                                                                borderRadius: '16px'
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                            </Carousel>
                                            {item.status === 'closed' && (
                                                <div className="absolute top-4 right-4">
                                                    <Tag color="red" className="closed-tag-modern">
                                                        Đã đóng
                                                    </Tag>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="action-section-modern">
                                        <Button
                                            type="text"
                                            icon={<EyeOutlined />}
                                            onClick={() => handleViewDetail(item._id)}
                                            className="action-button-modern"
                                        >
                                            Xem chi tiết
                                        </Button>

                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={() => handleApply(item)}
                                            disabled={item.status === 'closed'}
                                            className="apply-button-modern"
                                        >
                                            Ứng tuyển
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Apply Recruitment Modal */}
                <ApplyRecruitmentModal
                    visible={applyModalVisible}
                    onCancel={handleApplyCancel}
                    onSuccess={handleApplySuccess}
                    postId={selectedPost?._id}
                    postTitle={selectedPost?.title}
                />
            </div>
        </div>
    );
} 