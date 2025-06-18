import React, { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { createRecruitment } from '@/services/api/recruitment/recruitment';
import { Form, Input, Select, DatePicker, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

export default function CreateRecruitment() {
    const { user } = useAuthContext();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fileList, setFileList] = useState([]);

    // Check if user is a leader
    if (!user || user.role !== 'leader') {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500">Bạn cần có quyền leader để tạo bài đăng tuyển dụng.</p>
            </div>
        );
    }

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
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Tạo bài đăng tuyển dụng mới</h1>

            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <Form.Item
                    name="title"
                    label="Tiêu đề"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                    <Input placeholder="Nhập tiêu đề bài đăng" />
                </Form.Item>

                <Form.Item
                    name="description"
                    label="Mô tả"
                    rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
                >
                    <TextArea rows={4} placeholder="Nhập mô tả chi tiết" />
                </Form.Item>

                <Form.Item
                    name="workspaceId"
                    label="Workspace ID"
                    rules={[{ required: true, message: 'Vui lòng nhập workspace ID' }]}
                >
                    <Input placeholder="Nhập ID của workspace" />
                </Form.Item>

                <Form.Item
                    name="projectId"
                    label="Project ID (nếu có)"
                >
                    <Input placeholder="Nhập ID của project (nếu có)" />
                </Form.Item>

                <Form.Item
                    name="experienceLevel"
                    label="Cấp độ kinh nghiệm"
                    rules={[{ required: true, message: 'Vui lòng chọn cấp độ' }]}
                >
                    <Select placeholder="Chọn cấp độ">
                        <Option value="junior">Junior</Option>
                        <Option value="mid">Mid-level</Option>
                        <Option value="senior">Senior</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="requiredSkills"
                    label="Kỹ năng yêu cầu"
                    rules={[{ required: true, message: 'Vui lòng chọn ít nhất một kỹ năng' }]}
                >
                    <Select mode="tags" placeholder="Nhập kỹ năng và nhấn Enter">
                        <Option value="javascript">JavaScript</Option>
                        <Option value="react">React</Option>
                        <Option value="nodejs">Node.js</Option>
                        <Option value="python">Python</Option>
                        <Option value="java">Java</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="deadline"
                    label="Hạn chót"
                >
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>

                <Form.Item
                    name="images"
                    label="Hình ảnh"
                >
                    <Upload
                        listType="picture"
                        maxCount={10}
                        fileList={fileList}
                        onChange={({ fileList }) => setFileList(fileList)}
                        beforeUpload={() => false}
                    >
                        <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
                    </Upload>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Tạo bài đăng
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
} 