import React, { useEffect, useState } from "react";
import api from "@/services/api/axios";
import { Card, Button, Input, Modal, Form, message, Popconfirm, Tooltip, Tag, Radio, Switch, InputNumber } from "antd";
import { useAuthContext } from "@/contexts/AuthContext";
import { EditOutlined, DeleteOutlined, UserOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export default function WorkspacePage() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);
  const { user } = useAuthContext();
  const navigate = useNavigate();

  // State cho edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingWorkspace, setEditingWorkspace] = useState(null);
  const [editForm] = Form.useForm();
  const [editLoading, setEditLoading] = useState(false);

  // State cho create modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    fetchWorkspaces();
    // eslint-disable-next-line
  }, []);

  async function fetchWorkspaces() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/workspaces/my");
      setWorkspaces(res.data.data);
    } catch (err) {
      setError("Không thể tải danh sách workspace.");
    } finally {
      setLoading(false);
    }
  }

  // Search workspace
  async function handleSearch(value) {
    setSearch(value);
    if (!value) {
      fetchWorkspaces();
      return;
    }
    setSearching(true);
    try {
      const res = await api.get(`/workspaces/search?keyword=${encodeURIComponent(value)}`);
      setWorkspaces(res.data.data);
    } catch (err) {
      message.error("Không tìm thấy workspace phù hợp.");
    } finally {
      setSearching(false);
    }
  }

  // Kiểm tra user hiện tại có phải leader của workspace không
  const isLeader = (ws) => ws.leaderId === user._id || ws.leaderId?._id === user._id;

  // Xử lý xóa workspace
  const handleDelete = async (workspaceId) => {
    try {
      await api.delete(`/workspaces/${workspaceId}`);
      console.log('Xóa workspace thành công:', workspaceId);
      fetchWorkspaces();
    } catch (err) {
      console.error('Lỗi xóa workspace:', err);
      message.error(err?.response?.data?.message || "Xóa workspace thất bại!");
    }
  };

  // Xử lý mở modal sửa
  const openEditModal = (ws) => {
    setEditingWorkspace(ws);
    editForm.setFieldsValue({
      name: ws.name,
      description: ws.description,
      maxMembers: ws.maxMembers,
      isPublic: ws.isPublic,
      allowInvite: ws.allowInvite,
    });
    setEditModalOpen(true);
  };

  // Xử lý submit sửa
  const handleEditSubmit = async (values) => {
    setEditLoading(true);
    try {
      await api.put(`/workspaces/${editingWorkspace._id}`, values);
      message.success("Cập nhật workspace thành công!");
      setEditModalOpen(false);
      fetchWorkspaces();
    } catch (err) {
      message.error(err?.response?.data?.message || "Cập nhật workspace thất bại!");
    } finally {
      setEditLoading(false);
    }
  };

  // Xử lý tạo workspace mới
  const handleCreateWorkspace = async (values) => {
    setCreateLoading(true);
    try {
      await api.post("/workspaces", values);
      message.success("Tạo workspace thành công!");
      setCreateModalOpen(false);
      createForm.resetFields();
      fetchWorkspaces();
    } catch (err) {
      message.error(err?.response?.data?.message || "Tạo workspace thất bại!");
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading) return <div className="text-center p-20">Đang tải...</div>;
  if (error) return <div className="text-center p-20 text-red-600">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <Card
        title={<span className="text-2xl font-bold text-blue-700">Workspace của bạn</span>}
        className="shadow-2xl rounded-2xl max-w-screen-xl mx-auto"
        headStyle={{ fontSize: '1.25rem', fontWeight: 'bold', borderBottom: '2px solid #f0f0f0', background: "#f5faff" }}
        bodyStyle={{ background: "#fafdff" }}
        extra={
          <div className="flex items-center gap-2">
            <Button type="primary" onClick={() => setCreateModalOpen(true)}>
              + Tạo workspace
            </Button>
            <Input.Search
              allowClear
              placeholder="Tìm kiếm workspace theo tên hoặc thành viên..."
              onSearch={handleSearch}
              loading={searching}
              style={{ width: 320 }}
            />
          </div>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {workspaces.map((ws) => (
            <div
              key={ws._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-200 p-6 flex flex-col justify-between border border-gray-100 cursor-pointer"
              onClick={() => navigate(`/dashboard/workspace/${ws._id}/projects`)}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-blue-800">{ws.name}</h3>
                  <Tag color={ws.isPublic ? "blue" : "default"} className="ml-2">
                    {ws.isPublic ? "Công khai" : "Riêng tư"}
                  </Tag>
                </div>
                <p className="text-gray-600 mb-3 min-h-[48px]">{ws.description || <span className="italic text-gray-400">Chưa có mô tả</span>}</p>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <UserOutlined />
                  <span>
                    Leader: {ws.leaderId?.name || ws.leaderId?.username || "?"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                  <TeamOutlined />
                  <span>
                    Thành viên: {ws.members?.length || 1}
                  </span>
                  {isLeader(ws) && (
                    <Tooltip title="Bạn là trưởng workspace">
                      <span className="ml-1 text-green-500 font-bold">(Leader)</span>
                    </Tooltip>
                  )}
                </div>
              </div>
              {isLeader(ws) && (
                <div className="flex gap-2 mt-4 justify-end">
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    size="small"
                    className="rounded-lg"
                    onClick={e => {
                      e.stopPropagation();
                      openEditModal(ws);
                    }}
                  >
                    Sửa
                  </Button>
                  <Button
                    type="primary"
                    danger
                    icon={<DeleteOutlined />}
                    size="small"
                    className="rounded-lg"
                    onClick={e => {
                      e.stopPropagation();
                      Modal.confirm({
                        title: "Bạn chắc chắn muốn xóa workspace này?",
                        onOk: () => handleDelete(ws._id),
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
        title={<span className="text-lg font-bold">Chỉnh sửa Workspace</span>}
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
            label="Tên workspace"
            rules={[{ required: true, message: "Vui lòng nhập tên workspace!" }]}
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
            name="maxMembers"
            label="Số thành viên tối đa"
          >
            <InputNumber min={1} max={100} className="rounded-lg w-full" />
          </Form.Item>
          <Form.Item
            name="isPublic"
            label="Chế độ workspace"
            rules={[{ required: true, message: "Vui lòng chọn chế độ workspace!" }]}
          >
            <Radio.Group>
              <Radio value={true}>Công khai</Radio>
              <Radio value={false}>Riêng tư</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ minWidth: 170 }}>Cho phép mời thành viên</span>
              <Form.Item
                name="allowInvite"
                valuePropName="checked"
                noStyle
              >
                <Switch checkedChildren="Có" unCheckedChildren="Không" />
              </Form.Item>
            </div>
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

      {/* Create Workspace Modal */}
      <Modal
        title={<span className="text-lg font-bold">Tạo Workspace mới</span>}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        destroyOnClose
        className="rounded-xl"
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateWorkspace}
        >
          <Form.Item
            name="name"
            label="Tên workspace"
            rules={[{ required: true, message: "Vui lòng nhập tên workspace!" }]}
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
            name="maxMembers"
            label="Số thành viên tối đa"
            rules={[
              { required: true, message: "Vui lòng nhập số thành viên tối đa!" },
              { type: 'number', min: 1, max: 100, message: "Số thành viên tối đa phải từ 1 đến 100" }
            ]}
          >
            <InputNumber
              min={1}
              max={100}
              className="rounded-lg w-full"
              placeholder="Nhập số từ 1 đến 100"
              parser={value => Math.max(1, Math.min(Number(value), 100))}
            />
          </Form.Item>
          <Form.Item
            name="isPublic"
            label="Chế độ workspace"
            initialValue={true}
            rules={[{ required: true, message: "Vui lòng chọn chế độ workspace!" }]}
          >
            <Radio.Group>
              <Radio value={true}>Công khai</Radio>
              <Radio value={false}>Riêng tư</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            name="allowInvite"
            label="Cho phép mời thành viên"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="Có" unCheckedChildren="Không" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              className="w-full rounded-lg"
            >
              Tạo workspace
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
