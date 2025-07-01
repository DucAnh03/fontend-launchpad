import React, { useState } from 'react';
import {
    Modal,
    Form,
    Input,
    Button,
    message,
    Spin
} from 'antd';
import { SendOutlined, LoadingOutlined, PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import api from '@/services/api/axios';
import './ApplyRecruitmentModal.css';

const { TextArea } = Input;

const proficiencyOptions = [
    { label: 'Beginner', value: 'beginner' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Advanced', value: 'advanced' },
    { label: 'Native', value: 'native' },
];

const ApplyRecruitmentModal = ({
    visible,
    onCancel,
    onSuccess,
    postId,
    postTitle
}) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);

            // Get JWT token from localStorage
            const token = localStorage.getItem('token');
            if (!token) {
                message.error('Vui lòng đăng nhập để ứng tuyển');
                setLoading(false);
                return;
            }

            // Prepare request data
            const requestData = {
                reason: values.reason,
                portfolioUrl: values.portfolioUrl,
                portfolioUrls: values.portfolioUrls?.filter(Boolean) || [],
                socialLinks: values.socialLinks || {},
                resumeUrl: values.resumeUrl,
                languages: values.languages?.filter(l => l && l.language) || [],
            };

            // Make API request
            const response = await api.post(
                `/recruitment-posts/${postId}/applications`,
                requestData,
            );

            if (response.status === 200 || response.status === 201) {
                message.success('Đã gửi đơn ứng tuyển thành công!');
                form.resetFields();
                onSuccess && onSuccess();
                onCancel();
            } else {
                message.error('Có lỗi xảy ra khi gửi đơn ứng tuyển');
            }
        } catch (error) {
            console.error('Apply recruitment error:', error);

            if (error.response) {
                // Server responded with error status
                const errorMessage = error.response.data?.message || 'Có lỗi xảy ra khi gửi đơn ứng tuyển';
                message.error(errorMessage);
            } else if (error.request) {
                // Network error
                message.error('Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
            } else {
                // Other errors
                message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
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
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                        <SendOutlined className="text-white text-sm" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 m-0">
                            Ứng tuyển
                        </h3>
                        {postTitle && (
                            <p className="text-sm text-gray-500 m-0 mt-1">
                                {postTitle}
                            </p>
                        )}
                    </div>
                </div>
            }
            open={visible}
            onCancel={handleCancel}
            footer={null}
            width={600}
            className="apply-recruitment-modal"
            maskClosable={!loading}
            closable={!loading}
        >
            <div className="py-4">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    className="apply-form"
                >
                    {/* Reason Field */}
                    <Form.Item
                        name="reason"
                        label={
                            <span className="text-gray-700 font-medium">
                                Lý do ứng tuyển <span className="text-red-500">*</span>
                            </span>
                        }
                        rules={[
                            {
                                required: true,
                                message: 'Vui lòng nhập lý do ứng tuyển'
                            },
                            {
                                min: 10,
                                message: 'Lý do ứng tuyển phải có ít nhất 10 ký tự'
                            },
                            {
                                max: 1000,
                                message: 'Lý do ứng tuyển không được quá 1000 ký tự'
                            }
                        ]}
                    >
                        <TextArea
                            placeholder="Hãy chia sẻ lý do bạn muốn ứng tuyển vào vị trí này..."
                            rows={6}
                            className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200 resize-none"
                            disabled={loading}
                        />
                    </Form.Item>

                    {/* Portfolio Url Field */}
                    <Form.Item
                        name="portfolioUrl"
                        label={
                            <span className="text-gray-700 font-medium">
                                Link Portfolio (cũ, tuỳ chọn)
                            </span>
                        }
                        rules={[
                            {
                                type: 'url',
                                message: 'Vui lòng nhập URL hợp lệ'
                            }
                        ]}
                    >
                        <Input
                            placeholder="https://your-portfolio.com hoặc https://github.com/your-username"
                            className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                            disabled={loading}
                        />
                    </Form.Item>

                    {/* Portfolio Urls Field */}
                    <Form.List name="portfolioUrls">
                        {(fields, { add, remove }) => (
                            <div>
                                <label className="text-gray-700 font-medium">Các link Portfolio khác (có thể thêm nhiều link)</label>
                                {fields.map((field, idx) => (
                                    <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name]}
                                            rules={[{ type: 'url', message: 'Vui lòng nhập URL hợp lệ' }]}
                                            style={{ flex: 1, marginBottom: 0 }}
                                        >
                                            <Input placeholder={`Portfolio link #${idx + 1}`} disabled={loading} />
                                        </Form.Item>
                                        <Button
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => remove(field.name)}
                                            disabled={loading}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                    style={{ width: '100%' }}
                                    disabled={loading}
                                >
                                    Thêm link Portfolio
                                </Button>
                            </div>
                        )}
                    </Form.List>

                    {/* Social Links Field */}
                    <Form.Item label={<span className="text-gray-700 font-medium">Mạng xã hội (tuỳ chọn)</span>} style={{ marginBottom: 0 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <Form.Item name={['socialLinks', 'linkedin']} noStyle rules={[{ type: 'url', message: 'LinkedIn không hợp lệ' }]}>
                                <Input style={{ width: '33%' }} placeholder="LinkedIn" disabled={loading} />
                            </Form.Item>
                            <Form.Item name={['socialLinks', 'github']} noStyle rules={[{ type: 'url', message: 'Github không hợp lệ' }]}>
                                <Input style={{ width: '33%' }} placeholder="Github" disabled={loading} />
                            </Form.Item>
                            <Form.Item name={['socialLinks', 'website']} noStyle rules={[{ type: 'url', message: 'Website không hợp lệ' }]}>
                                <Input style={{ width: '34%' }} placeholder="Website" disabled={loading} />
                            </Form.Item>
                        </div>
                    </Form.Item>

                    {/* Resume Url Field */}
                    <Form.Item
                        name="resumeUrl"
                        label={
                            <span className="text-gray-700 font-medium">
                                Link CV/Resume (tuỳ chọn)
                            </span>
                        }
                        rules={[
                            {
                                type: 'url',
                                message: 'Vui lòng nhập URL hợp lệ'
                            }
                        ]}
                    >
                        <Input
                            placeholder="https://drive.google.com/your-cv"
                            className="rounded-lg border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
                            disabled={loading}
                        />
                    </Form.Item>

                    {/* Languages Field */}
                    <Form.List name="languages">
                        {(fields, { add, remove }) => (
                            <div>
                                <label className="text-gray-700 font-medium">Ngôn ngữ & trình độ (có thể thêm nhiều)</label>
                                {fields.map((field, idx) => (
                                    <div key={field.key} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'language']}
                                            rules={[{ required: true, message: 'Nhập tên ngôn ngữ' }]}
                                            style={{ flex: 2, marginBottom: 0 }}
                                        >
                                            <Input placeholder={`Ngôn ngữ #${idx + 1}`} disabled={loading} />
                                        </Form.Item>
                                        <Form.Item
                                            {...field}
                                            name={[field.name, 'proficiency']}
                                            rules={[{ required: true, message: 'Chọn trình độ' }]}
                                            style={{ flex: 2, marginBottom: 0 }}
                                        >
                                            <Input as="select" list="proficiencyOptions" placeholder="Trình độ" disabled={loading} />
                                            <datalist id="proficiencyOptions">
                                                {proficiencyOptions.map(opt => (
                                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                                ))}
                                            </datalist>
                                        </Form.Item>
                                        <Button
                                            icon={<MinusCircleOutlined />}
                                            onClick={() => remove(field.name)}
                                            disabled={loading}
                                        />
                                    </div>
                                ))}
                                <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    icon={<PlusOutlined />}
                                    style={{ width: '100%' }}
                                    disabled={loading}
                                >
                                    Thêm ngôn ngữ
                                </Button>
                            </div>
                        )}
                    </Form.List>

                    {/* Submit Button */}
                    <Form.Item className="mb-0">
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="default"
                                onClick={handleCancel}
                                disabled={loading}
                                className="flex-1 h-12 rounded-lg border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-700 transition-all duration-200"
                            >
                                Hủy
                            </Button>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                disabled={loading}
                                icon={loading ? <LoadingOutlined /> : <SendOutlined />}
                                className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none rounded-lg shadow-md transition-all duration-200"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
                            </Button>
                        </div>
                    </Form.Item>
                </Form>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">i</span>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-blue-900 mb-1">
                                Lưu ý khi ứng tuyển
                            </h4>
                            <ul className="text-xs text-blue-700 space-y-1">
                                <li>• Hãy viết lý do ứng tuyển một cách chân thành và chi tiết</li>
                                <li>• Nếu có portfolio, hãy đảm bảo link hoạt động và cập nhật</li>
                                <li>• Đơn ứng tuyển sẽ được gửi đến leader của bài đăng</li>
                                <li>• Bạn có thể theo dõi trạng thái đơn ứng tuyển trong trang cá nhân</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ApplyRecruitmentModal; 