import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Button,
  Table,
  Tag,
  Avatar,
  Progress,
  List,
  Badge,
  Alert,
  Timeline,
  Divider,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  WarningOutlined,
  BellOutlined,
  TrophyOutlined,
  StarOutlined,
  CrownOutlined,
  FireOutlined,
  ThunderboltOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import api from "@/services/api/axios";
import styled from "styled-components";

const { Title, Text } = Typography;

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  background: transparent;
  min-height: 100vh;
`;

const WelcomeCard = styled(Card)`
  && {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 16px;
    margin-bottom: 24px;
    box-shadow: 0 8px 32px rgba(102, 126, 234, 0.3);

    .ant-card-body {
      padding: 32px;
    }

    h1,
    p {
      color: white !important;
      margin: 0;
    }

    .welcome-stats {
      display: flex;
      gap: 32px;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      color: rgba(255, 255, 255, 0.9) !important;

      .anticon {
        font-size: 18px;
        color: rgba(255, 255, 255, 0.8);
      }
    }
  }
`;

const QuickStatsCard = styled(Card)`
  && {
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;
    height: 100%;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
      transform: translateY(-2px);
    }

    .ant-statistic-title {
      color: #8c8c8c;
      font-size: 14px;
      font-weight: 500;
    }

    .ant-statistic-content {
      color: #262626;
      font-weight: 700;
    }

    &.trending-up {
      border-left: 4px solid #52c41a;
    }

    &.trending-down {
      border-left: 4px solid #ff4d4f;
    }

    &.neutral {
      border-left: 4px solid #1890ff;
    }

    &.warning {
      border-left: 4px solid #fa8c16;
    }
  }
`;

const ActivityCard = styled(Card)`
  && {
    border-radius: 12px;
    height: 400px;

    .ant-card-body {
      height: calc(100% - 65px);
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: #d9d9d9;
        border-radius: 2px;
      }
    }
  }
`;

const QuickActionButton = styled(Button)`
  && {
    height: 80px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 2px dashed #d9d9d9;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1890ff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
    }

    .anticon {
      font-size: 24px;
    }

    span {
      font-size: 12px;
      font-weight: 500;
    }
  }
`;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      totalUsers: 0,
      totalPosts: 0,
      totalRevenue: 0,
      activeUsers: 0,
      newUsersToday: 0,
      pendingPosts: 0,
      todayRevenue: 0,
      conversionRate: 0,
    },
    recentUsers: [],
    recentPosts: [],
    recentPayments: [],
    systemAlerts: [],
    activities: [],
  });

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Mock data - replace with real API calls
      const mockData = {
        stats: {
          totalUsers: 1247,
          totalPosts: 892,
          totalRevenue: 45670000,
          activeUsers: 156,
          newUsersToday: 23,
          pendingPosts: 12,
          todayRevenue: 2340000,
          conversionRate: 87.5,
        },
        recentUsers: [
          {
            id: 1,
            name: "Nguyễn Văn A",
            email: "nguyenvana@gmail.com",
            avatar: null,
            createdAt: new Date(),
            role: "user",
            isVerified: true,
          },
          {
            id: 2,
            name: "Trần Thị B",
            email: "tranthib@gmail.com",
            avatar: null,
            createdAt: new Date(),
            role: "leader",
            isVerified: false,
          },
        ],
        recentPosts: [
          {
            id: 1,
            title: "Tuyển Frontend Developer",
            author: "Nguyễn Văn A",
            status: "pending",
            createdAt: new Date(),
            views: 234,
          },
          {
            id: 2,
            title: "Chia sẻ kinh nghiệm React",
            author: "Trần Thị B",
            status: "approved",
            createdAt: new Date(),
            views: 567,
          },
        ],
        recentPayments: [
          {
            id: 1,
            user: "Nguyễn Văn A",
            amount: 299000,
            status: "success",
            method: "vnpay",
            createdAt: new Date(),
          },
        ],
        systemAlerts: [
          {
            id: 1,
            type: "warning",
            message: "Có 12 bài viết đang chờ duyệt",
            time: new Date(),
          },
          {
            id: 2,
            type: "info",
            message: "Hệ thống backup đã hoàn thành",
            time: new Date(),
          },
        ],
        activities: [
          {
            id: 1,
            type: "user_register",
            message: "Nguyễn Văn A đã đăng ký tài khoản",
            time: new Date(),
            icon: <UserOutlined />,
            color: "blue",
          },
          {
            id: 2,
            type: "post_created",
            message: "Trần Thị B đã tạo bài viết mới",
            time: new Date(),
            icon: <FileTextOutlined />,
            color: "green",
          },
          {
            id: 3,
            type: "payment_success",
            message: "Thanh toán 299.000đ thành công",
            time: new Date(),
            icon: <DollarOutlined />,
            color: "gold",
          },
        ],
      };

      setDashboardData(mockData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Quick stats data
  const quickStats = [
    {
      title: "Tổng người dùng",
      value: dashboardData.stats.totalUsers,
      prefix: <UserOutlined style={{ color: "#1890ff" }} />,
      suffix: "người",
      trend: "up",
      trendValue: 12,
      className: "trending-up",
    },
    {
      title: "Hoạt động hôm nay",
      value: dashboardData.stats.activeUsers,
      prefix: <FireOutlined style={{ color: "#52c41a" }} />,
      suffix: "online",
      trend: "up",
      trendValue: 8,
      className: "trending-up",
    },
    {
      title: "Bài viết chờ duyệt",
      value: dashboardData.stats.pendingPosts,
      prefix: <ClockCircleOutlined style={{ color: "#fa8c16" }} />,
      suffix: "bài",
      trend: "warning",
      className: "warning",
    },
    {
      title: "Doanh thu hôm nay",
      value: dashboardData.stats.todayRevenue,
      formatter: (value) => formatCurrency(value),
      prefix: <DollarOutlined style={{ color: "#52c41a" }} />,
      trend: "up",
      trendValue: 23,
      className: "trending-up",
    },
    {
      title: "Tổng doanh thu",
      value: dashboardData.stats.totalRevenue,
      formatter: (value) => formatCurrency(value),
      prefix: <TrophyOutlined style={{ color: "#722ed1" }} />,
      className: "neutral",
    },
    {
      title: "Tỉ lệ chuyển đổi",
      value: dashboardData.stats.conversionRate,
      precision: 1,
      suffix: "%",
      prefix: <ThunderboltOutlined style={{ color: "#eb2f96" }} />,
      trend: "up",
      trendValue: 5.2,
      className: "trending-up",
    },
  ];

  // Recent users table columns
  const userColumns = [
    {
      title: "Người dùng",
      dataIndex: "name",
      render: (name, record) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div style={{ fontWeight: 600 }}>{name}</div>
            <div style={{ fontSize: 12, color: "#8c8c8c" }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role) => (
        <Tag
          color={
            role === "admin" ? "red" : role === "leader" ? "blue" : "default"
          }
        >
          {role === "admin" ? "Admin" : role === "leader" ? "Leader" : "User"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isVerified",
      render: (verified) => (
        <Tag color={verified ? "green" : "orange"}>
          {verified ? "Đã xác thực" : "Chưa xác thực"}
        </Tag>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Welcome Section */}
      <WelcomeCard>
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ color: "white", margin: 0 }}>
              🎉 Chào mừng trở lại, Admin!
            </Title>
            <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 16 }}>
              Hôm nay là{" "}
              {new Date().toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>

            <div className="welcome-stats" style={{ marginTop: 20 }}>
              <div className="stat-item">
                <UserOutlined />
                <Text style={{ color: "white" }}>
                  <strong>{dashboardData.stats.newUsersToday}</strong> người
                  dùng mới
                </Text>
              </div>
              <div className="stat-item">
                <DollarOutlined />
                <Text style={{ color: "white" }}>
                  <strong>
                    {formatCurrency(dashboardData.stats.todayRevenue)}
                  </strong>{" "}
                  doanh thu
                </Text>
              </div>
              <div className="stat-item">
                <FireOutlined />
                <Text style={{ color: "white" }}>
                  <strong>{dashboardData.stats.activeUsers}</strong> đang online
                </Text>
              </div>
            </div>
          </Col>
          <Col>
            <div style={{ textAlign: "center", color: "white" }}>
              <CrownOutlined
                style={{ fontSize: 48, marginBottom: 8, opacity: 0.8 }}
              />
              <br />
              <Text style={{ color: "rgba(255,255,255,0.7)" }}>
                Admin Panel v2.0
              </Text>
            </div>
          </Col>
        </Row>
      </WelcomeCard>

      {/* Quick Stats */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {quickStats.map((stat, index) => (
          <Col xs={12} sm={8} lg={4} key={index}>
            <QuickStatsCard className={stat.className}>
              <Statistic
                title={stat.title}
                value={stat.value}
                formatter={stat.formatter}
                prefix={stat.prefix}
                suffix={stat.suffix}
                precision={stat.precision}
              />
              {stat.trend && (
                <div style={{ marginTop: 8, fontSize: 12 }}>
                  {stat.trend === "up" && (
                    <Text type="success">
                      <RiseOutlined /> +{stat.trendValue}% so với hôm qua
                    </Text>
                  )}
                  {stat.trend === "down" && (
                    <Text type="danger">
                      <FallOutlined /> -{stat.trendValue}% so với hôm qua
                    </Text>
                  )}
                  {stat.trend === "warning" && (
                    <Text style={{ color: "#fa8c16" }}>
                      <WarningOutlined /> Cần xử lý
                    </Text>
                  )}
                </div>
              )}
            </QuickStatsCard>
          </Col>
        ))}
      </Row>

      {/* Quick Actions */}
      <Card
        title={
          <>
            <ThunderboltOutlined /> Thao tác nhanh
          </>
        }
        style={{ marginBottom: 24 }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6} lg={3}>
            <Link to="/admin/users">
              <QuickActionButton block>
                <UserOutlined />
                <span>Quản lý User</span>
              </QuickActionButton>
            </Link>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Link to="/admin/posts">
              <QuickActionButton block>
                <FileTextOutlined />
                <span>Duyệt bài viết</span>
              </QuickActionButton>
            </Link>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Link to="/admin/payments">
              <QuickActionButton block>
                <DollarOutlined />
                <span>Thanh toán</span>
              </QuickActionButton>
            </Link>
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Link to="/admin/analytics">
              <QuickActionButton block>
                <StarOutlined />
                <span>Thống kê</span>
              </QuickActionButton>
            </Link>
          </Col>
        </Row>
      </Card>

      {/* Main Content */}
      <Row gutter={[16, 16]}>
        {/* Recent Users */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <UserOutlined />
                Người dùng mới
                <Badge count={dashboardData.recentUsers.length} />
              </Space>
            }
            extra={<Link to="/admin/users">Xem tất cả</Link>}
            style={{ height: 400 }}
          >
            <Table
              columns={userColumns}
              dataSource={dashboardData.recentUsers}
              pagination={false}
              size="small"
              rowKey="id"
            />
          </Card>
        </Col>

        {/* System Alerts */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <BellOutlined />
                Thông báo hệ thống
                <Badge count={dashboardData.systemAlerts.length} />
              </Space>
            }
            style={{ height: 400 }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              {dashboardData.systemAlerts.map((alert) => (
                <Alert
                  key={alert.id}
                  message={alert.message}
                  type={alert.type}
                  showIcon
                  closable
                />
              ))}

              <Divider />

              <div style={{ textAlign: "center", color: "#8c8c8c" }}>
                <CheckCircleOutlined style={{ marginRight: 8 }} />
                Hệ thống đang hoạt động bình thường
              </div>
            </Space>
          </Card>
        </Col>

        {/* Recent Activity */}
        <Col xs={24} lg={12}>
          <ActivityCard
            title={
              <Space>
                <ClockCircleOutlined />
                Hoạt động gần đây
              </Space>
            }
          >
            <Timeline
              items={dashboardData.activities.map((activity) => ({
                dot: activity.icon,
                color: activity.color,
                children: (
                  <div>
                    <div>{activity.message}</div>
                    <div style={{ fontSize: 12, color: "#8c8c8c" }}>
                      {new Date(activity.time).toLocaleString("vi-VN")}
                    </div>
                  </div>
                ),
              }))}
            />
          </ActivityCard>
        </Col>

        {/* Performance Chart Placeholder */}
        <Col xs={24} lg={12}>
          <Card
            title={
              <Space>
                <RiseOutlined />
                Hiệu suất hệ thống
              </Space>
            }
            style={{ height: 400 }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Text strong>CPU Usage</Text>
                <Progress percent={45} strokeColor="#52c41a" />
              </div>
              <div>
                <Text strong>Memory Usage</Text>
                <Progress percent={67} strokeColor="#1890ff" />
              </div>
              <div>
                <Text strong>Disk Usage</Text>
                <Progress percent={23} strokeColor="#722ed1" />
              </div>
              <div>
                <Text strong>Network I/O</Text>
                <Progress percent={89} strokeColor="#fa8c16" />
              </div>

              <Divider />

              <div style={{ textAlign: "center" }}>
                <HeartOutlined style={{ color: "#ff4d4f", marginRight: 8 }} />
                <Text type="success">Hệ thống đang hoạt động tốt</Text>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}
