import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Avatar,
  Tag,
  message,
  Tooltip,
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
  DeleteOutlined,
  ReloadOutlined,
  CrownOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "@/services/api/axios";

const { Search } = Input;
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  // Ban modals
  const [banModalVisible, setBanModalVisible] = useState(false);
  const [permanentBanModalVisible, setPermanentBanModalVisible] =
    useState(false);
  const [banReason, setBanReason] = useState("");
  const [userToBan, setUserToBan] = useState(null);
  const [banLoading, setBanLoading] = useState(false);

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    bannedUsers: 0,
    adminUsers: 0,
  });

  const navigate = useNavigate();

  // Calculate statistics
  const calculateStats = (userData) => {
    const totalUsers = userData.length;
    const activeUsers = userData.filter((user) => !user.isBanned).length;
    const bannedUsers = userData.filter((user) => user.isBanned).length;
    const adminUsers = userData.filter((user) => user.role === "admin").length;

    setStats({ totalUsers, activeUsers, bannedUsers, adminUsers });
  };

  // Fetch users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users/all");
      let usersData = [];

      if (response.data?.data?.users) {
        usersData = response.data.data.users;
      } else if (Array.isArray(response.data?.data)) {
        usersData = response.data.data;
      } else if (Array.isArray(response.data)) {
        usersData = response.data;
      }

      // Client-side search filter
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        usersData = usersData.filter(
          (user) =>
            user.name?.toLowerCase().includes(searchLower) ||
            user.username?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower)
        );
      }

      setUsers(usersData);
      calculateStats(usersData);
    } catch (error) {
      message.error("Không thể tải danh sách người dùng");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchText]);

  // Handle ban functions
  const handleSoftBan = (user) => {
    setUserToBan(user);
    setBanReason("");
    setBanModalVisible(true);
  };

  const handlePermanentBan = (user) => {
    setUserToBan(user);
    setBanReason("");
    setPermanentBanModalVisible(true);
  };

  const handleUnban = async (user) => {
    try {
      setBanLoading(true);
      await api.post(`/admin/users/${user._id}/unban`);
      message.success("Đã mở khóa tài khoản thành công");
      fetchUsers();
    } catch (error) {
      message.error("Có lỗi xảy ra khi mở khóa tài khoản");
    } finally {
      setBanLoading(false);
    }
  };

  const executeSoftBan = async () => {
    try {
      setBanLoading(true);
      await api.post(`/admin/users/${userToBan._id}/soft-ban`, {
        reason: banReason.trim() || null,
      });
      message.success("Đã khóa tài khoản thành công");
      setBanModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Có lỗi xảy ra khi khóa tài khoản");
    } finally {
      setBanLoading(false);
      setBanReason("");
      setUserToBan(null);
    }
  };

  const executePermanentBan = async () => {
    try {
      setBanLoading(true);
      await api.post(`/admin/users/${userToBan._id}/ban`, {
        reason: banReason.trim() || "Vi phạm chính sách hệ thống",
      });
      message.success("Đã xóa tài khoản vĩnh viễn");
      setPermanentBanModalVisible(false);
      fetchUsers();
    } catch (error) {
      message.error("Có lỗi xảy ra khi xóa tài khoản");
    } finally {
      setBanLoading(false);
      setBanReason("");
      setUserToBan(null);
    }
  };

  // Helper functions
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

  // Table columns
  const columns = [
    {
      title: "Người dùng",
      key: "user",
      width: 200,
      render: (_, record) => (
        <Space>
          <Avatar size={32} src={record.avatar?.url} icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 600 }}>{record.name}</div>
            <div style={{ fontSize: 11, color: "#999" }}>
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
      width: 200,
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 100,
      render: (role) => (
        <Tag color={getRoleColor(role)} icon={getRoleIcon(role)}>
          {role === "admin" ? "Admin" : role === "leader" ? "Leader" : "User"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      width: 120,
      render: (_, record) => (
        <Space direction="vertical" size={2}>
          <Tag color={record.isVerified ? "green" : "orange"}>
            {record.isVerified ? "Đã xác thực" : "Chưa xác thực"}
          </Tag>
          {record.isBanned && (
            <Tag color="red" icon={<StopOutlined />}>
              Đã khóa
            </Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small" wrap>
          <Tooltip title="Chi tiết">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                setSelectedUser(record);
                setProfileModalVisible(true);
              }}
            />
          </Tooltip>

          <Tooltip title="Profile">
            <Button
              icon={<UserOutlined />}
              size="small"
              onClick={() => navigate(`/profile/id/${record._id}`)}
            />
          </Tooltip>

          {/* Ban/Unban buttons */}
          {record.isBanned ? (
            <Tooltip title="Mở khóa">
              <Button
                type="default"
                icon={<CheckCircleOutlined />}
                size="small"
                loading={banLoading}
                onClick={() => handleUnban(record)}
              />
            </Tooltip>
          ) : (
            <>
              <Tooltip title="Khóa tạm thời">
                <Button
                  danger
                  icon={<StopOutlined />}
                  size="small"
                  onClick={() => handleSoftBan(record)}
                  disabled={record.role === "admin"}
                />
              </Tooltip>

              {record.role !== "admin" && (
                <Tooltip title="XÓA VĨNH VIỄN">
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    onClick={() => handlePermanentBan(record)}
                  />
                </Tooltip>
              )}
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0 }}>
          <UserOutlined style={{ marginRight: 12, color: "#1890ff" }} />
          Quản lý người dùng
        </Title>
        <Text type="secondary">Quản lý tài khoản và thông tin người dùng</Text>
      </div>

      {/* Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số"
              value={stats.totalUsers}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Hoạt động"
              value={stats.activeUsers}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đã khóa"
              value={stats.bannedUsers}
              prefix={<StopOutlined style={{ color: "#ff4d4f" }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Admin"
              value={stats.adminUsers}
              prefix={<CrownOutlined style={{ color: "#fa8c16" }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* Search & Controls */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col flex="auto">
            <Search
              placeholder="Tìm kiếm theo tên, username, email..."
              allowClear
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col>
            <Button icon={<ReloadOutlined />} onClick={fetchUsers}>
              Làm mới
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Users Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showTotal: (total) => `Tổng ${total} người dùng`,
          }}
        />
      </Card>

      {/* User Details Modal */}
      <Modal
        title={`Chi tiết - ${selectedUser?.name}`}
        open={profileModalVisible}
        onCancel={() => setProfileModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setProfileModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        {selectedUser && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Tên">
              {selectedUser.name}
            </Descriptions.Item>
            <Descriptions.Item label="Username">
              @{selectedUser.username}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
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
            <Descriptions.Item label="Trạng thái">
              <Space direction="vertical">
                <Tag color={selectedUser.isVerified ? "green" : "orange"}>
                  {selectedUser.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                </Tag>
                {selectedUser.isBanned && <Tag color="red">Đã khóa</Tag>}
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Level">
              Level {selectedUser.level || 1}
            </Descriptions.Item>
            <Descriptions.Item label="Điểm">
              {selectedUser.points || 0} points
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Soft Ban Modal */}
      <Modal
        title="⚠️ Khóa tài khoản"
        open={banModalVisible}
        onCancel={() => {
          setBanModalVisible(false);
          setBanReason("");
          setUserToBan(null);
        }}
        onOk={executeSoftBan}
        confirmLoading={banLoading}
        okText="Khóa tài khoản"
        okType="danger"
      >
        {userToBan && (
          <div>
            <p>
              Khóa tài khoản <strong>{userToBan.name}</strong> (
              {userToBan.email})?
            </p>
            <TextArea
              placeholder="Lý do khóa tài khoản..."
              rows={3}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>
        )}
      </Modal>

      {/* Permanent Ban Modal */}
      <Modal
        title="🚨 XÓA VĨNH VIỄN"
        open={permanentBanModalVisible}
        onCancel={() => {
          setPermanentBanModalVisible(false);
          setBanReason("");
          setUserToBan(null);
        }}
        onOk={executePermanentBan}
        confirmLoading={banLoading}
        okText="XÓA VĨNH VIỄN"
        okType="danger"
      >
        {userToBan && (
          <div>
            <p style={{ color: "#ff4d4f", fontWeight: "bold" }}>
              ⚠️ HÀNH ĐỘNG NÀY KHÔNG THỂ HOÀN TÁC!
            </p>
            <p>
              Xóa vĩnh viễn tài khoản <strong>{userToBan.name}</strong> (
              {userToBan.email})?
            </p>
            <p style={{ color: "#ff4d4f", fontSize: "13px" }}>
              Tất cả dữ liệu sẽ bị xóa vĩnh viễn và gửi email thông báo.
            </p>
            <TextArea
              placeholder="Lý do xóa tài khoản..."
              rows={3}
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
