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
  Select,
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
const { Option } = Select;

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

  const [form] = Form.useForm();

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
  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      const submitData = {
        ...values,
        features: values.features || [],
        permissions: values.permissions || [],
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
      form.resetFields();
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
    form.setFieldsValue({
      ...plan,
      features: plan.features?.join("\n") || "",
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
              form.resetFields();
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
        {/* Filters */}
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
            <Select
              placeholder="Trạng thái"
              style={{ width: "100%" }}
              value={filters.isActive}
              onChange={(value) => setFilters({ ...filters, isActive: value })}
              allowClear
            >
              <Option value="true">Hoạt động</Option>
              <Option value="false">Tạm dừng</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Tier"
              style={{ width: "100%" }}
              value={filters.tier}
              onChange={(value) => setFilters({ ...filters, tier: value })}
              allowClear
            >
              <Option value="basic">Basic</Option>
              <Option value="premium">Premium</Option>
              <Option value="enterprise">Enterprise</Option>
            </Select>
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

      {/* Create/Edit Modal */}
      <Modal
        title={editingPlan ? "Chỉnh sửa Gói" : "Thêm Gói Mới"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingPlan(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="planName"
                label="Tên Gói"
                rules={[{ required: true, message: "Vui lòng nhập tên gói!" }]}
              >
                <Input placeholder="VD: Crystal Premium" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="tier"
                label="Tier"
                rules={[{ required: true, message: "Vui lòng chọn tier!" }]}
              >
                <Select placeholder="Chọn tier">
                  <Option value="basic">Basic</Option>
                  <Option value="premium">Premium</Option>
                  <Option value="enterprise">Enterprise</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <TextArea rows={3} placeholder="Mô tả chi tiết về gói dịch vụ..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="price"
                label="Giá"
                rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  placeholder="150000"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="duration"
                label="Thời hạn"
                rules={[{ required: true, message: "Vui lòng nhập thời hạn!" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="1"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="durationType"
                label="Đơn vị"
                rules={[{ required: true, message: "Vui lòng chọn đơn vị!" }]}
              >
                <Select placeholder="Chọn đơn vị">
                  <Option value="days">Ngày</Option>
                  <Option value="months">Tháng</Option>
                  <Option value="years">Năm</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="features"
            label="Tính năng (mỗi dòng một tính năng)"
            rules={[{ required: true, message: "Vui lòng nhập tính năng!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Truy cập Community&#10;Chat nhóm không giới hạn&#10;Hỗ trợ 24/7"
            />
          </Form.Item>

          <Form.Item
            name="permissions"
            label="Quyền truy cập"
            rules={[{ required: true, message: "Vui lòng chọn quyền!" }]}
          >
            <Select mode="multiple" placeholder="Chọn quyền truy cập">
              <Option value="community_access">Truy cập Community</Option>
              <Option value="group_chat">Chat nhóm</Option>
              <Option value="project_collaboration">Hợp tác dự án</Option>
              <Option value="premium_support">Hỗ trợ cao cấp</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="maxProjects" label="Số project tối đa">
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="Để trống = không giới hạn"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="maxMembers" label="Số thành viên tối đa">
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  placeholder="Để trống = không giới hạn"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isActive"
                label="Kích hoạt gói"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isPopular"
                label="Gói phổ biến"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item style={{ textAlign: "right", marginBottom: 0 }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  background: "linear-gradient(135deg, #e74c3c, #c0392b)",
                  border: "none",
                }}
              >
                {editingPlan ? "Cập nhật" : "Tạo mới"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default AdminSubscriptionPlans;
