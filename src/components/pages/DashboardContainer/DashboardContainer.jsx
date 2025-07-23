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
} from "@ant-design/icons";
import { Line, Column, Pie } from "@ant-design/plots";
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

  // Mock data for charts
  const userGrowthData = [
    { month: "Jan", users: 1000, active: 800 },
    { month: "Feb", users: 1080, active: 850 },
    { month: "Mar", users: 1150, active: 900 },
    { month: "Apr", users: 1200, active: 920 },
    { month: "May", users: 1250, active: 950 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 32000 },
    { month: "Feb", revenue: 35000 },
    { month: "Mar", revenue: 38000 },
    { month: "Apr", revenue: 42000 },
    { month: "May", revenue: 45000 },
  ];

  const userTypeData = [
    { type: "Free Users", value: 950, color: "#3498db" },
    { type: "Premium Users", value: 250, color: "#e74c3c" },
    { type: "Enterprise", value: 50, color: "#f39c12" },
  ];

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

  const lineConfig = {
    data: userGrowthData,
    xField: "month",
    yField: "users",
    seriesField: "type",
    smooth: true,
    color: ["#e74c3c", "#3498db"],
  };

  const columnConfig = {
    data: revenueData,
    xField: "month",
    yField: "revenue",
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    gradient: {
      field: "revenue",
      startColor: "#e74c3c",
      endColor: "#c0392b",
    },
  };

  const pieConfig = {
    data: userTypeData,
    angleField: "value",
    colorField: "type",
    radius: 0.8,
    innerRadius: 0.4,
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: "pre-wrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        },
        content: "Tổng\n1,250",
      },
    },
  };

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

      {/* Charts Section */}
      <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Tăng trưởng người dùng" style={{ borderRadius: 16 }}>
            <Line {...lineConfig} height={300} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Doanh thu theo tháng" style={{ borderRadius: 16 }}>
            <Column {...columnConfig} height={300} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* User Distribution */}
        <Col xs={24} lg={8}>
          <Card title="Phân bố người dùng" style={{ borderRadius: 16 }}>
            <Pie {...pieConfig} height={300} />
          </Card>
        </Col>

        {/* Recent Activities */}
        <Col xs={24} lg={8}>
          <Card title="Hoạt động gần đây" style={{ borderRadius: 16 }}>
            <List
              dataSource={recentActivities}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={<Text strong>{item.user}</Text>}
                    description={
                      <Space direction="vertical" size={4}>
                        <Text>{item.action}</Text>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          {item.time}
                        </Text>
                      </Space>
                    }
                  />
                  <Tag
                    color={
                      item.type === "success"
                        ? "green"
                        : item.type === "warning"
                        ? "orange"
                        : item.type === "info"
                        ? "blue"
                        : "purple"
                    }
                  >
                    {item.type === "success"
                      ? "Thành công"
                      : item.type === "warning"
                      ? "Cảnh báo"
                      : item.type === "info"
                      ? "Thông tin"
                      : "Đang xử lý"}
                  </Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Quick Actions */}
        <Col xs={24} lg={8}>
          <Card title="Thao tác nhanh" style={{ borderRadius: 16 }}>
            <Row gutter={[12, 12]}>
              {quickActions.map((action, index) => (
                <Col span={12} key={index}>
                  <QuickActionCard
                    hoverable
                    onClick={() => (window.location.href = action.path)}
                    style={{ cursor: "pointer" }}
                  >
                    <Space direction="vertical" align="center" size={8}>
                      {action.icon}
                      <Text
                        strong
                        style={{ fontSize: 12, textAlign: "center" }}
                      >
                        {action.title}
                      </Text>
                      <Text
                        type="secondary"
                        style={{ fontSize: 10, textAlign: "center" }}
                      >
                        {action.description}
                      </Text>
                    </Space>
                  </QuickActionCard>
                </Col>
              ))}
            </Row>
          </Card>
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
      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Nhiệm vụ cần xử lý" style={{ borderRadius: 16 }}>
            <Table
              dataSource={[
                {
                  key: "1",
                  task: "Duyệt 12 bài viết chờ kiểm duyệt",
                  priority: "high",
                  assignee: "System",
                  status: "pending",
                  dueDate: "2025-07-23",
                },
                {
                  key: "2",
                  task: "Xem xét 5 báo cáo từ người dùng",
                  priority: "medium",
                  assignee: "Admin",
                  status: "in_progress",
                  dueDate: "2025-07-24",
                },
                {
                  key: "3",
                  task: "Cập nhật chính sách bảo mật",
                  priority: "high",
                  assignee: "Admin",
                  status: "pending",
                  dueDate: "2025-07-25",
                },
                {
                  key: "4",
                  task: "Phân tích báo cáo doanh thu tháng",
                  priority: "low",
                  assignee: "System",
                  status: "completed",
                  dueDate: "2025-07-22",
                },
              ]}
              columns={[
                {
                  title: "Nhiệm vụ",
                  dataIndex: "task",
                  key: "task",
                },
                {
                  title: "Độ ưu tiên",
                  dataIndex: "priority",
                  key: "priority",
                  render: (priority) => (
                    <Tag
                      color={
                        priority === "high"
                          ? "red"
                          : priority === "medium"
                          ? "orange"
                          : "green"
                      }
                    >
                      {priority === "high"
                        ? "Cao"
                        : priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </Tag>
                  ),
                },
                {
                  title: "Trạng thái",
                  dataIndex: "status",
                  key: "status",
                  render: (status) => (
                    <Tag
                      color={
                        status === "completed"
                          ? "green"
                          : status === "in_progress"
                          ? "blue"
                          : "default"
                      }
                    >
                      {status === "completed"
                        ? "Hoàn thành"
                        : status === "in_progress"
                        ? "Đang xử lý"
                        : "Chờ xử lý"}
                    </Tag>
                  ),
                },
                {
                  title: "Hạn chót",
                  dataIndex: "dueDate",
                  key: "dueDate",
                },
                {
                  title: "Thao tác",
                  key: "action",
                  render: (_, record) => (
                    <Button type="link" size="small">
                      Xem chi tiết
                    </Button>
                  ),
                },
              ]}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </DashboardContainer>
  );
}
