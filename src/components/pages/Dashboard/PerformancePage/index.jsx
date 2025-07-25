import React, { useEffect, useState } from "react";
import {
  Card,
  List,
  Avatar,
  Tag,
  Spin,
  Typography,
  Statistic,
  Row,
  Col,
  Empty,
  Tooltip,
  Button,
} from "antd";
import { getMyProjects, getProjectMembers } from "@/services/api/project";
import api from "@/services/api/axios";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/AuthContext";

export default function PerformancePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthContext();

  useEffect(() => {
    async function fetchProjectsAndMembers() {
      setLoading(true);
      try {
        const projectsData = await getMyProjects();
        // Lấy thành viên và task cho từng project
        const projectsWithDetails = await Promise.all(
          projectsData.map(async (project) => {
            let members = [];
            let tasks = [];
            try {
              members = await getProjectMembers(project._id);
            } catch (e) {
              members = [];
            }
            try {
              const res = await api.get(`/projects/${project._id}/tasks`);
              tasks = res.data.data;
            } catch (e) {
              tasks = [];
            }
            return { ...project, members, tasks };
          })
        );
        setProjects(projectsWithDetails);
      } catch (err) {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProjectsAndMembers();
  }, []);

  // Helper: Lấy các task trễ deadline
  function getOverdueTasks(tasks) {
    const now = new Date();
    return tasks.filter(
      (task) =>
        task.status !== "done" && task.dueDate && new Date(task.dueDate) < now
    );
  }
  // Helper: Đếm số task hoàn thành
  function countCompletedTasks(tasks) {
    return tasks.filter((task) => task.status === "done").length;
  }

  // Kiểm tra user hiện tại có phải leader của project không
  function isLeader(project) {
    return project.members.some((m) => {
      const memberId = typeof m.userId === "object" ? m.userId._id : m.userId;
      return String(memberId) === String(user._id) && m.role === "leader";
    });
  }

  // Hàm loại member khỏi project
  async function handleRemoveMember(projectId, memberId) {
    try {
      await api.delete(`/projects/${projectId}/members/${memberId}`);
      // Sau khi xóa member, cập nhật tất cả task của project có assigneeId là memberId thành chưa gán
      await api.put(`/projects/${projectId}/tasks/unassign-member`, {
        memberId,
      });
      // Reload lại dữ liệu
      setProjects((projects) =>
        projects.map((p) =>
          p._id === projectId
            ? {
                ...p,
                tasks: p.tasks.map((t) =>
                  t.assigneeId?._id === memberId
                    ? { ...t, assigneeId: null }
                    : t
                ),
                members: p.members.filter((m) => m.userId._id !== memberId),
              }
            : p
        )
      );
    } catch (err) {
      // Có thể show message lỗi
    }
  }

  return (
    <div className="p-4 min-h-screen bg-gray-50">
      <Card
        title={
          <span className="text-2xl font-bold text-blue-700">
            Hiệu suất các dự án
          </span>
        }
        className="shadow-2xl rounded-2xl max-w-screen-xl mx-auto"
        headStyle={{
          fontSize: "1.25rem",
          fontWeight: "bold",
          borderBottom: "2px solid #f0f0f0",
          background: "#f5faff",
        }}
        bodyStyle={{ background: "#fafdff" }}
      >
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" /> Đang tải...
          </div>
        ) : projects.length === 0 ? (
          <Empty description="Bạn chưa tham gia dự án nào" className="my-12" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => {
              const overdueTasks = getOverdueTasks(project.tasks);
              const completedCount = countCompletedTasks(project.tasks);
              return (
                <Card
                  key={project._id}
                  title={
                    <span className="text-lg font-bold text-blue-700">
                      {project.name}
                    </span>
                  }
                  className="mb-2 shadow-lg rounded-2xl border border-gray-100 bg-white flex flex-col justify-between"
                  headStyle={{
                    background: "#f5faff",
                    borderRadius: "16px 16px 0 0",
                    fontWeight: 700,
                  }}
                  bodyStyle={{
                    minHeight: 180,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Row gutter={16} className="mb-2">
                    <Col span={12}>
                      <Statistic
                        title={
                          <span className="font-medium text-gray-600">
                            Số task hoàn thành
                          </span>
                        }
                        value={completedCount}
                        prefix={
                          <CheckCircleOutlined style={{ color: "#52c41a" }} />
                        }
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title={
                          <span className="font-medium text-gray-600">
                            Số task trễ deadline
                          </span>
                        }
                        value={overdueTasks.length}
                        valueStyle={{
                          color: overdueTasks.length > 0 ? "#ff4d4f" : "#222",
                        }}
                        prefix={
                          <ExclamationCircleOutlined
                            style={{ color: "#ff4d4f" }}
                          />
                        }
                      />
                    </Col>
                  </Row>
                  <div className="mb-2">
                    <Typography.Text strong className="block mb-1">
                      Thành viên:
                    </Typography.Text>
                    <div className="flex flex-wrap gap-2">
                      {project.members.length === 0 ? (
                        <span className="text-gray-400 italic">
                          Không có thành viên
                        </span>
                      ) : (
                        project.members
                          .filter(
                            (member) =>
                              member && member.userId && member.userId.username
                          )
                          .map((member) => (
                            <Tooltip
                              title={member.userId.username}
                              key={member.userId._id}
                            >
                              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-sm font-medium">
                                <Avatar
                                  size={24}
                                  src={member.userId.avatar}
                                  icon={<UserOutlined />}
                                  className="mr-1"
                                  style={{
                                    background:
                                      member.role === "leader"
                                        ? "#52c41a"
                                        : "#1890ff",
                                    color: "#fff",
                                  }}
                                >
                                  {member.userId.name?.[0]}
                                </Avatar>
                                {member.userId.name}
                                <Tag
                                  color={
                                    member.role === "leader" ? "green" : "blue"
                                  }
                                  className="ml-1"
                                  style={{ marginLeft: 4 }}
                                >
                                  {member.role === "leader"
                                    ? "Leader"
                                    : "Member"}
                                </Tag>
                              </span>
                            </Tooltip>
                          ))
                      )}
                    </div>
                  </div>
                  {overdueTasks.length > 0 && (
                    <div className="mt-2 p-3 rounded-xl bg-red-50 border border-red-200">
                      <Typography.Text
                        strong
                        className="text-red-600 block mb-2"
                      >
                        <ExclamationCircleOutlined /> Người bị trễ deadline:
                      </Typography.Text>
                      <List
                        dataSource={overdueTasks}
                        locale={{
                          emptyText: (
                            <span className="text-gray-400 italic">
                              Không có task trễ deadline
                            </span>
                          ),
                        }}
                        renderItem={(task) => {
                          const member = project.members.find(
                            (m) => m.userId._id === task.assigneeId?._id
                          );
                          return (
                            <List.Item
                              key={task._id}
                              className="!py-1 flex items-center justify-between"
                            >
                              <span className="text-sm">
                                <b>{task.assigneeId?.name || "(Chưa gán)"}</b> -
                                Task: <b>{task.name}</b>{" "}
                                <ClockCircleOutlined className="ml-1 text-red-400" />{" "}
                                (Hạn:{" "}
                                {task.dueDate
                                  ? new Date(task.dueDate).toLocaleDateString()
                                  : "N/A"}
                                )
                              </span>
                              {isLeader(project) &&
                                task.assigneeId?._id &&
                                member &&
                                member.role !== "leader" && (
                                  <Button
                                    type="link"
                                    icon={
                                      <UserDeleteOutlined
                                        style={{ color: "#ff4d4f" }}
                                      />
                                    }
                                    danger
                                    onClick={() =>
                                      handleRemoveMember(
                                        project._id,
                                        task.assigneeId._id
                                      )
                                    }
                                  >
                                    Loại thành viên
                                  </Button>
                                )}
                            </List.Item>
                          );
                        }}
                      />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
