import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Avatar,
  Tag,
  Popconfirm,
  message,
  Tooltip,
  Badge,
  Row,
  Col,
  Statistic,
  Typography,
  Modal,
  Descriptions,
} from "antd";
import {
  UserOutlined,
  SearchOutlined,
  EyeOutlined,
  StopOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  FilterOutlined,
  ReloadOutlined,
  UserAddOutlined,
  TrophyOutlined,
  StarOutlined,
  TeamOutlined,
  MailOutlined,
  CalendarOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/axios";
import styled from "styled-components";

const { Search } = Input;
const { Title, Text } = Typography;

// Styled Components for better responsive
const PageContainer = styled.div`
  padding: 0;
  background: transparent;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
`;

const StatsCard = styled(Card)`
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
  }
`;

const FilterSection = styled(Card)`
  && {
    border-radius: 12px;
    margin-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

    .ant-card-body {
      padding: 20px;
    }
  }
`;

const ActionButton = styled(Button)`
  && {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }
  }
`;

// ✅ Custom styled select thay thế Select của Ant Design
const CustomSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
  }

  &:hover {
    border-color: #40a9ff;
  }
`;

// ✅ Responsive container
const ResponsiveContainer = styled.div`
  width: 100%;
  max-width: 100vw;
  overflow-x: auto;

  .ant-table-wrapper {
    overflow-x: auto;
  }

  .ant-table {
    min-width: 1000px; /* Minimum width để table không bị vỡ layout */
  }
`;

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    adminUsers: 0,
  });

  const navigate = useNavigate();

  // Calculate statistics
  const calculateStats = (userData) => {
    if (!Array.isArray(userData)) {
      setStats({
        totalUsers: 0,
        activeUsers: 0,
        bannedUsers: 0,
        adminUsers: 0,
      });
      return;
    }

    const totalUsers = userData.length;
    const activeUsers = userData.filter((user) => !user.isBanned).length;
    const bannedUsers = userData.filter((user) => user.isBanned).length;
    const adminUsers = userData.filter((user) => user.role === "admin").length;

    setStats({
      totalUsers,
      activeUsers,
      bannedUsers,
      adminUsers,
    });
  };

  // Fetch users data
  const fetchUsers = async (
    page = 1,
    size = 10,
    search = "",
    role = "all",
    status = "all"
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: size.toString(),
        ...(search && { search }),
        ...(role !== "all" && { role }),
        ...(status !== "all" && { status }),
      });

      const response = await api.get(`/users/all?${params}`);

      let usersData = [];
      let totalCount = 0;

      if (response.data && response.data.data) {
        const result = response.data.data;

        if (result.users && Array.isArray(result.users)) {
          usersData = result.users;
          totalCount = result.pagination?.total || usersData.length;
        } else if (Array.isArray(result)) {
          usersData = result;
          totalCount = usersData.length;
        } else {
          console.warn("Unexpected API response structure:", result);
          usersData = [];
          totalCount = 0;
        }
      }

      setUsers(usersData);
      setTotal(totalCount);
      calculateStats(usersData);
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Không thể tải danh sách người dùng");
      setUsers([]);
      setTotal(0);
      calculateStats([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchUsers(currentPage, pageSize, searchText, selectedRole, selectedStatus);
  }, [currentPage, pageSize, selectedRole, selectedStatus]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchUsers(1, pageSize, value, selectedRole, selectedStatus);
  };

  // ✅ Handle filters với native select
  const handleRoleFilter = (e) => {
    const value = e.target.value;
    setSelectedRole(value);
    setCurrentPage(1);
    fetchUsers(1, pageSize, searchText, value, selectedStatus);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setSelectedStatus(value);
    setCurrentPage(1);
    fetchUsers(1, pageSize, searchText, selectedRole, value);
  };

  // View user profile
  const handleViewProfile = (user) => {
    navigate(`/profile/id/${user._id}`);
  };

  // Show user details modal
  const showUserDetails = (user) => {
    setSelectedUser(user);
    setProfileModalVisible(true);
  };

  // Ban/Unban user
  const handleBanUser = async (userId, currentStatus) => {
    try {
      const action = currentStatus ? "unban" : "ban";
      await api.post(`/admin/users/${userId}/${action}`);

      message.success(
        `${action === "ban" ? "Khóa" : "Mở khóa"} tài khoản thành công`
      );
      fetchUsers(
        currentPage,
        pageSize,
        searchText,
        selectedRole,
        selectedStatus
      );
    } catch (error) {
      console.error("Error banning user:", error);
      message.error("Có lỗi xảy ra khi thực hiện thao tác");
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "red";
      case "leader":
        return "blue";
      default:
        return "default";
    }
  };

  // Get role icon
  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <CrownOutlined />;
      case "leader":
        return <TeamOutlined />;
      default:
        return <UserOutlined />;
    }
  };

  // ✅ Responsive table columns
  const columns = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      width: 200,
      fixed: "left",
      render: (_, record) => (
        <Space>
          <Avatar size={32} src={record.avatar?.url} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>{record.name}</div>
            <div style={{ fontSize: 11, color: "#8c8c8c" }}>
              @{record.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      ellipsis: true,
      responsive: ["md"],
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role) => (
        <Tag
          color={getRoleColor(role)}
          icon={getRoleIcon(role)}
          style={{ fontSize: 11 }}
        >
          {role === "admin" ? "Admin" : role === "leader" ? "Leader" : "User"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isVerified",
      key: "status",
      width: 120,
      responsive: ["lg"],
      render: (isVerified, record) => (
        <Space direction="vertical" size={2}>
          <Tag color={isVerified ? "green" : "orange"} style={{ fontSize: 10 }}>
            {isVerified ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
          {record.isBanned && (
            <Tag color="red" icon={<StopOutlined />} style={{ fontSize: 10 }}>
              Đã khóa
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Level",
      key: "level",
      width: 80,
      responsive: ["lg"],
      render: (_, record) => (
        <Space direction="vertical" size={1}>
          <Text strong style={{ fontSize: 12 }}>
            Lv.{record.level}
          </Text>
          <Text type="secondary" style={{ fontSize: 10 }}>
            {record.points}đ
          </Text>
        </Space>
      ),
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 100,
      responsive: ["xl"],
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <ActionButton
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showUserDetails(record)}
            />
          </Tooltip>

          <Tooltip title="Profile">
            <ActionButton
              type="default"
              icon={<UserOutlined />}
              size="small"
              onClick={() => handleViewProfile(record)}
            />
          </Tooltip>

          <Popconfirm
            title={record.isBanned ? "Mở khóa?" : "Khóa tài khoản?"}
            onConfirm={() => handleBanUser(record._id, record.isBanned)}
            okText="OK"
            cancelText="Hủy"
          >
            <Tooltip title={record.isBanned ? "Mở khóa" : "Khóa"}>
              <ActionButton
                type={record.isBanned ? "default" : "primary"}
                danger={!record.isBanned}
                icon={<StopOutlined />}
                size="small"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          <UserOutlined style={{ marginRight: 12, color: "#1890ff" }} />
          Quản lý người dùng
        </Title>
        <Text type="secondary">Quản lý tài khoản và thông tin người dùng</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Tổng số"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
            />
          </StatsCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Hoạt động"
              value={stats.activeUsers}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </StatsCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Đã khóa"
              value={stats.bannedUsers}
              prefix={<StopOutlined style={{ color: "#ff4d4f" }} />}
            />
          </StatsCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Admin"
              value={stats.adminUsers}
              prefix={<CrownOutlined style={{ color: "#fa8c16" }} />}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* ✅ Filters với responsive layout */}
      <FilterSection>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={10}>
            <Search
              placeholder="Tìm kiếm theo tên, username, email..."
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => e.target.value === "" && handleSearch("")}
            />
          </Col>
          <Col xs={12} lg={4}>
            <CustomSelect value={selectedRole} onChange={handleRoleFilter}>
              <option value="all">Tất cả vai trò</option>
              <option value="user">User</option>
              <option value="leader">Leader</option>
              <option value="admin">Admin</option>
            </CustomSelect>
          </Col>
          <Col xs={12} lg={4}>
            <CustomSelect value={selectedStatus} onChange={handleStatusFilter}>
              <option value="all">Tất cả trạng thái</option>
              <option value="verified">Đã xác thực</option>
              <option value="unverified">Chưa xác thực</option>
              <option value="banned">Đã khóa</option>
            </CustomSelect>
          </Col>
          <Col xs={24} lg={6}>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() =>
                  fetchUsers(
                    currentPage,
                    pageSize,
                    searchText,
                    selectedRole,
                    selectedStatus
                  )
                }
              >
                Làm mới
              </Button>
              <Button type="primary" icon={<UserAddOutlined />}>
                Thêm user
              </Button>
            </Space>
          </Col>
        </Row>
      </FilterSection>

      {/* ✅ Responsive Users Table */}
      <ResponsiveContainer>
        <Card style={{ borderRadius: 12 }}>
          <Table
            columns={columns}
            dataSource={users}
            rowKey="_id"
            loading={loading}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total}`,
              onChange: (page, size) => {
                setCurrentPage(page);
                setPageSize(size);
              },
            }}
            scroll={{ x: 1000, y: 600 }}
            size="middle"
          />
        </Card>
      </ResponsiveContainer>

      {/* User Details Modal */}
      <Modal
        title={
          <Space>
            <Avatar src={selectedUser?.avatar?.url} icon={<UserOutlined />} />
            <span>Chi tiết - {selectedUser?.name}</span>
          </Space>
        }
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setProfileModalVisible(false)}>
            Đóng
          </Button>,
          <Button
            key="view"
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => {
              handleViewProfile(selectedUser);
              setProfileModalVisible(false);
            }}
          >
            Xem Profile
          </Button>,
        ]}
      >
        {selectedUser && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Tên" span={1}>
              {selectedUser.name}
            </Descriptions.Item>
            <Descriptions.Item label="Username" span={1}>
              @{selectedUser.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò" span={1}>
              <Tag
                color={getRoleColor(selectedUser.role)}
                icon={getRoleIcon(selectedUser.role)}
              >
                {selectedUser.role === "admin"
                  ? "Admin"
                  : selectedUser.role === "leader"
                  ? "Leader"
                  : "User"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={1}>
              <Space direction="vertical">
                <Tag color={selectedUser.isVerified ? "green" : "orange"}>
                  {selectedUser.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                </Tag>
                {selectedUser.isBanned && <Tag color="red">Đã khóa</Tag>}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Level" span={1}>
              Level {selectedUser.level}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm" span={1}>
              {selectedUser.points} points
            </Descriptions.Item>
            <Descriptions.Item label="Bio" span={2}>
              {selectedUser.bio || "Chưa có thông tin"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tham gia" span={1}>
              {new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Cập nhật cuối" span={1}>
              {new Date(selectedUser.updatedAt).toLocaleDateString("vi-VN")}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
}
