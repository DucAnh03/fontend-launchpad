import React, { useEffect, useState } from "react";
import api from "@/services/api/axios";
import { Card, Button, Modal, Form, Input, Select, message, Popconfirm, Tag, Tooltip } from "antd";
import { useAuthContext } from "@/contexts/AuthContext";
import { EditOutlined, DeleteOutlined, CalendarOutlined, CheckCircleOutlined, HourglassOutlined, StopOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const statusColor = {
  planning: "default",
  active: "processing",
  completed: "success",
  archived: "warning",
};

const statusLabel = {
  planning: "Lên kế hoạch",
  active: "Đang thực hiện",
  completed: "Hoàn thành",
  archived: "Lưu trữ",
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // State cho edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, []);

  async function fetchProjects() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/projects/my");
      setProjects(res.data.data);
    } catch (err) {
      setError("Không thể tải danh sách project.");
    } finally {
      setLoading(false);
    }
  }

  // Search project
  async function handleSearch(value) {
    setSearch(value);
    if (!value) {
      fetchProjects();
      return;
    }
    setSearching(true);
    try {
      const res = await api.get(`/projects/search?keyword=${encodeURIComponent(value)}`);
      setProjects(res.data.data);
    } catch (err) {
      message.error("Không tìm thấy project phù hợp.");
    } finally {
      setSearching(false);
    }
  }

  // Kiểm tra user hiện tại có phải leader của project không
  const isLeader = (project) => {
    const leader = project.members.find(m => m.role === "leader");
    return leader && (leader.userId === user._id || leader.userId?._id === user._id);
  };

  // Xử lý xóa project
  const handleDelete = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      message.success("Đã xóa project thành công!");
      fetchProjects();
    } catch (err) {
      message.error(err?.response?.data?.message || "Xóa project thất bại!");
    }
  };

  // Xử lý mở modal sửa
  const openEditModal = (project) => {
    setEditingProject(project);
    editForm.setFieldsValue({
      name: project.name,
      description: project.description,
      status: project.status,
    });
    setEditModalOpen(true);
  };

  // Xử lý submit sửa
  const handleEditSubmit = async (values) => {
    setEditLoading(true);
    try {
      await api.put(`/projects/${editingProject._id}`, values);
      message.success("Cập nhật project thành công!");
      setEditModalOpen(false);
      fetchProjects();
    } catch (err) {
      message.error(err?.response?.data?.message || "Cập nhật project thất bại!");
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) return <div className="text-center p-20">Đang tải...</div>;
  if (error) return <div className="text-center p-20 text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card
        title={<span className="text-2xl font-bold text-blue-700">Các project bạn tham gia</span>}
        className="shadow-2xl rounded-2xl max-w-screen-xl mx-auto"
        headStyle={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', background: "#f5faff" }}
        bodyStyle={{ background: "#fafdff" }}
        extra={
          <Input.Search
            allowClear
            placeholder="Tìm kiếm project theo tên hoặc thành viên..."
            onSearch={handleSearch}
            loading={searching}
            style={{ width: 320 }}
          />
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 p-6 flex flex-col justify-between border border-gray-100"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3
                    className="text-xl font-bold text-blue-800 cursor-pointer hover:underline"
                    onClick={() => navigate(`/dashboard/projects/${project._id}/tasks`)}
                  >
                    {project.name}
                  </h3>
                  <Tag color={statusColor[project.status] || "default"} className="ml-2">
                    {statusLabel[project.status] || project.status}
                  </Tag>
                </div>
                <p className="text-gray-600 mb-3 min-h-[48px]">{project.description || <span className="italic text-gray-400">Chưa có mô tả</span>}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <CalendarOutlined />
                  <span>
                    Ngày bắt đầu:{" "}
                    {project.startDate
                      ? new Date(project.startDate).toLocaleDateString()
                      : <span className="italic text-gray-400">Chưa có</span>}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <span>
                    Thành viên:{" "}
                    {project.members?.length || 1}
                  </span>
                  {isLeader(project) && (
                    <Tooltip title="Bạn là trưởng nhóm">
                      <span className="ml-1 text-green-500 font-bold">(Leader)</span>
                    </Tooltip>
                  )}
                </div>
              </div>
              {isLeader(project) && (
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    className="rounded-lg"
                    onClick={() => openEditModal(project)}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    className="rounded-lg"
                    onClick={() => {
                      Modal.confirm({
                        title: "Bạn chắc chắn muốn xóa project này?",
                        onOk: () => handleDelete(project._id),
                        okText: "Xóa",
                        cancelText: "Hủy",
                      });
                    }}
                  >
                    Xóa
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Edit Modal */}
      <Modal
        title={<span className="text-lg font-bold">Chỉnh sửa Project</span>}
        open={editModalOpen}
        onCancel={() => setEditModalOpen(false)}
        footer={null}
        destroyOnClose
        className="rounded-xl"
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditSubmit}
        >
          <Form.Item
            name="name"
            label="Tên project"
            rules={[{ required: true, message: "Vui lòng nhập tên project!" }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea rows={3} className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Select className="rounded-lg">
              <Option value="planning">
                <HourglassOutlined /> Lên kế hoạch
              </Option>
              <Option value="active">
                <CheckCircleOutlined /> Đang thực hiện
              </Option>
              <Option value="completed">
                <CheckCircleOutlined /> Hoàn thành
              </Option>
              <Option value="archived">
                <StopOutlined /> Lưu trữ
              </Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={editLoading}
              className="w-full rounded-lg"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
