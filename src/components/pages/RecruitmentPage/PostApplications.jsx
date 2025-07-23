import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Tag,
  message,
  Modal,
  Space,
  Typography,
  Avatar,
  Tooltip,
  Row,
  Col,
  Empty,
  Spin,
  Badge,
  Divider,
} from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  UserOutlined,
  CalendarOutlined,
  FileTextOutlined,
  TeamOutlined,
  StarOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import api from "@/services/api/axios";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import ApplicationDetailModal from "./ApplicationDetailModal";

const { Text, Title } = Typography;

export default function PostApplications({ postId: propPostId }) {
  const params = useParams();
  const postId = propPostId || params.postId;
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (postId) fetchApplications();
    // eslint-disable-next-line
  }, [postId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/recruitment-posts/${postId}/applications`
      );
      setApplications(data.data || data);
    } catch (err) {
      message.error("Không thể tải danh sách ứng viên");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    Modal.confirm({
      title: (
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              action === "accept" ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {action === "accept" ? (
              <CheckOutlined className="text-green-600" />
            ) : (
              <CloseOutlined className="text-red-600" />
            )}
          </div>
          <span className="text-lg font-semibold">
            {action === "accept" ? "Chấp thuận ứng viên?" : "Từ chối ứng viên?"}
          </span>
        </div>
      ),
      content: (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-700 mb-2">
            {action === "accept"
              ? "✅ Ứng viên sẽ nhận email chúc mừng và được thêm vào dự án"
              : "❌ Ứng viên sẽ nhận email thông báo về kết quả"}
          </p>
          <p className="text-sm text-gray-500">
            Hành động này không thể hoàn tác
          </p>
        </div>
      ),
      okText: action === "accept" ? "Chấp thuận" : "Từ chối",
      cancelText: "Hủy",
      okButtonProps: {
        className:
          action === "accept"
            ? "bg-green-500 hover:bg-green-600 border-green-500"
            : "bg-red-500 hover:bg-red-600 border-red-500",
      },
      onOk: async () => {
        try {
          await api.patch(
            `/recruitment-posts/${postId}/applications/${id}/${action}`
          );
          message.success({
            content:
              action === "accept"
                ? "🎉 Đã chấp thuận và gửi email thông báo!"
                : "📧 Đã từ chối và gửi email thông báo!",
            duration: 3,
          });
          fetchApplications();
        } catch (err) {
          message.error("Thao tác thất bại. Vui lòng thử lại!");
        }
      },
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      applied: {
        color: "#1890ff",
        bg: "#e6f7ff",
        text: "Đang chờ duyệt",
        icon: "⏳",
      },
      accepted: {
        color: "#52c41a",
        bg: "#f6ffed",
        text: "Đã chấp thuận",
        icon: "✅",
      },
      rejected: {
        color: "#ff4d4f",
        bg: "#fff2f0",
        text: "Đã từ chối",
        icon: "❌",
      },
      interview: {
        color: "#fa8c16",
        bg: "#fff7e6",
        text: "Phỏng vấn",
        icon: "👥",
      },
    };
    return configs[status] || configs.applied;
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Chưa có ứng viên nào ứng tuyển
                </h3>
                <p className="text-gray-500">
                  Hãy chia sẻ bài đăng để thu hút nhiều ứng viên hơn!
                </p>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <TeamOutlined className="text-white text-2xl" />
            </div>
            <div>
              <Title level={2} className="mb-1 text-gray-800">
                Quản lý ứng viên
              </Title>
              <Text className="text-gray-600 text-lg">
                Danh sách các ứng viên đã ứng tuyển vào vị trí của bạn
              </Text>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={6}>
          <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">
                {stats.total}
              </div>
              <div className="text-blue-800 font-medium">Tổng ứng viên</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-orange-600">
                {stats.applied}
              </div>
              <div className="text-orange-800 font-medium">Đang chờ</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-green-600">
                {stats.accepted}
              </div>
              <div className="text-green-800 font-medium">Đã chấp thuận</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="text-center border-0 shadow-sm bg-gradient-to-br from-red-50 to-red-100">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-red-600">
                {stats.rejected}
              </div>
              <div className="text-red-800 font-medium">Đã từ chối</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Applications Grid */}
      <div className="space-y-4">
        {applications.map((application) => {
          const statusConfig = getStatusConfig(application.status);
          const user = application.applicantId;
          const userName = user?.fullName || user?.name || "Ẩn danh";
          const userId = typeof user === "object" ? user._id : user;

          return (
            <Card
              key={application._id}
              className="hover:shadow-lg transition-all duration-300 border border-gray-100 rounded-2xl overflow-hidden"
              bodyStyle={{ padding: 0 }}
            >
              <div className="p-6">
                <Row gutter={[24, 16]} align="middle">
                  {/* User Info */}
                  <Col xs={24} md={8}>
                    <div className="flex items-center gap-4">
                      <Badge
                        count={statusConfig.icon}
                        offset={[-5, 5]}
                        style={{
                          backgroundColor: statusConfig.color,
                          fontSize: "12px",
                        }}
                      >
                        <Avatar
                          size={64}
                          icon={<UserOutlined />}
                          className="border-4 border-white shadow-lg"
                          style={{
                            backgroundColor: "#1890ff",
                          }}
                        />
                      </Badge>
                      <div>
                        <Title level={4} className="mb-1">
                          {userName}
                        </Title>
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                          <CalendarOutlined />
                          <span>
                            Ứng tuyển lúc{" "}
                            {dayjs(application.createdAt).format(
                              "DD/MM/YYYY HH:mm"
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Col>

                  {/* Status */}
                  <Col xs={24} md={4}>
                    <div className="text-center">
                      <div
                        className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                        style={{
                          color: statusConfig.color,
                          backgroundColor: statusConfig.bg,
                        }}
                      >
                        {statusConfig.icon} {statusConfig.text}
                      </div>
                    </div>
                  </Col>

                  {/* Actions */}
                  <Col xs={24} md={12}>
                    <div className="flex justify-end gap-3 flex-wrap">
                      <Button
                        icon={<FileTextOutlined />}
                        onClick={() => {
                          setSelectedApplication(application);
                          setDetailModalOpen(true);
                        }}
                        className="flex items-center gap-2 hover:border-blue-400 hover:text-blue-600 rounded-lg"
                      >
                        Xem chi tiết
                      </Button>

                      <Button
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/profile/id/${userId}`)}
                        className="flex items-center gap-2 hover:border-purple-400 hover:text-purple-600 rounded-lg"
                      >
                        Xem profile
                      </Button>

                      {application.status === "applied" && (
                        <>
                          <Button
                            type="primary"
                            icon={<CheckOutlined />}
                            onClick={() =>
                              handleAction(application._id, "accept")
                            }
                            className="bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 rounded-lg flex items-center gap-2"
                          >
                            Chấp thuận
                          </Button>

                          <Button
                            danger
                            icon={<CloseOutlined />}
                            onClick={() =>
                              handleAction(application._id, "reject")
                            }
                            className="rounded-lg flex items-center gap-2"
                          >
                            Từ chối
                          </Button>
                        </>
                      )}
                    </div>
                  </Col>
                </Row>

                {/* Preview of reason */}
                {application.reason && (
                  <>
                    <Divider className="my-4" />
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <MailOutlined className="text-blue-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-800 mb-2">
                            Lý do ứng tuyển:
                          </h5>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {application.reason.length > 150
                              ? application.reason.substring(0, 150) + "..."
                              : application.reason}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Detail Modal */}
      <ApplicationDetailModal
        open={detailModalOpen}
        application={selectedApplication}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  );
}
