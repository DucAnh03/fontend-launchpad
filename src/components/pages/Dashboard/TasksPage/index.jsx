import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "@/services/api/axios";
import { Card, Tag, Spin, message, Button, Modal, Form, Input, Select, Radio } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAuthContext } from "@/contexts/AuthContext";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { getProjectMembers, IProjectMember } from '@/services/api/project';

const { Option } = Select;

const statusColor = {
  todo: "default",
  doing: "processing",
  done: "success",
};

export default function TasksPage() {
  const { projectId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);
  const { user } = useAuthContext();
  const [members, setMembers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchMembers();
    // eslint-disable-next-line
  }, [projectId]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data.data);
    } catch (err) {
      message.error("Không thể tải danh sách task.");
    } finally {
      setLoading(false);
    }
  }

  async function fetchMembers() {
    try {
      const res = await getProjectMembers(projectId);
      setMembers(res);
    } catch (err) {
      setMembers([]);
    }
  }

  // Xử lý mở modal sửa
  const openEditModal = (task) => {
    setEditingTask(task);
    editForm.setFieldsValue({
      name: task.name,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : undefined,
    });
    setEditModalOpen(true);
  };

  // Xử lý submit sửa
  const handleEditSubmit = async (values) => {
    setEditLoading(true);
    try {
      await api.put(`/tasks/${editingTask._id}`, values);
      message.success("Cập nhật task thành công!");
      setEditModalOpen(false);
      fetchTasks();
    } catch (err) {
      message.error(err?.response?.data?.message || "Cập nhật task thất bại!");
    } finally {
      setEditLoading(false);
    }
  };

  // Xử lý xóa task
  const handleDelete = async (taskId) => {
    Modal.confirm({
      title: "Bạn chắc chắn muốn xóa task này?",
      onOk: async () => {
        try {
          await api.delete(`/tasks/${taskId}`);
          message.success("Đã xóa task thành công!");
          fetchTasks();
        } catch (err) {
          message.error(err?.response?.data?.message || "Xóa task thất bại!");
        }
      },
      okText: "Xóa",
      cancelText: "Hủy",
    });
  };

  // Lấy danh sách member khi mở modal tạo task
  const openCreateModal = () => {
    createForm.resetFields();
    setCreateModalOpen(true);
  };

  // Xử lý submit tạo task
  const handleCreateSubmit = async (values) => {
    setCreateLoading(true);
    try {
      await api.post(`/projects/${projectId}/tasks`, {
        ...values,
        reporterId: user._id,
        assigneeId: values.assigneeId || undefined,
      });
      message.success("Tạo task thành công!");
      setCreateModalOpen(false);
      fetchTasks();
    } catch (err) {
      message.error(err?.response?.data?.message || "Tạo task thất bại!");
    } finally {
      setCreateLoading(false);
    }
  };

  // Thêm hàm xử lý kéo thả
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    // Nếu kéo sang cột khác
    if (source.droppableId !== destination.droppableId) {
      const taskId = draggableId;
      const newStatus = destination.droppableId;
      try {
        await api.put(`/tasks/${taskId}`, { status: newStatus });
        // Cập nhật lại danh sách task
        fetchTasks();
      } catch (err) {
        message.error('Cập nhật trạng thái task thất bại!');
      }
    }
  };

  // Hàm kiểm tra user hiện tại có phải leader của project không
  const isLeader = () => {
    return members.some(m => {
      const memberId = typeof m.userId === 'object' ? m.userId._id : m.userId;
      return String(memberId) === String(user._id) && m.role === 'leader';
    });
  };

  // Search task by name
  async function handleSearch(value) {
    setSearch(value);
    if (!value) {
      fetchTasks();
      return;
    }
    setSearching(true);
    try {
      const res = await api.get(`/projects/${projectId}/tasks/search?name=${encodeURIComponent(value)}`);
      setTasks(res.data.data);
    } catch (err) {
      message.error("Không tìm thấy task phù hợp.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card
        title={
          <div className="flex items-center justify-between gap-2">
            <span className="text-2xl font-bold text-blue-700">Danh sách Task của Project</span>
            <div className="flex items-center gap-2">
              <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
                Tạo task
              </Button>
              <Input.Search
                allowClear
                placeholder="Tìm kiếm task theo tên..."
                onSearch={handleSearch}
                loading={searching}
                style={{ width: 320 }}
              />
            </div>
          </div>
        }
        className="shadow-2xl rounded-2xl max-w-6xl mx-auto"
        headStyle={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', background: "#f5faff" }}
        bodyStyle={{ background: "#fafdff" }}
      >
        {loading ? (
          <div className="text-center py-10"><Spin size="large" /></div>
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 justify-between">
              {/* Kanban Columns */}
              {['todo', 'doing', 'done'].map(status => (
                <Droppable droppableId={status} key={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-1 bg-white rounded-xl shadow-md p-4 min-h-[400px] flex flex-col"
                      style={{
                        background: snapshot.isDraggingOver ? '#e6f7ff' : 'white',
                        transition: 'background 0.2s',
                      }}
                    >
                      <div className="text-lg font-bold mb-4 text-center" style={{ color: status === 'todo' ? '#888' : status === 'doing' ? '#faad14' : '#52c41a' }}>
                        {status === 'todo' && '📝 Chưa làm'}
                        {status === 'doing' && '⏳ Đang làm'}
                        {status === 'done' && '✅ Hoàn thành'}
                      </div>
                      <div className="flex-1 flex flex-col gap-4">
                        {tasks.filter(task => task.status === status).length === 0 ? (
                          <div className="text-center text-gray-300 italic">Không có task</div>
                        ) : (
                          tasks.filter(task => task.status === status).map((task, idx) => (
                            <Draggable draggableId={task._id} index={idx} key={task._id}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  style={{
                                    ...provided.draggableProps.style,
                                    opacity: snapshot.isDragging ? 0.7 : 1,
                                  }}
                                >
                                  <Card
                                    className="rounded-2xl shadow border border-gray-100"
                                    bodyStyle={{ padding: 16 }}
                                    headStyle={{ borderBottom: "none" }}
                                    actions={
                                      isLeader()
                                        ? [
                                            <Button
                                              type="primary"
                                              icon={<EditOutlined />}
                                              size="small"
                                              className="rounded-lg"
                                              onClick={() => openEditModal(task)}
                                            >Sửa</Button>,
                                            <Button
                                              type="primary"
                                              danger
                                              icon={<DeleteOutlined />}
                                              size="small"
                                              className="rounded-lg"
                                              onClick={() => handleDelete(task._id)}
                                            >Xóa</Button>
                                          ]
                                        : []
                                    }
                                  >
                                    <div className="font-bold text-base text-blue-800 mb-1">{task.name}</div>
                                    <div className="text-gray-600 mb-1">{task.description}</div>
                                    <div className="text-sm text-gray-500 mb-1">
                                      Người được giao: <b>{task.assigneeId?.name || "(Chưa gán)"}</b> | Người tạo: <b>{task.reporterId?.name || "(Ẩn)"}</b>
                                    </div>
                                    <div className="flex items-center gap-2 mb-1">
                                      <Tag color={statusColor[task.status] || "default"}>{task.status}</Tag>
                                      <Tag color={task.priority === "high" ? "red" : task.priority === "medium" ? "orange" : "green"}>{task.priority}</Tag>
                                    </div>
                                    {task.dueDate && <span className="text-xs text-gray-400">Hạn: {new Date(task.dueDate).toLocaleDateString()}</span>}
                                  </Card>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </DragDropContext>
        )}
      </Card>

      {/* Create Task Modal */}
      <Modal
        title={<span className="text-lg font-bold">Tạo Task mới</span>}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        className="rounded-xl"
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="name"
            label="Tên task"
            rules={[{ required: true, message: "Vui lòng nhập tên task!" }]}
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
            initialValue="todo"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
          >
            <Radio.Group className="w-full flex gap-4">
              <Radio.Button value="todo">Chưa làm</Radio.Button>
              <Radio.Button value="doing">Đang làm</Radio.Button>
              <Radio.Button value="done">Hoàn thành</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            initialValue="medium"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên!" }]}
          >
            <Radio.Group className="w-full flex gap-4">
              <Radio.Button value="high">Cao</Radio.Button>
              <Radio.Button value="medium">Trung bình</Radio.Button>
              <Radio.Button value="low">Thấp</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Hạn chót"
          >
            <Input type="datetime-local" className="rounded-lg" />
          </Form.Item>
          <Form.Item
            name="assigneeId"
            label="Người được giao"
          >
            <Radio.Group className="w-full flex flex-col gap-2">
              {members.map(m => (
                <Radio.Button key={m.userId._id} value={m.userId._id} className="text-left w-full">
                  {m.userId.name} ({m.userId.username})
                  {m.role === 'leader' && ' ⭐'}
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              className="w-full rounded-lg"
            >
              Tạo task
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal giữ nguyên như trước */}
      <Modal
        title={<span className="text-lg font-bold">Chỉnh sửa Task</span>}
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
            label="Tên task"
            rules={[{ required: true, message: "Vui lòng nhập tên task!" }]}
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
            <Radio.Group className="w-full flex gap-4">
              <Radio.Button value="todo">Chưa làm</Radio.Button>
              <Radio.Button value="doing">Đang làm</Radio.Button>
              <Radio.Button value="done">Hoàn thành</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="priority"
            label="Độ ưu tiên"
            rules={[{ required: true, message: "Vui lòng chọn độ ưu tiên!" }]}
          >
            <Radio.Group className="w-full flex gap-4">
              <Radio.Button value="high">Cao</Radio.Button>
              <Radio.Button value="medium">Trung bình</Radio.Button>
              <Radio.Button value="low">Thấp</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="dueDate"
            label="Hạn chót"
          >
            <Input type="datetime-local" className="rounded-lg" />
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
