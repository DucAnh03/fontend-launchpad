import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Input,
  Space,
  Tag,
  DatePicker,
  message,
  Row,
  Col,
  Statistic,
  Typography,
  Progress,
  Tooltip,
  Modal,
  Descriptions,
  Select,
  Empty,
} from "antd";
import {
  DollarOutlined,
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  RollbackOutlined,
  CalendarOutlined,
  TrophyOutlined,
  RiseOutlined,
  FallOutlined,
  ReloadOutlined,
  FilterOutlined,
  DownloadOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import api from "@/services/api/axios";
import styled from "styled-components";
import dayjs from "dayjs";

const { Search } = Input;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

// Styled Components
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

const ChartCard = styled(Card)`
  && {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 24px;

    .chart-container {
      height: 300px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(45deg, #f8f9fa, #e9ecef);
      border-radius: 8px;
      position: relative;
    }
  }
`;

// Custom select thay thế Select của Ant Design
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

export default function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedMethod, setSelectedMethod] = useState("all");
  const [dateRange, setDateRange] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalPayments: 0,
    successfulPayments: 0,
    pendingPayments: 0,
    failedPayments: 0,
    todayRevenue: 0,
    monthlyRevenue: 0,
    conversionRate: 0,
  });
  const [chartData, setChartData] = useState({
    daily: [],
    monthly: [],
    methodDistribution: [],
  });

  // Fetch payments data
  const fetchPayments = async (page = 1, size = 10) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: size.toString(),
        ...(searchText && { search: searchText }),
        ...(selectedStatus !== "all" && { status: selectedStatus }),
        ...(selectedMethod !== "all" && { method: selectedMethod }),
        ...(dateRange && {
          startDate: dateRange[0].format("YYYY-MM-DD"),
          endDate: dateRange[1].format("YYYY-MM-DD"),
        }),
      });

      const response = await api.get(`/admin/payments?${params}`);
      const {
        payments: paymentData,
        pagination,
        statistics,
      } = response.data.data;

      setPayments(paymentData || []);
      setTotal(pagination?.total || 0);

      // Update statistics
      if (statistics) {
        setStats(statistics);
      }

      // Calculate stats if not provided by backend
      calculateStats(paymentData || []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      message.error("Không thể tải danh sách thanh toán");
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chart data
  const fetchChartData = async () => {
    try {
      const response = await api.get("/admin/payments/analytics");
      setChartData(response.data.data);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  // Calculate statistics
  const calculateStats = (paymentData) => {
    if (!Array.isArray(paymentData)) return;

    const totalRevenue = paymentData
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    const totalPayments = paymentData.length;
    const successfulPayments = paymentData.filter(
      (p) => p.status === "success"
    ).length;
    const pendingPayments = paymentData.filter(
      (p) => p.status === "pending"
    ).length;
    const failedPayments = paymentData.filter(
      (p) => p.status === "failed"
    ).length;

    const today = new Date().toDateString();
    const todayRevenue = paymentData
      .filter(
        (p) =>
          p.status === "success" &&
          new Date(p.createdAt).toDateString() === today
      )
      .reduce((sum, p) => sum + p.amount, 0);

    const thisMonth = new Date().getMonth();
    const monthlyRevenue = paymentData
      .filter(
        (p) =>
          p.status === "success" &&
          new Date(p.createdAt).getMonth() === thisMonth
      )
      .reduce((sum, p) => sum + p.amount, 0);

    const conversionRate =
      totalPayments > 0 ? (successfulPayments / totalPayments) * 100 : 0;

    setStats({
      totalRevenue,
      totalPayments,
      successfulPayments,
      pendingPayments,
      failedPayments,
      todayRevenue,
      monthlyRevenue,
      conversionRate,
    });
  };

  // Load data on component mount
  useEffect(() => {
    fetchPayments(currentPage, pageSize);
    fetchChartData();
  }, [currentPage, pageSize, selectedStatus, selectedMethod, dateRange]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setCurrentPage(1);
    fetchPayments(1, pageSize);
  };

  // Handle filters
  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleMethodFilter = (e) => {
    setSelectedMethod(e.target.value);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
    setCurrentPage(1);
  };

  // Show payment details
  const showPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setDetailModalVisible(true);
  };

  // Get status color and icon
  const getStatusConfig = (status) => {
    switch (status) {
      case "success":
        return {
          color: "green",
          icon: <CheckCircleOutlined />,
          text: "Thành công",
        };
      case "pending":
        return {
          color: "orange",
          icon: <ClockCircleOutlined />,
          text: "Đang xử lý",
        };
      case "failed":
        return {
          color: "red",
          icon: <CloseCircleOutlined />,
          text: "Thất bại",
        };
      case "refunded":
        return {
          color: "purple",
          icon: <RollbackOutlined />,
          text: "Đã hoàn tiền",
        };
      default:
        return {
          color: "default",
          icon: <ClockCircleOutlined />,
          text: status,
        };
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Table columns
  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "invoiceId",
      key: "invoiceId",
      width: 150,
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 12 }}>
            {text || record._id?.slice(-8)}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 10 }}>
            {new Date(record.createdAt).toLocaleDateString("vi-VN")}
          </Text>
        </div>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: ["userId", "name"],
      key: "user",
      width: 150,
      render: (_, record) => (
        <div>
          <Text strong style={{ fontSize: 12 }}>
            {record.userId?.name || "N/A"}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 10 }}>
            {record.userId?.email}
          </Text>
        </div>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: (amount) => (
        <Text strong style={{ color: "#52c41a", fontSize: 14 }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      key: "method",
      width: 100,
      render: (method) => (
        <Tag color="blue" style={{ fontSize: 11 }}>
          {method?.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color} icon={config.icon} style={{ fontSize: 11 }}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      responsive: ["md"],
      render: (date) => (
        <div>
          <div style={{ fontSize: 12 }}>
            {new Date(date).toLocaleDateString("vi-VN")}
          </div>
          <div style={{ fontSize: 10, color: "#8c8c8c" }}>
            {new Date(date).toLocaleTimeString("vi-VN")}
          </div>
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <ActionButton
              type="primary"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => showPaymentDetails(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer>
      {/* Page Header */}
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: "#262626" }}>
          <DollarOutlined style={{ marginRight: 12, color: "#1890ff" }} />
          Quản lý thanh toán
        </Title>
        <Text type="secondary">Thống kê doanh thu và quản lý giao dịch</Text>
      </div>

      {/* Statistics Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              formatter={(value) => formatCurrency(value)}
              prefix={<DollarOutlined style={{ color: "#52c41a" }} />}
            />
          </StatsCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Tổng giao dịch"
              value={stats.totalPayments}
              prefix={<BarChartOutlined style={{ color: "#1890ff" }} />}
            />
          </StatsCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Thành công"
              value={stats.successfulPayments}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
          </StatsCard>
        </Col>
        <Col xs={12} sm={6}>
          <StatsCard>
            <Statistic
              title="Tỉ lệ thành công"
              value={stats.conversionRate}
              precision={1}
              suffix="%"
              prefix={<TrophyOutlined style={{ color: "#fa8c16" }} />}
            />
          </StatsCard>
        </Col>
      </Row>

      {/* Revenue Progress */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} md={12}>
          <StatsCard>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Doanh thu hôm nay</Text>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#52c41a",
                  marginTop: 8,
                }}
              >
                {formatCurrency(stats.todayRevenue)}
              </div>
            </div>
            <Progress
              percent={Math.min(
                (stats.todayRevenue / (stats.monthlyRevenue || 1)) * 100,
                100
              )}
              strokeColor="#52c41a"
              format={() =>
                `${Math.round(
                  (stats.todayRevenue / (stats.monthlyRevenue || 1)) * 100
                )}%`
              }
            />
          </StatsCard>
        </Col>
        <Col xs={24} md={12}>
          <StatsCard>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Doanh thu tháng này</Text>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1890ff",
                  marginTop: 8,
                }}
              >
                {formatCurrency(stats.monthlyRevenue)}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text type="secondary">So với tháng trước</Text>
              <Text style={{ color: "#52c41a" }}>
                <RiseOutlined /> +12%
              </Text>
            </div>
          </StatsCard>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <ChartCard title="Doanh thu theo ngày">
            <div className="chart-container">
              <BarChartOutlined
                style={{ fontSize: 48, color: "#1890ff", marginBottom: 16 }}
              />
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ fontSize: 16 }}>
                  Biểu đồ doanh thu
                </Text>
                <br />
                <Text type="secondary">Dữ liệu 30 ngày gần nhất</Text>
              </div>
            </div>
          </ChartCard>
        </Col>
        <Col xs={24} lg={12}>
          <ChartCard title="Phân bố phương thức thanh toán">
            <div className="chart-container">
              <DollarOutlined
                style={{ fontSize: 48, color: "#52c41a", marginBottom: 16 }}
              />
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ fontSize: 16 }}>
                  Thống kê phương thức
                </Text>
                <br />
                <Space direction="vertical" size={4}>
                  <Text>💳 VNPay: 85%</Text>
                  <Text>🏦 Banking: 15%</Text>
                </Space>
              </div>
            </div>
          </ChartCard>
        </Col>
      </Row>

      {/* Filters */}
      <FilterSection>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} lg={8}>
            <Search
              placeholder="Tìm kiếm theo mã GD, tên người dùng..."
              enterButton={<SearchOutlined />}
              size="large"
              onSearch={handleSearch}
              onChange={(e) => e.target.value === "" && handleSearch("")}
            />
          </Col>
          <Col xs={12} lg={4}>
            <CustomSelect value={selectedStatus} onChange={handleStatusFilter}>
              <option value="all">Tất cả trạng thái</option>
              <option value="success">Thành công</option>
              <option value="pending">Đang xử lý</option>
              <option value="failed">Thất bại</option>
              <option value="refunded">Đã hoàn tiền</option>
            </CustomSelect>
          </Col>
          <Col xs={12} lg={4}>
            <CustomSelect value={selectedMethod} onChange={handleMethodFilter}>
              <option value="all">Tất cả phương thức</option>
              <option value="vnpay">VNPay</option>
              <option value="banking">Banking</option>
              <option value="wallet">Ví điện tử</option>
            </CustomSelect>
          </Col>
          <Col xs={24} lg={8}>
            <Space>
              <RangePicker
                size="large"
                onChange={handleDateRangeChange}
                format="DD/MM/YYYY"
                placeholder={["Từ ngày", "Đến ngày"]}
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchPayments(currentPage, pageSize)}
              >
                Làm mới
              </Button>
              <Button icon={<DownloadOutlined />} type="primary">
                Xuất Excel
              </Button>
            </Space>
          </Col>
        </Row>
      </FilterSection>

      {/* Payments Table */}
      <Card style={{ borderRadius: 12 }}>
        <Table
          columns={columns}
          dataSource={payments}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} giao dịch`,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
          scroll={{ x: 1000, y: 600 }}
          size="middle"
        />
      </Card>

      {/* Payment Details Modal */}
      <Modal
        title={
          <Space>
            <DollarOutlined />
            <span>Chi tiết giao dịch</span>
          </Space>
        }
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedPayment && (
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item label="Mã giao dịch" span={1}>
              {selectedPayment.invoiceId || selectedPayment._id}
            </Descriptions.Item>
            <Descriptions.Item label="Người dùng" span={1}>
              {selectedPayment.userId?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Email" span={2}>
              {selectedPayment.userId?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền" span={1}>
              <Text strong style={{ color: "#52c41a", fontSize: 16 }}>
                {formatCurrency(selectedPayment.amount)}
              </Text>
            </Descriptions.Item>
            <Descriptions.Item label="Tiền tệ" span={1}>
              {selectedPayment.currency}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức" span={1}>
              <Tag color="blue">{selectedPayment.method?.toUpperCase()}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Gateway" span={1}>
              {selectedPayment.gateway}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái" span={1}>
              {(() => {
                const config = getStatusConfig(selectedPayment.status);
                return (
                  <Tag color={config.color} icon={config.icon}>
                    {config.text}
                  </Tag>
                );
              })()}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do thất bại" span={1}>
              {selectedPayment.failureReason || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo" span={1}>
              {new Date(selectedPayment.createdAt).toLocaleString("vi-VN")}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày xử lý" span={1}>
              {selectedPayment.processedAt
                ? new Date(selectedPayment.processedAt).toLocaleString("vi-VN")
                : "Chưa xử lý"}
            </Descriptions.Item>
            <Descriptions.Item label="Metadata" span={2}>
              <pre
                style={{
                  fontSize: 11,
                  background: "#f5f5f5",
                  padding: 8,
                  borderRadius: 4,
                }}
              >
                {JSON.stringify(selectedPayment.metadata, null, 2)}
              </pre>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </PageContainer>
  );
}
