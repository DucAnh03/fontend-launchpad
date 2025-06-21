import React, { useState, useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { createRecruitment } from '@/services/api/recruitment/recruitment';
import { getMyProjects } from '@/services/api/project';
import { Form, Input, Select, DatePicker, Upload, Button, message, Card, Divider } from 'antd';
import { UploadOutlined, PlusOutlined, RocketOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function CreateRecruitment() {
    const { user } = useAuthContext();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);
    const [projects, setProjects] = useState([]);

    // Check if user is a leader
    if (!user || user.role !== 'leader') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Quyền Truy Cập Bị Từ Chối</h2>
                        <p className="text-red-500 font-medium">Bạn cần có quyền leader để tạo bài đăng tuyển dụng.</p>
                    </div>
                </Card>
            </div>
        );
    }

    // ───────────────────────────────────────────────
    // Lấy projects khi component mount
    useEffect(() => {
        (async () => {
            try {
                const list = await getMyProjects();
                setProjects(list);
            } catch (err) {
                console.error(err);
                message.error('Không load được danh sách project');
            }
        })();
    }, []);

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const fd = new FormData();

            // Các trường cơ bản
            ['title', 'description', 'workspaceId', 'experienceLevel'].forEach(k =>
                fd.append(k, values[k])
            );
            if (values.projectId) fd.append('projectId', values.projectId);

            // convert Dayjs → ISO
            if (values.deadline) fd.append('deadline', values.deadline.toDate().toISOString());

            // skills
            values.requiredSkills.forEach(skill =>
                fd.append('requiredSkills[]', skill)
            );

            // images
            fileList.forEach(f => fd.append('images', f.originFileObj));

            await createRecruitment(fd);
            message.success('Tạo bài đăng thành công');
            form.resetFields();
            setFileList([]);
        } catch (err) {
            message.error(err.response?.data?.message || 'Lỗi tạo bài đăng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6 shadow-2xl">
                        <RocketOutlined className="text-3xl text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                        Tạo Bài Đăng Tuyển Dụng
                    </h1>
                    <p className="text-purple-200 text-lg max-w-2xl mx-auto">
                        Tìm kiếm những tài năng xuất sắc cho dự án của bạn với bài đăng tuyển dụng chuyên nghiệp
                    </p>
                </div>

                {/* Form Card */}
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-2xl overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-6 -m-6 mb-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <PlusOutlined className="mr-3" />
                            Thông Tin Tuyển Dụng
                        </h2>
                    </div>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        className="p-6"
                        size="large"
                    >
                        {/* Basic Information Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <Form.Item
                                name="title"
                                label={
                                    <span className="text-gray-700 font-semibold flex items-center">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                        Tiêu đề
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                            >
                                <Input
                                    placeholder="Nhập tiêu đề bài đăng"
                                    className="rounded-lg border-2 border-gray-200 hover:border-pink-300 focus:border-pink-500 transition-all duration-300"
                                />
                            </Form.Item>

                            <Form.Item
                                name="experienceLevel"
                                label={
                                    <span className="text-gray-700 font-semibold flex items-center">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                        Cấp độ kinh nghiệm
                                    </span>
                                }
                                rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}
                            >
                                <Select
                                    placeholder="Chọn cấp độ"
                                    className="rounded-lg"
                                    dropdownStyle={{ borderRadius: '8px' }}
                                >
                                    <Option value="junior">
                                        <span className="flex items-center">
                                            <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                                            Junior
                                        </span>
                                    </Option>
                                    <Option value="mid">
                                        <span className="flex items-center">
                                            <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
                                            Mid-level
                                        </span>
                                    </Option>
                                    <Option value="senior">
                                        <span className="flex items-center">
                                            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                                            Senior
                                        </span>
                                    </Option>
                                </Select>
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="description"
                            label={
                                <span className="text-gray-700 font-semibold flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    Mô tả chi tiết
                                </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                        >
                            <TextArea
                                rows={6}
                                placeholder="Mô tả chi tiết về vị trí, yêu cầu công việc, môi trường làm việc..."
                                className="rounded-lg border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 transition-all duration-300 resize-none"
                            />
                        </Form.Item>

                        <Divider className="my-8">
                            <span className="text-gray-500 font-medium px-4">Thông Tin Dự Án</span>
                        </Divider>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <Form.Item
                                name="projectId"
                                label={
                                    <span className="text-gray-700 font-semibold flex items-center">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                                        Chọn Project
                                    </span>
                                }
                            >
                                <Select
                                    placeholder="Chọn project cần tuyển"
                                    options={projects.map(p => ({ value: p._id, label: p.name }))}
                                    allowClear
                                    className="rounded-lg"
                                    dropdownStyle={{ borderRadius: '8px' }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="deadline"
                                label={
                                    <span className="text-gray-700 font-semibold flex items-center">
                                        <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                        Hạn chót
                                    </span>
                                }
                            >
                                <DatePicker
                                    showTime
                                    format="YYYY-MM-DD HH:mm"
                                    className="w-full rounded-lg border-2 border-gray-200 hover:border-orange-300 focus:border-orange-500 transition-all duration-300"
                                />
                            </Form.Item>
                        </div>

                        <Form.Item
                            name="requiredSkills"
                            label={
                                <span className="text-gray-700 font-semibold flex items-center">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                                    Kỹ năng yêu cầu
                                </span>
                            }
                            rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kỹ năng' }]}
                        >
                            <Select
                                mode="tags"
                                placeholder="Nhập kỹ năng và nhấn Enter"
                                className="rounded-lg"
                                dropdownStyle={{ borderRadius: '8px' }}
                            >
                                <Option value="javascript">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-yellow-400 rounded mr-2"></span>
                                        JavaScript
                                    </span>
                                </Option>
                                <Option value="react">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-blue-400 rounded mr-2"></span>
                                        React
                                    </span>
                                </Option>
                                <Option value="nodejs">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-green-400 rounded mr-2"></span>
                                        Node.js
                                    </span>
                                </Option>
                                <Option value="python">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-blue-600 rounded mr-2"></span>
                                        Python
                                    </span>
                                </Option>
                                <Option value="java">
                                    <span className="flex items-center">
                                        <span className="w-3 h-3 bg-red-600 rounded mr-2"></span>
                                        Java
                                    </span>
                                </Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="images"
                            label={
                                <span className="text-gray-700 font-semibold flex items-center">
                                    <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                                    Hình ảnh minh họa
                                </span>
                            }
                        >
                            <Upload
                                listType="picture-card"
                                maxCount={10}
                                fileList={fileList}
                                onChange={({ fileList }) => setFileList(fileList)}
                                beforeUpload={() => false}
                                className="rounded-lg"
                            >
                                <div className="flex flex-col items-center justify-center h-24 border-2 border-dashed border-pink-300 rounded-lg hover:border-pink-500 transition-all duration-300">
                                    <UploadOutlined className="text-2xl text-pink-500 mb-2" />
                                    <span className="text-pink-500 font-medium">Chọn hình ảnh</span>
                                </div>
                            </Upload>
                        </Form.Item>

                        <Divider className="my-8" />

                        <Form.Item className="mb-0">
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 border-0 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                                icon={<RocketOutlined />}
                            >
                                {loading ? 'Đang tạo...' : 'Tạo Bài Đăng Tuyển Dụng'}
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        </div>
    );
} 