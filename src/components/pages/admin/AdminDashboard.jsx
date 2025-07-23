import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Space,
  Progress,
  Avatar,
  List,
  Badge,
  Button,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  DollarOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  CrownOutlined,
  LineChartOutlined,
  BarChartOutlined,
  PieChartOutlined,
} from "@ant-design/icons";
import styled from "styled-components";

const { Title, Text } = Typography;

// Styled Components
const DashboardContainer = styled.div`
  padding: 0;
  background: transparent;
`;

const StatsCard = styled(Card)`
  && {
    border-radius: 16px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    overflow: hidden;
    position: relative;

    &::before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: ${(props) =>
        props.accent || "linear-gradient(90deg, #e74c3c, #c0392b)"};
    }

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }

    .ant-statistic-title {
      color: #8c8c8c;
      font-weight: 500;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .ant-statistic-content {
      color: #262626;
      font-weight: 700;
    }
  }
`;

const QuickActionCard = styled(Card)`
  && {
    border-radius: 12px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    transition: all 0.3s ease;

    &:hover {
      border-color: #e74c3c;
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.15);
      transform: translateY(-2px);
    }

    .ant-card-body {
      padding: 16px;
      text-align: center;
    }
  }
`;

const WelcomeHeader = styled.div`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 32px;
  border-radius: 16px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "👑";
    position: absolute;
    top: 16px;
    right: 24px;
    font-size: 32px;
    opacity: 0.3;
  }

  h1 {
    color: white;
    margin: 0;
    font-size: 28px;
    font-weight: 700;
  }

  p {
    color: rgba(255, 255, 255, 0.9);
    margin: 8px 0 0 0;
    font-size: 16px;
  }
`;

const SimpleChart = styled.div`
  height: 200px;
  background: linear-gradient(45deg, #f8f9fa, #e9ecef);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(231, 76, 60, 0.1),
      transparent
    );
  }
`;

const MetricCard = styled.div`
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  text-align: center;
  border-left: 4px solid ${(props) => props.color || "#e74c3c"};
`;

export default function AdminDashboard() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalPosts: 3420,
    totalRecruitments: 180,
    totalRevenue: 45000,
    newUsersToday: 28,
    pendingPosts: 12,
    activeUsers: 845,
    conversionRate: 3.2,
  });

  // Recent activities data
  const recentActivities = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      action: "Đăng ký tài khoản Premium",
      time: "5 phút trước",
      type: "success",
    },
    {
      id: 2,
      user: "Trần Thị B",
      action: "Báo cáo bài viết không phù hợp",
      time: "15 phút trước",
      type: "warning",
    },
    {
      id: 3,
      user: "Lê Văn C",
      action: "Tạo tin tuyển dụng mới",
      time: "30 phút trước",
      type: "info",
    },
    {
      id: 4,
      user: "Phạm Thị D",
      action: "Yêu cầu xác minh tài khoản",
      time: "1 giờ trước",
      type: "processing",
    },
  ];

  // Quick actions data
  const quickActions = [
    {
      title: "Quản lý người dùng",
      icon: <UserOutlined style={{ fontSize: 24, color: "#3498db" }} />,
      path: "/admin/users",
      description: "Xem và quản lý tài khoản",
    },
    {
      title: "Kiểm duyệt bài viết",
      icon: <EyeOutlined style={{ fontSize: 24, color: "#e67e22" }} />,
      path: "/admin/moderation",
      description: "Duyệt nội dung chờ xử lý",
    },
    {
      title: "Báo cáo thống kê",
      icon: <TrophyOutlined style={{ fontSize: 24, color: "#27ae60" }} />,
      path: "/admin/reports",
      description: "Xem báo cáo chi tiết",
    },
    {
      title: "Cài đặt hệ thống",
      icon: <CrownOutlined style={{ fontSize: 24, color: "#8e44ad" }} />,
      path: "/admin/settings",
      description: "Cấu hình hệ thống",
    },
  ];

  return (
    <DashboardContainer>
      <WelcomeHeader>
        <h1>Chào mừng Admin! 👑</h1>
        <p>Tổng quan hệ thống và các chỉ số quan trọng</p>
      </WelcomeHeader>

      {/* Stats Cards */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard accent="linear-gradient(135deg, #3498db, #2980b9)">
            <Statistic
              title="Tổng người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              suffix={
                <Space>
                  <RiseOutlined style={{ color: "#52c41a" }} />
                  <Text style={{ color: "#52c41a", fontSize: 12 }}>
                    +{stats.newUsersToday}
                  </Text>
                </Space>
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard accent="linear-gradient(135deg, #27ae60, #229954)">
            <Statistic
              title="Bài viết"
              value={stats.totalPosts}
              prefix={<FileTextOutlined />}
              suffix={
                <Badge
                  count={stats.pendingPosts}
                  style={{ backgroundColor: "#fa8c16" }}
                />
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard accent="linear-gradient(135deg, #8e44ad, #7d3c98)">
            <Statistic
              title="Tin tuyển dụng"
              value={stats.totalRecruitments}
              prefix={<TeamOutlined />}
            />
          </StatsCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <StatsCard accent="linear-gradient(135deg, #e67e22, #d68910)">
            <Statistic
              title="Doanh thu"
              value={stats.totalRevenue}
              prefix={<DollarOutlined />}
              suffix="$"
              precision={0}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Simple Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Tăng trưởng người dùng" style={{ borderRadius: 16 }}>
            <SimpleChart>
              <LineChartOutlined
                style={{ fontSize: 48, color: "#e74c3c", marginBottom: 16 }}
              />
              <Text strong style={{ fontSize: 16 }}>
                +{stats.newUsersToday} người dùng hôm nay
              </Text>
              <Text type="secondary">Tăng 12% so với tuần trước</Text>
            </SimpleChart>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu theo tháng" style={{ borderRadius: 16 }}>
            <SimpleChart>
              <BarChartOutlined
                style={{ fontSize: 48, color: "#27ae60", marginBottom: 16 }}
              />
              <Text strong style={{ fontSize: 16 }}>
                ${stats.totalRevenue.toLocaleString()}
              </Text>
              <Text type="secondary">Tăng 8% so với tháng trước</Text>
            </SimpleChart>
          </Card>
        </Col>
      </Row>

      {/* Key Metrics Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} sm={6}>
          <MetricCard color="#3498db">
            <Text strong>Người dùng hoạt động</Text>
            <Title level={3} style={{ margin: "8px 0", color: "#3498db" }}>
              {stats.activeUsers}
            </Title>
            <Text type="secondary">68% tổng người dùng</Text>
          </MetricCard>
        </Col>
        <Col xs={24} sm={6}>
          <MetricCard color="#27ae60">
            <Text strong>Tỉ lệ chuyển đổi</Text>
            <Title level={3} style={{ margin: "8px 0", color: "#27ae60" }}>
              {stats.conversionRate}%
            </Title>
            <Text type="secondary">+0.8% tuần này</Text>
          </MetricCard>
        </Col>
        <Col xs={24} sm={6}>
          <MetricCard color="#e67e22">
            <Text strong>Bài viết chờ duyệt</Text>
            <Title level={3} style={{ margin: "8px 0", color: "#e67e22" }}>
              {stats.pendingPosts}
            </Title>
            <Text type="secondary">Cần xử lý</Text>
          </MetricCard>
        </Col>
        <Col xs={24} sm={6}>
          <MetricCard color="#8e44ad">
            <Text strong>Doanh thu tháng</Text>
            <Title level={3} style={{ margin: "8px 0", color: "#8e44ad" }}>
              $45K
            </Title>
            <Text type="secondary">+12% so với tháng trước</Text>
          </MetricCard>
        </Col>
      </Row>

      {/* System Health Status */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Trạng thái hệ thống" style={{ borderRadius: 16 }}>
            <Row gutter={[24, 24]}>
              <Col xs={24} sm={8}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Text strong>CPU Usage</Text>
                  <Progress
                    percent={45}
                    status="active"
                    strokeColor={{
                      "0%": "#87d068",
                      "100%": "#108ee9",
                    }}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Text strong>Memory Usage</Text>
                  <Progress
                    percent={62}
                    status="active"
                    strokeColor={{
                      "0%": "#ffc53d",
                      "100%": "#fa8c16",
                    }}
                  />
                </Space>
              </Col>
              <Col xs={24} sm={8}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Text strong>Disk Usage</Text>
                  <Progress
                    percent={78}
                    status="active"
                    strokeColor={{
                      "0%": "#ff7875",
                      "100%": "#ff4d4f",
                    }}
                  />
                </Space>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
              <Col xs={24} sm={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", background: "#f6ffed" }}
                >
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: 20 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>Database</Text>
                    <br />
                    <Text type="success">Online</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", background: "#f6ffed" }}
                >
                  <CheckCircleOutlined
                    style={{ color: "#52c41a", fontSize: 20 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>API Server</Text>
                    <br />
                    <Text type="success">Running</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", background: "#fff7e6" }}
                >
                  <ClockCircleOutlined
                    style={{ color: "#fa8c16", fontSize: 20 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>Cache</Text>
                    <br />
                    <Text style={{ color: "#fa8c16" }}>Syncing</Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={6}>
                <Card
                  size="small"
                  style={{ textAlign: "center", background: "#fff2f0" }}
                >
                  <ExclamationCircleOutlined
                    style={{ color: "#ff4d4f", fontSize: 20 }}
                  />
                  <div style={{ marginTop: 8 }}>
                    <Text strong>Email Service</Text>
                    <br />
                    <Text type="danger">Warning</Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Admin Tasks Table */}
    </DashboardContainer>
  );
}
