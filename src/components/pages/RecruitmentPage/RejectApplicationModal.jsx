import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Radio,
  Space,
  Divider,
} from "antd";
import {
  CloseOutlined,
  LoadingOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import api from "@/services/api/axios";

const { TextArea } = Input;

const RejectApplicationModal = ({
  visible,
  onCancel,
  onSuccess,
  applicationId,
  applicantName,
  postTitle,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [rejectType, setRejectType] = useState("quick");

  const quickReasons = [
    {
      key: "experience",
      value:
        "Kinh nghiệm chưa đáp ứng yêu cầu của dự án. Chúng tôi khuyến khích bạn tiếp tục học hỏi và ứng tuyển lại trong tương lai.",
    },
    {
      key: "skills",
      value:
        "Kỹ năng hiện tại chưa phù hợp với công nghệ mà dự án đang sử dụng. Hãy bổ sung thêm kiến thức và thử lại nhé!",
    },
    {
      key: "time",
      value:
        "Dự án yêu cầu cam kết thời gian cao hơn mong đợi của bạn. Cảm ơn bạn đã quan tâm!",
    },
    {
      key: "team_full",
      value:
        "Team đã đủ thành viên cho giai đoạn hiện tại. Chúng tôi sẽ liên hệ nếu có cơ hội khác phù hợp.",
    },
    {
      key: "direction",
      value:
        "Hướng phát triển cá nhân của bạn chưa hoàn toàn phù hợp với định hướng dự án. Chúc bạn tìm được dự án phù hợp hơn!",
    },
  ];

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      let rejectionReason = "";
      if (rejectType === "quick" && values.quickReason) {
        rejectionReason = values.quickReason;
      } else if (rejectType === "custom" && values.customReason) {
        rejectionReason = values.customReason.trim();
      }

      const response = await api.patch(
        `/recruitment-posts/_/applications/${applicationId}/reject`,
        { rejectionReason: rejectionReason || null }
      );

      if (response.status === 200) {
        message.success("Đã từ chối ứng viên và gửi email thông báo");
        form.resetFields();
        onSuccess && onSuccess();
        onCancel();
      } else {
        message.error("Có lỗi xảy ra khi từ chối ứng tuyển");
      }
    } catch (error) {
      console.error("Reject application error:", error);

      if (error.response) {
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi từ chối ứng tuyển";
        message.error(errorMessage);
      } else {
        message.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      form.resetFields();
      setRejectType("quick");
      onCancel();
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
            <CloseOutlined className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 m-0">
              Từ chối ứng tuyển
            </h3>
            <p className="text-sm text-gray-600 m-0 mt-1">
              👤 {applicantName} • 📋 {postTitle}
            </p>
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={650}
      className="reject-application-modal"
      maskClosable={!loading}
      closable={!loading}
    >
      <div className="space-y-6 py-4">
        {/* Warning Section */}
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <ExclamationCircleOutlined className="text-red-600 text-lg" />
            </div>
            <div>
              <h4 className="text-lg font-semibold text-red-800 mb-2">
                Xác nhận từ chối ứng tuyển
              </h4>
              <p className="text-red-700 mb-0">
                Bạn sẽ từ chối ứng viên <strong>{applicantName}</strong> cho vị
                trí này. Ứng viên sẽ nhận được email thông báo kèm lý do (nếu
                có).
              </p>
            </div>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ rejectType: "quick" }}
        >
          {/* Reject Type Selection */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <EditOutlined className="text-blue-600" />
              Chọn cách phản hồi
            </h4>

            <Radio.Group
              value={rejectType}
              onChange={(e) => setRejectType(e.target.value)}
              className="w-full"
            >
              <div className="space-y-3">
                <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <Radio value="quick" className="mb-2">
                    <span className="font-medium text-gray-800">
                      Sử dụng lý do có sẵn
                    </span>
                  </Radio>
                  <p className="text-sm text-gray-600 ml-6">
                    Chọn từ các lý do phổ biến, tiết kiệm thời gian
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <Radio value="custom" className="mb-2">
                    <span className="font-medium text-gray-800">
                      Viết lý do tùy chỉnh
                    </span>
                  </Radio>
                  <p className="text-sm text-gray-600 ml-6">
                    Phản hồi chi tiết và cá nhân hóa
                  </p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                  <Radio value="no_reason" className="mb-2">
                    <span className="font-medium text-gray-800">
                      Không gửi lý do cụ thể
                    </span>
                  </Radio>
                  <p className="text-sm text-gray-600 ml-6">
                    Chỉ thông báo kết quả, không đưa ra lý do
                  </p>
                </div>
              </div>
            </Radio.Group>
          </div>

          {/* Quick Reasons */}
          {rejectType === "quick" && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-blue-800 mb-4">
                Chọn lý do phù hợp
              </h4>

              <Form.Item
                name="quickReason"
                rules={[{ required: true, message: "Vui lòng chọn một lý do" }]}
              >
                <Radio.Group className="w-full">
                  <div className="space-y-3">
                    {quickReasons.map((reason, index) => (
                      <div
                        key={reason.key}
                        className="bg-white rounded-xl p-4 border border-blue-100"
                      >
                        <Radio value={reason.value} className="mb-2">
                          <span className="font-medium text-gray-800">
                            Lý do {index + 1}
                          </span>
                        </Radio>
                        <p className="text-sm text-gray-600 ml-6 leading-relaxed">
                          "{reason.value}"
                        </p>
                      </div>
                    ))}
                  </div>
                </Radio.Group>
              </Form.Item>
            </div>
          )}

          {/* Custom Reason */}
          {rejectType === "custom" && (
            <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
              <h4 className="text-lg font-semibold text-purple-800 mb-4">
                Viết lý do tùy chỉnh
              </h4>

              <Form.Item
                name="customReason"
                rules={[
                  { required: true, message: "Vui lòng nhập lý do từ chối" },
                  { min: 10, message: "Lý do phải có ít nhất 10 ký tự" },
                  { max: 1000, message: "Lý do không được quá 1000 ký tự" },
                ]}
              >
                <TextArea
                  placeholder="Hãy viết phản hồi chân thành và xây dựng để giúp ứng viên hiểu rõ lý do và có động lực cải thiện...

Ví dụ: 'Cảm ơn bạn đã quan tâm đến dự án của chúng tôi. Sau khi xem xét kỹ lưỡng, chúng tôi nhận thấy rằng...' "
                  rows={8}
                  className="rounded-xl border-purple-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 resize-none"
                  disabled={loading}
                  showCount
                  maxLength={1000}
                />
              </Form.Item>

              <div className="bg-purple-100 border border-purple-200 rounded-lg p-4 mt-4">
                <div className="flex items-start gap-3">
                  <CheckCircleOutlined className="text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h5 className="font-medium text-purple-800 mb-2">
                      Mẹo viết phản hồi tích cực:
                    </h5>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Cảm ơn ứng viên đã quan tâm</li>
                      <li>• Đưa ra lý do cụ thể nhưng xây dựng</li>
                      <li>• Khuyến khích phát triển kỹ năng</li>
                      <li>• Chúc họ tìm được cơ hội phù hợp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* No Reason Selected */}
          {rejectType === "no_reason" && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4">
                  <ExclamationCircleOutlined className="text-gray-500 text-2xl" />
                </div>
                <h4 className="text-lg font-semibold text-gray-700 mb-2">
                  Từ chối không kèm lý do
                </h4>
                <p className="text-gray-600">
                  Ứng viên sẽ chỉ nhận được thông báo chung về kết quả ứng
                  tuyển.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="default"
              onClick={handleCancel}
              disabled={loading}
              className="flex-1 h-12 rounded-xl border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700 transition-all duration-200 font-medium"
              size="large"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              icon={loading ? <LoadingOutlined /> : <CloseOutlined />}
              className="flex-1 h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
              size="large"
            >
              {loading ? "Đang xử lý..." : "Xác nhận từ chối"}
            </Button>
          </div>
        </Form>

        {/* Info Footer */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-6">
          <div className="flex items-start gap-3">
            <span className="text-yellow-600 text-lg">💡</span>
            <div>
              <h5 className="font-medium text-yellow-800 mb-1">
                Lưu ý quan trọng
              </h5>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Email sẽ được gửi tự động đến ứng viên</li>
                <li>• Phản hồi xây dựng giúp ứng viên cải thiện bản thân</li>
                <li>• Hành động này không thể hoàn tác</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default RejectApplicationModal;
