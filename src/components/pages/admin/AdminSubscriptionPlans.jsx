import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
  Popconfirm,
  Row,
  Col,
  Statistic,
  Typography,
  Tooltip,
  Badge,
  Divider,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  StarFilled,
  CopyOutlined,
  SearchOutlined,
  FilterOutlined,
  BarChartOutlined,
  DollarOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import api from "@/services/api/axios";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Styled Components
const PageContainer = styled.div`
  padding: 24px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  min-height: calc(100vh - 48px);
`;

const StatsCard = styled(Card)`
  && {
    background: linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.05)
    );
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 12px;

    .ant-statistic-title {
      color: rgba(255, 255, 255, 0.8);
    }

    .ant-statistic-content {
      color: white;
    }
  }
`;

const MainCard = styled(Card)`
  && {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: none;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  }
`;

// ✅ Simple Custom Select Component
const SimpleSelect = styled.select`
  width: 100%;
  height: 40px;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  color: #262626;
  transition: all 0.3s ease;

  &:focus {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    outline: none;
  }

  &:hover {
    border-color: #40a9ff;
  }

  option {
    padding: 8px;
    background: white;
    color: #262626;
  }
`;

// ✅ Multiple Select Component (sử dụng checkboxes)
const MultipleSelect = ({ value = [], onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          border: "1px solid #d9d9d9",
          borderRadius: "6px",
          padding: "8px 12px",
          minHeight: "40px",
          background: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span style={{ color: value.length ? "#262626" : "#bfbfbf" }}>
          {value.length ? `Đã chọn ${value.length} mục` : placeholder}
        </span>
        <span style={{ color: "#8c8c8c" }}>▼</span>
      </div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            background: "white",
            border: "1px solid #d9d9d9",
            borderRadius: "6px",
            zIndex: 1000,
            maxHeight: "200px",
            overflowY: "auto",
            marginTop: "2px",
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              style={{
                padding: "8px 12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                ":hover": { background: "#f5f5f5" },
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleToggle(option.value);
              }}
              onMouseEnter={(e) => (e.target.style.background = "#f5f5f5")}
              onMouseLeave={(e) => (e.target.style.background = "white")}
            >
              <Checkbox checked={value.includes(option.value)} />
              <span>{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminSubscriptionPlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    isActive: "",
    tier: "",
  });

  // Form states for vanilla inputs
  const [formData, setFormData] = useState({
    planName: "",
    tier: "",
    description: "",
    price: "",
    duration: "",
    durationType: "",
    features: "",
    permissions: [],
    maxProjects: "",
    maxMembers: "",
    isActive: true,
    isPopular: false,
  });

  const [form] = Form.useForm();

  // Reset form data
  const resetFormData = () => {
    setFormData({
      planName: "",
      tier: "",
      description: "",
      price: "",
      duration: "",
      durationType: "",
      features: "",
      permissions: [],
      maxProjects: "",
      maxMembers: "",
      isActive: true,
      isPopular: false,
    });
  };

  // Fetch plans
  const fetchPlans = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.isActive) params.append("isActive", filters.isActive);
      if (filters.tier) params.append("tier", filters.tier);

      const response = await api.get(`/admin/subscription-plans?${params}`);
      setPlans(response.data.data.plans || []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách gói dịch vụ");
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const response = await api.get("/admin/subscription-plans/statistics");
      setStatistics(response.data.data);
    } catch (error) {
      console.error("Lỗi khi tải thống kê:", error);
    }
  };

  useEffect(() => {
    fetchPlans();
    fetchStatistics();
  }, [filters]);

  // Handle create/edit plan
  const handleSubmit = async () => {
    try {
      // Validation
      if (
        !formData.planName ||
        !formData.tier ||
        !formData.description ||
        !formData.price ||
        !formData.duration ||
        !formData.durationType
      ) {
        message.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        return;
      }

      setLoading(true);

      const submitData = {
        ...formData,
        price: Number(formData.price),
        duration: Number(formData.duration),
        maxProjects: formData.maxProjects ? Number(formData.maxProjects) : null,
        maxMembers: formData.maxMembers ? Number(formData.maxMembers) : null,
        features: formData.features.split("\n").filter((f) => f.trim()),
      };

      if (editingPlan) {
        await api.put(
          `/admin/subscription-plans/${editingPlan._id}`,
          submitData
        );
        message.success("Cập nhật gói thành công!");
      } else {
        await api.post("/admin/subscription-plans", submitData);
        message.success("Tạo gói mới thành công!");
      }

      setModalVisible(false);
      setEditingPlan(null);
      resetFormData();
      fetchPlans();
      fetchStatistics();
    } catch (error) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      planName: plan.planName || "",
      tier: plan.tier || "",
      description: plan.description || "",
      price: plan.price || "",
      duration: plan.duration || "",
      durationType: plan.durationType || "",
      features: plan.features?.join("\n") || "",
      permissions: plan.permissions || [],
      maxProjects: plan.maxProjects || "",
      maxMembers: plan.maxMembers || "",
      isActive: plan.isActive !== false,
      isPopular: plan.isPopular || false,
    });
    setModalVisible(true);
  };

  // Handle delete
  const handleDelete = async (planId) => {
    try {
      await api.delete(`/admin/subscription-plans/${planId}`);
      message.success("Xóa gói thành công!");
      fetchPlans();
      fetchStatistics();
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi xóa gói");
    }
  };

  // Toggle active
  const toggleActive = async (planId) => {
    try {
      await api.patch(`/admin/subscription-plans/${planId}/toggle-active`);
      message.success("Cập nhật trạng thái thành công!");
      fetchPlans();
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái");
    }
  };

  // Toggle popular
  const togglePopular = async (planId) => {
    try {
      await api.patch(`/admin/subscription-plans/${planId}/toggle-popular`);
      message.success("Cập nhật gói phổ biến thành công!");
      fetchPlans();
    } catch (error) {
      message.error("Lỗi khi cập nhật gói phổ biến");
    }
  };

  // Duplicate plan
  const duplicatePlan = async (planId) => {
    try {
      await api.post(`/admin/subscription-plans/${planId}/duplicate`);
      message.success("Sao chép gói thành công!");
      fetchPlans();
      fetchStatistics();
    } catch (error) {
      message.error("Lỗi khi sao chép gói");
    }
  };

  // Permission options
  const permissionOptions = [
    { value: "community_access", label: "Truy cập Community" },
    { value: "group_chat", label: "Chat nhóm" },
    { value: "project_collaboration", label: "Hợp tác dự án" },
    { value: "premium_support", label: "Hỗ trợ cao cấp" },
  ];

  // Table columns
  const columns = [
    {
      title: "Tên Gói",
      dataIndex: "planName",
      key: "planName",
      render: (text, record) => (
        <Space>
          <Text strong>{text}</Text>
          {record.isPopular && <StarFilled style={{ color: "#faad14" }} />}
        </Space>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price, record) => (
        <Text strong style={{ color: "#52c41a" }}>
          {price.toLocaleString()} {record.currency}
        </Text>
      ),
    },
    {
      title: "Thời hạn",
      key: "duration",
      render: (_, record) => (
        <Text>
          {record.duration}{" "}
          {record.durationType === "months"
            ? "tháng"
            : record.durationType === "days"
            ? "ngày"
            : "năm"}
        </Text>
      ),
    },
    {
      title: "Tier",
      dataIndex: "tier",
      key: "tier",
      render: (tier) => {
        const colorMap = {
          basic: "green",
          premium: "blue",
          enterprise: "purple",
        };
        return <Tag color={colorMap[tier]}>{tier.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => toggleActive(record._id)}
          checkedChildren="Hoạt động"
          unCheckedChildren="Tạm dừng"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="primary"
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip
            title={
              record.isPopular ? "Bỏ đánh dấu phổ biến" : "Đánh dấu phổ biến"
            }
          >
            <Button
              type={record.isPopular ? "primary" : "default"}
              icon={record.isPopular ? <StarFilled /> : <StarOutlined />}
              size="small"
              onClick={() => togglePopular(record._id)}
            />
          </Tooltip>

          <Tooltip title="Sao chép">
            <Button
              icon={<CopyOutlined />}
              size="small"
              onClick={() => duplicatePlan(record._id)}
            />
          </Tooltip>

          <Popconfirm
            title="Xác nhận xóa gói này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button danger icon={<DeleteOutlined />} size="small" />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Statistics */}
      {statistics && (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={12} md={6}>
            <StatsCard>
              <Statistic
                title="Tổng Gói"
                value={statistics.totalPlans}
                prefix={<BarChartOutlined />}
              />
            </StatsCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatsCard>
              <Statistic
                title="Gói Hoạt Động"
                value={statistics.activePlans}
                prefix={<CrownOutlined />}
                valueStyle={{ color: "#52c41a" }}
              />
            </StatsCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatsCard>
              <Statistic
                title="Gói Tạm Dừng"
                value={statistics.inactivePlans}
                prefix={<CrownOutlined />}
                valueStyle={{ color: "#ff4d4f" }}
              />
            </StatsCard>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <StatsCard>
              <Statistic
                title="Giá Trung Bình"
                value={Math.round(statistics.averagePrice)}
                prefix={<DollarOutlined />}
                suffix="₫"
                valueStyle={{ color: "#1890ff" }}
              />
            </StatsCard>
          </Col>
        </Row>
      )}

      <MainCard
        title={
          <Space>
            <CrownOutlined style={{ color: "#e74c3c" }} />
            <Title level={4} style={{ margin: 0 }}>
              Quản lý Gói Dịch Vụ
            </Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingPlan(null);
              resetFormData();
              setModalVisible(true);
            }}
            style={{
              background: "linear-gradient(135deg, #e74c3c, #c0392b)",
              border: "none",
            }}
          >
            Thêm Gói Mới
          </Button>
        }
      >
        {/* ✅ Filters với vanilla selects */}
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Tìm kiếm gói..."
              prefix={<SearchOutlined />}
              value={filters.search}
              onChange={(e) =>
                setFilters({ ...filters, search: e.target.value })
              }
            />
          </Col>
          <Col xs={24} sm={8}>
            <SimpleSelect
              value={filters.isActive}
              onChange={(e) =>
                setFilters({ ...filters, isActive: e.target.value })
              }
            >
              <option value="">Tất cả trạng thái</option>
              <option value="true">Hoạt động</option>
              <option value="false">Tạm dừng</option>
            </SimpleSelect>
          </Col>
          <Col xs={24} sm={8}>
            <SimpleSelect
              value={filters.tier}
              onChange={(e) => setFilters({ ...filters, tier: e.target.value })}
            >
              <option value="">Tất cả tier</option>
              <option value="basic">Basic</option>
              <option value="premium">Premium</option>
              <option value="enterprise">Enterprise</option>
            </SimpleSelect>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={plans}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} gói`,
          }}
        />
      </MainCard>

      {/* ✅ Create/Edit Modal với vanilla inputs */}
      <Modal
        title={editingPlan ? "Chỉnh sửa Gói" : "Thêm Gói Mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPlan(null);
          resetFormData();
        }}
        footer={null}
        width={800}
      >
        <div style={{ maxHeight: "70vh", overflowY: "auto", padding: "0 4px" }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Tên Gói *
                </label>
                <Input
                  placeholder="VD: Crystal Premium"
                  value={formData.planName}
                  onChange={(e) =>
                    setFormData({ ...formData, planName: e.target.value })
                  }
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Tier *
                </label>
                <SimpleSelect
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value })
                  }
                >
                  <option value="">Chọn tier</option>
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </SimpleSelect>
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
              Mô tả *
            </label>
            <TextArea
              rows={3}
              placeholder="Mô tả chi tiết về gói dịch vụ..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <Row gutter={16}>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Giá *
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="150000"
                  value={formData.price}
                  onChange={(value) =>
                    setFormData({ ...formData, price: value })
                  }
                />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Thời hạn *
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="1"
                  value={formData.duration}
                  onChange={(value) =>
                    setFormData({ ...formData, duration: value })
                  }
                />
              </div>
            </Col>
            <Col span={8}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Đơn vị *
                </label>
                <SimpleSelect
                  value={formData.durationType}
                  onChange={(e) =>
                    setFormData({ ...formData, durationType: e.target.value })
                  }
                >
                  <option value="">Chọn đơn vị</option>
                  <option value="days">Ngày</option>
                  <option value="months">Tháng</option>
                  <option value="years">Năm</option>
                </SimpleSelect>
              </div>
            </Col>
          </Row>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
              Tính năng (mỗi dòng một tính năng) *
            </label>
            <TextArea
              rows={4}
              placeholder="Truy cập Community&#10;Chat nhóm không giới hạn&#10;Hỗ trợ 24/7"
              value={formData.features}
              onChange={(e) =>
                setFormData({ ...formData, features: e.target.value })
              }
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label
              style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
            >
              Quyền truy cập *
            </label>
            <MultipleSelect
              value={formData.permissions}
              onChange={(value) =>
                setFormData({ ...formData, permissions: value })
              }
              options={permissionOptions}
              placeholder="Chọn quyền truy cập"
            />
          </div>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Số project tối đa
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="Để trống = không giới hạn"
                  value={formData.maxProjects}
                  onChange={(value) =>
                    setFormData({ ...formData, maxProjects: value })
                  }
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Số thành viên tối đa
                </label>
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="Để trống = không giới hạn"
                  value={formData.maxMembers}
                  onChange={(value) =>
                    setFormData({ ...formData, maxMembers: value })
                  }
                />
              </div>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Kích hoạt gói
                </label>
                <Switch
                  checked={formData.isActive}
                  onChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{ display: "block", marginBottom: 4, fontWeight: 500 }}
                >
                  Gói phổ biến
                </label>
                <Switch
                  checked={formData.isPopular}
                  onChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked })
                  }
                />
              </div>
            </Col>
          </Row>

          <Divider />

          <div style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
              <Button
                type="primary"
                onClick={handleSubmit}
                loading={loading}
                style={{
                  background: "linear-gradient(135deg, #e74c3c, #c0392b)",
                  border: "none",
                }}
              >
                {editingPlan ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default AdminSubscriptionPlans;
