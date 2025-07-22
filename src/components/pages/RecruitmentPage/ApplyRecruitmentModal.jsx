import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  message,
  Spin,
  Select,
  Tag,
  Divider,
} from "antd";
import {
  SendOutlined,
  LoadingOutlined,
  PlusOutlined,
  MinusCircleOutlined,
  UserOutlined,
  LinkOutlined,
  FileTextOutlined,
  GlobalOutlined,
  StarOutlined,
} from "@ant-design/icons";
import api from "@/services/api/axios";
import "./ApplyRecruitmentModal.css";

const { TextArea } = Input;
const { Option } = Select;

const proficiencyOptions = [
  { label: "Beginner", value: "beginner", color: "#f50" },
  { label: "Intermediate", value: "intermediate", color: "#2db7f5" },
  { label: "Advanced", value: "advanced", color: "#87d068" },
  { label: "Native", value: "native", color: "#108ee9" },
];

const ApplyRecruitmentModal = ({
  visible,
  onCancel,
  onSuccess,
  postId,
  postTitle,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);

      // Get JWT token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("Vui lòng đăng nhập để ứng tuyển");
        setLoading(false);
        return;
      }

      // Prepare request data - thêm reason vào đây
      const requestData = {
        reason: values.reason,
        portfolioUrl: values.portfolioUrl,
        portfolioUrls: values.portfolioUrls?.filter(Boolean) || [],
        socialLinks: values.socialLinks || {},
        resumeUrl: values.resumeUrl,
        languages: values.languages?.filter((l) => l && l.language) || [],
        // Thêm các trường mới
        experience: values.experience,
        skills: values.skills?.filter(Boolean) || [],
      };

      // Make API request
      const response = await api.post(
        `/recruitment-posts/${postId}/applications`,
        requestData
      );

      if (response.status === 200 || response.status === 201) {
        message.success("Đã gửi đơn ứng tuyển thành công!");
        form.resetFields();
        onSuccess && onSuccess();
        onCancel();
      } else {
        message.error("Có lỗi xảy ra khi gửi đơn ứng tuyển");
      }
    } catch (error) {
      console.error("Apply recruitment error:", error);

      // Kiểm tra lỗi unique constraint (duplicate application)
      if (
        error.response?.data?.message?.includes("11000") ||
        error.response?.data?.code === 11000 ||
        error.response?.status === 400
      ) {
        message.error("Bạn chỉ được ứng tuyển vào vị trí này 1 lần!");
      } else if (error.response) {
        const errorMessage =
          error.response.data?.message || "Có lỗi xảy ra khi gửi đơn ứng tuyển";
        message.error(errorMessage);
      } else if (error.request) {
        message.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
      } else {
        message.error("Có lỗi xảy ra. Vui lòng thử lại sau.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (!loading) {
      form.resetFields();
      onCancel();
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center gap-4 p-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <SendOutlined className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 m-0">
              Ứng tuyển vào dự án
            </h3>
            {postTitle && (
              <p className="text-sm text-gray-600 m-0 mt-1 font-medium">
                📋 {postTitle}
              </p>
            )}
          </div>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      className="apply-recruitment-modal"
      maskClosable={!loading}
      closable={!loading}
      styles={{
        body: { padding: "24px" },
      }}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-2xl border border-blue-100">
          <div className="flex items-center gap-3 mb-3">
            <UserOutlined className="text-blue-600 text-lg" />
            <h4 className="text-lg font-semibold text-gray-800 m-0">
              Thông tin ứng tuyển
            </h4>
          </div>
          <p className="text-gray-600 mb-0">
            Hãy cung cấp đầy đủ thông tin để tăng cơ hội được chấp nhận vào dự
            án
          </p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="apply-form space-y-6"
          scrollToFirstError
        >
          {/* Main Reason Field - Improved */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <FileTextOutlined className="text-red-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 m-0">
                Lý do ứng tuyển <span className="text-red-500">*</span>
              </h4>
            </div>

            <Form.Item
              name="reason"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập lý do ứng tuyển",
                },
                {
                  min: 20,
                  message:
                    "Lý do ứng tuyển phải có ít nhất 20 ký tự để thể hiện sự chân thành",
                },
                {
                  max: 1000,
                  message: "Lý do ứng tuyển không được quá 1000 ký tự",
                },
              ]}
            >
              <TextArea
                placeholder="Hãy chia sẻ chi tiết về:
• Tại sao bạn quan tâm đến dự án này?
• Những kinh nghiệm/kỹ năng nào bạn có thể đóng góp?
• Bạn mong muốn học được gì từ dự án này?
• Cam kết thời gian và sự tham gia của bạn..."
                rows={8}
                className="rounded-xl border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none text-gray-700"
                disabled={loading}
                showCount
                maxLength={1000}
              />
            </Form.Item>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
              <p className="text-yellow-800 text-sm m-0 flex items-start gap-2">
                <StarOutlined className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>
                  <strong>Mẹo:</strong> Một lý do ứng tuyển chi tiết và chân
                  thành sẽ tăng đáng kể cơ hội được chọn!
                </span>
              </p>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <StarOutlined className="text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 m-0">
                Kỹ năng chính
              </h4>
            </div>

            <Form.List name="skills">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <div key={field.key} className="flex items-center gap-3">
                      <Form.Item {...field} className="flex-1 mb-0">
                        <Input
                          placeholder={`Ví dụ: React, Node.js, Python, Design...`}
                          disabled={loading}
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                        disabled={loading}
                        className="border-red-200 text-red-500 hover:border-red-300 hover:text-red-600"
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className="w-full h-10 rounded-lg border-green-200 text-green-600 hover:border-green-300 hover:text-green-700"
                    disabled={loading}
                  >
                    Thêm kỹ năng
                  </Button>
                </div>
              )}
            </Form.List>
          </div>

          {/* Experience Field */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <UserOutlined className="text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 m-0">
                Kinh nghiệm liên quan
              </h4>
            </div>

            <Form.Item name="experience">
              <TextArea
                placeholder="Chia sẻ về kinh nghiệm làm việc, dự án đã tham gia, thành tựu đáng chú ý..."
                rows={4}
                className="rounded-xl border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all duration-200 resize-none"
                disabled={loading}
                showCount
                maxLength={500}
              />
            </Form.Item>
          </div>

          {/* Portfolio & Links Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <LinkOutlined className="text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 m-0">
                Portfolio & Liên kết
              </h4>
            </div>

            <div className="space-y-4">
              {/* Main Portfolio */}
              <Form.Item
                name="portfolioUrl"
                label="Link Portfolio chính"
                rules={[{ type: "url", message: "Vui lòng nhập URL hợp lệ" }]}
              >
                <Input
                  placeholder="https://your-portfolio.com"
                  className="rounded-lg"
                  disabled={loading}
                  prefix={<LinkOutlined className="text-gray-400" />}
                />
              </Form.Item>

              {/* Additional Portfolios */}
              <Form.List name="portfolioUrls">
                {(fields, { add, remove }) => (
                  <div className="space-y-3">
                    <label className="text-gray-700 font-medium">
                      Portfolio khác
                    </label>
                    {fields.map((field, idx) => (
                      <div key={field.key} className="flex items-center gap-3">
                        <Form.Item
                          {...field}
                          className="flex-1 mb-0"
                          rules={[{ type: "url", message: "URL không hợp lệ" }]}
                        >
                          <Input
                            placeholder={`Portfolio #${idx + 1}`}
                            disabled={loading}
                            className="rounded-lg"
                            prefix={<LinkOutlined className="text-gray-400" />}
                          />
                        </Form.Item>
                        <Button
                          icon={<MinusCircleOutlined />}
                          onClick={() => remove(field.name)}
                          disabled={loading}
                          className="border-red-200 text-red-500"
                        />
                      </div>
                    ))}
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      icon={<PlusOutlined />}
                      className="w-full rounded-lg"
                      disabled={loading}
                    >
                      Thêm portfolio
                    </Button>
                  </div>
                )}
              </Form.List>

              {/* Social Links */}
              <div>
                <label className="text-gray-700 font-medium mb-3 block">
                  Mạng xã hội
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Form.Item
                    name={["socialLinks", "linkedin"]}
                    className="mb-0"
                    rules={[
                      { type: "url", message: "LinkedIn URL không hợp lệ" },
                    ]}
                  >
                    <Input
                      placeholder="LinkedIn"
                      disabled={loading}
                      className="rounded-lg"
                      prefix={
                        <span className="text-blue-600 font-bold">in</span>
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name={["socialLinks", "github"]}
                    className="mb-0"
                    rules={[
                      { type: "url", message: "GitHub URL không hợp lệ" },
                    ]}
                  >
                    <Input
                      placeholder="GitHub"
                      disabled={loading}
                      className="rounded-lg"
                      prefix={
                        <span className="text-gray-800 font-bold">⚡</span>
                      }
                    />
                  </Form.Item>
                  <Form.Item
                    name={["socialLinks", "website"]}
                    className="mb-0"
                    rules={[
                      { type: "url", message: "Website URL không hợp lệ" },
                    ]}
                  >
                    <Input
                      placeholder="Website"
                      disabled={loading}
                      className="rounded-lg"
                      prefix={<GlobalOutlined className="text-gray-400" />}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Resume */}
              <Form.Item
                name="resumeUrl"
                label="Link CV/Resume"
                rules={[{ type: "url", message: "Vui lòng nhập URL hợp lệ" }]}
              >
                <Input
                  placeholder="https://drive.google.com/your-cv"
                  className="rounded-lg"
                  disabled={loading}
                  prefix={<FileTextOutlined className="text-gray-400" />}
                />
              </Form.Item>
            </div>
          </div>

          {/* Languages Section */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center">
                <GlobalOutlined className="text-orange-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-800 m-0">
                Ngôn ngữ
              </h4>
            </div>

            <Form.List name="languages">
              {(fields, { add, remove }) => (
                <div className="space-y-3">
                  {fields.map((field, idx) => (
                    <div key={field.key} className="flex items-center gap-3">
                      <Form.Item
                        {...field}
                        name={[field.name, "language"]}
                        rules={[
                          { required: true, message: "Nhập tên ngôn ngữ" },
                        ]}
                        className="flex-1 mb-0"
                      >
                        <Input
                          placeholder="Tiếng Việt, English, 日本語..."
                          disabled={loading}
                          className="rounded-lg"
                        />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "proficiency"]}
                        rules={[{ required: true, message: "Chọn trình độ" }]}
                        className="flex-1 mb-0"
                      >
                        <Select
                          placeholder="Trình độ"
                          disabled={loading}
                          className="rounded-lg"
                        >
                          {proficiencyOptions.map((opt) => (
                            <Option key={opt.value} value={opt.value}>
                              <Tag color={opt.color}>{opt.label}</Tag>
                            </Option>
                          ))}
                        </Select>
                      </Form.Item>
                      <Button
                        icon={<MinusCircleOutlined />}
                        onClick={() => remove(field.name)}
                        disabled={loading}
                        className="border-red-200 text-red-500"
                      />
                    </div>
                  ))}
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    icon={<PlusOutlined />}
                    className="w-full h-10 rounded-lg"
                    disabled={loading}
                  >
                    Thêm ngôn ngữ
                  </Button>
                </div>
              )}
            </Form.List>
          </div>

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
              icon={loading ? <LoadingOutlined /> : <SendOutlined />}
              className="flex-1 h-12 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 border-none rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-semibold text-white"
              size="large"
            >
              {loading ? "Đang gửi..." : "Gửi đơn ứng tuyển 🚀"}
            </Button>
          </div>
        </Form>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-2xl border border-green-200 mt-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-lg font-bold">💡</span>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Mẹo để tăng cơ hội được chọn
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Viết lý do ứng tuyển chi tiết và chân thành</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Đính kèm portfolio/CV chất lượng cao</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Liệt kê kỹ năng phù hợp với dự án</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>Thể hiện sự cam kết và nhiệt tình</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ApplyRecruitmentModal;
