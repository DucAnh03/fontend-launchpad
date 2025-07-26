import React, { useState, useEffect, useRef } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  List,
  Avatar,
  Badge,
  Typography,
  Space,
  Divider,
  Upload,
  message,
  Popconfirm,
  Tooltip,
  Empty,
  Spin,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  UserAddOutlined,
  SendOutlined,
  FileImageOutlined,
  VideoCameraOutlined,
  UserDeleteOutlined,
  SettingOutlined,
  LogoutOutlined,
  CrownOutlined,
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getConversations,
  createGroup,
  addMembersToGroup,
  removeMemberFromGroup,
  leaveGroup,
  updateGroupInfo,
  updateGroupAdmins,
  getMessagesByConversationId,
  uploadChatFile,
  getConversationDisplayName,
  getConversationAvatar,
  isGroupAdmin,
  getAllUsers,
  searchUsers,
} from "../../../../services/api/Chat/chatservice";
import {
  getMyProjects,
  getProjectMembers,
} from "../../../../services/api/project";
import {
  useSocket,
  useMessageListener,
} from "../../../../contexts/SocketContext";
import { useAuthContext } from "../../../../contexts/AuthContext";

const { Title, Text } = Typography;
const { TextArea } = Input;

// Custom Dropdown Component
const CustomSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Chọn...",
  multiple = false,
  disabled = false,
  loading = false,
  allowClear = false,
  showSearch = false,
  style = {},
  notFoundContent,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions =
    showSearch && searchValue
      ? options.filter((option) =>
          option.label?.toLowerCase().includes(searchValue.toLowerCase())
        )
      : options;

  const selectedOptions = multiple
    ? options.filter((opt) => value?.includes(opt.value))
    : options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...(value || []), optionValue];
      onChange(newValue);
    } else {
      onChange(optionValue);
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(multiple ? [] : undefined);
  };

  const getDisplayText = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      return `Đã chọn ${value.length} mục`;
    } else {
      if (!value) return placeholder;
      return selectedOptions?.label || value;
    }
  };

  return (
    <div className="relative" ref={dropdownRef} style={style}>
      <div
        className={`
          min-h-[32px] px-3 py-1 border border-gray-300 rounded-md cursor-pointer
          flex items-center justify-between bg-white hover:border-blue-400
          ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}
          ${isOpen ? "border-blue-500 shadow-sm" : ""}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span
          className={`flex-1 ${
            !value || (multiple && (!value || value.length === 0))
              ? "text-gray-400"
              : "text-gray-900"
          }`}
        >
          {getDisplayText()}
        </span>
        <div className="flex items-center gap-1">
          {allowClear && value && (
            <button
              className="text-gray-400 hover:text-gray-600 text-xs"
              onClick={handleClear}
            >
              ✕
            </button>
          )}
          <DownOutlined
            className={`text-gray-400 text-xs transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-hidden">
          {showSearch && (
            <div className="p-2 border-b">
              <div className="relative">
                <SearchOutlined className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-8 pr-3 py-1 border border-gray-300 rounded text-sm"
                  placeholder="Tìm kiếm..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          <div className="max-h-48 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <Spin size="small" />
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {notFoundContent || "Không có dữ liệu"}
              </div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`
                    px-3 py-2 cursor-pointer hover:bg-blue-50 flex items-center gap-2
                    ${
                      multiple && value?.includes(option.value)
                        ? "bg-blue-50"
                        : ""
                    }
                    ${
                      !multiple && value === option.value
                        ? "bg-blue-50 text-blue-600"
                        : ""
                    }
                  `}
                  onClick={() => handleSelect(option.value)}
                >
                  {multiple && (
                    <Checkbox
                      checked={value?.includes(option.value) || false}
                      onChange={() => {}} // Handled by parent click
                    />
                  )}
                  <div className="flex-1">
                    {option.render ? (
                      option.render()
                    ) : (
                      <div>
                        <div className="font-medium">{option.label}</div>
                        {option.description && (
                          <div className="text-xs text-gray-500">
                            {option.description}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ChatGroupPage() {
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [addMemberModal, setAddMemberModal] = useState(false);
  const [groupSettingsModal, setGroupSettingsModal] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);

  // Form values for custom selects
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [selectedAddMembers, setSelectedAddMembers] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [settingsGroupName, setSettingsGroupName] = useState("");
  const [settingsAvatar, setSettingsAvatar] = useState("");

  // Project states
  const [projects, setProjects] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectMembersLoading, setProjectMembersLoading] = useState(false);

  const [messageInput, setMessageInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuthContext();
  const { sendGroupMessage, isConnected } = useSocket();

  useEffect(() => {
    loadGroups();
    loadAllUsers();
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedGroup) loadMessages(selectedGroup._id);
  }, [selectedGroup]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log("Projects state changed:", projects);
    console.log("Projects length:", projects.length);
    if (projects.length > 0) {
      console.log("First project:", projects[0]);
    }
  }, [projects]);

  useMessageListener((newMessage) => {
    if (selectedGroup && newMessage.conversationId === selectedGroup._id) {
      setMessages((prev) => {
        const withoutTemp = prev.filter(
          (msg) => msg.tempId !== newMessage.tempId
        );
        const exists = withoutTemp.some((msg) => msg._id === newMessage._id);
        if (exists) return withoutTemp;
        return [...withoutTemp, newMessage];
      });
    }
  });

  const loadGroups = async () => {
    try {
      setLoading(true);
      const conversations = await getConversations();
      const groupConversations = conversations.filter(
        (conv) => conv.type === "group"
      );
      setGroups(groupConversations);
    } catch (error) {
      console.error("Error loading groups:", error);
      message.error("Không thể tải danh sách nhóm");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId) => {
    try {
      setMessagesLoading(true);
      const data = await getMessagesByConversationId(conversationId);
      setMessages(data);
    } catch (error) {
      console.error("Error loading messages:", error);
      message.error("Không thể tải tin nhắn");
    } finally {
      setMessagesLoading(false);
    }
  };

  const loadAllUsers = async () => {
    try {
      const res = await getAllUsers();
      setAllUsers(res.users);
    } catch (error) {
      console.error("Error loading users:", error);
      message.error("Không thể tải danh sách người dùng");
    }
  };

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      console.log("Loading projects...");
      const projectList = await getMyProjects();
      console.log("Raw API response:", projectList);

      let processedProjects = [];
      if (Array.isArray(projectList)) {
        processedProjects = projectList;
      } else if (projectList && Array.isArray(projectList.data)) {
        processedProjects = projectList.data;
      } else if (
        projectList &&
        projectList.projects &&
        Array.isArray(projectList.projects)
      ) {
        processedProjects = projectList.projects;
      }

      console.log("Processed projects:", processedProjects);
      console.log("Number of projects:", processedProjects.length);

      const validProjects = processedProjects.filter(
        (project) => project && project._id && project.name
      );

      console.log("Valid projects:", validProjects);
      setProjects([...validProjects]);

      if (validProjects.length === 0) {
        message.info("Bạn chưa có dự án nào hoặc không có quyền truy cập");
      } else {
        console.log(`Loaded ${validProjects.length} projects successfully`);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
      message.error("Không thể tải danh sách dự án: " + error.message);
      setProjects([]);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadProjectMembers = async (projectId) => {
    try {
      setProjectMembersLoading(true);
      console.log("Loading project members for:", projectId);
      const members = await getProjectMembers(projectId);
      console.log("Project members loaded:", members);

      let processedMembers = [];
      if (Array.isArray(members)) {
        processedMembers = members;
      } else if (members?.data && Array.isArray(members.data)) {
        processedMembers = members.data;
      } else if (members?.members && Array.isArray(members.members)) {
        processedMembers = members.members;
      } else {
        console.warn("❗ Cấu trúc không khớp:", members);
      }

      console.log("Processed members:", processedMembers);
      setProjectMembers(processedMembers);
    } catch (error) {
      console.error("Error loading project members:", error);
      message.error("Không thể tải danh sách thành viên dự án");
      setProjectMembers([]);
    } finally {
      setProjectMembersLoading(false);
    }
  };

  const handleProjectChange = (projectId) => {
    console.log("Project changed to:", projectId);
    setSelectedProject(projectId);
    if (projectId) {
      loadProjectMembers(projectId);
      setSelectedMembers([]);
    } else {
      setProjectMembers([]);
    }
  };

  const handleCreateGroup = async () => {
    try {
      if (!selectedProject) {
        message.error("Vui lòng chọn dự án");
        return;
      }

      const selectedProjectData = projects.find(
        (p) => p._id === selectedProject
      );
      const finalGroupName =
        groupName ||
        (selectedProjectData ? selectedProjectData.name : "Nhóm mới");

      console.log("Creating group with project:", selectedProject);
      console.log("Group name will be:", finalGroupName);

      const newGroup = await createGroup({
        name: finalGroupName,
        participantIds: selectedMembers || [],
        avatar: "",
      });

      setGroups((prev) => [newGroup, ...prev]);
      setCreateGroupModal(false);

      // Reset form
      setSelectedProject(null);
      setSelectedMembers([]);
      setGroupName("");
      setProjectMembers([]);

      message.success("Tạo nhóm thành công!");
    } catch (error) {
      console.error("Error creating group:", error);
      message.error("Không thể tạo nhóm");
    }
  };

  const handleAddMembers = async () => {
    try {
      if (!selectedAddMembers || selectedAddMembers.length === 0) {
        message.error("Vui lòng chọn thành viên");
        return;
      }

      const updated = await addMembersToGroup(
        selectedGroup._id,
        selectedAddMembers
      );
      setGroups((prev) =>
        prev.map((g) => (g._id === selectedGroup._id ? updated : g))
      );
      setSelectedGroup(updated);
      setAddMemberModal(false);
      setSelectedAddMembers([]);
      message.success("Thêm thành viên thành công!");
    } catch (error) {
      console.error("Error adding members:", error);
      message.error("Không thể thêm thành viên");
    }
  };

  const handleRemoveMember = async (id) => {
    try {
      const updated = await removeMemberFromGroup(selectedGroup._id, id);
      setGroups((prev) =>
        prev.map((g) => (g._id === selectedGroup._id ? updated : g))
      );
      setSelectedGroup(updated);
      message.success("Xóa thành viên thành công!");
    } catch (error) {
      console.error("Error removing member:", error);
      message.error("Không thể xóa thành viên");
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroup(selectedGroup._id);
      setGroups((prev) => prev.filter((g) => g._id !== selectedGroup._id));
      setSelectedGroup(null);
      setMessages([]);
      message.success("Đã rời khỏi nhóm");
    } catch (error) {
      console.error("Error leaving group:", error);
      message.error("Không thể rời nhóm");
    }
  };

  const handleUpdateGroupSettings = async () => {
    try {
      if (!settingsGroupName.trim()) {
        message.error("Vui lòng nhập tên nhóm");
        return;
      }

      const updated = await updateGroupInfo(selectedGroup._id, {
        name: settingsGroupName,
        avatar: settingsAvatar,
      });
      setGroups((prev) =>
        prev.map((g) => (g._id === selectedGroup._id ? updated : g))
      );
      setSelectedGroup(updated);
      setGroupSettingsModal(false);
      message.success("Cập nhật nhóm thành công!");
    } catch (error) {
      console.error("Error updating group:", error);
      message.error("Không thể cập nhật nhóm");
    }
  };

  const handleToggleAdmin = async (memberId, isAdmin) => {
    try {
      const action = isAdmin ? "demote" : "promote";
      const updated = await updateGroupAdmins(
        selectedGroup._id,
        memberId,
        action
      );
      setGroups((prev) =>
        prev.map((g) => (g._id === selectedGroup._id ? updated : g))
      );
      setSelectedGroup(updated);
      message.success(`${isAdmin ? "Hạ quyền" : "Thăng quyền"} thành công!`);
    } catch (error) {
      console.error("Error toggling admin:", error);
      message.error("Không thể thay đổi quyền admin");
    }
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedGroup) return;

    const tempId = `temp_${Date.now()}_${Math.random()}`;
    const messageData = {
      conversationId: selectedGroup._id,
      content: messageInput.trim(),
      messageType: "text",
      tempId,
    };

    const optimistic = {
      _id: tempId,
      tempId,
      conversationId: selectedGroup._id,
      senderId: user,
      content: messageInput.trim(),
      messageType: "text",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, optimistic]);
    setMessageInput("");
    sendGroupMessage(messageData);
  };

  const handleFileUpload = async (file) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("attachment", file);
      const result = await uploadChatFile(formData);

      const tempId = `temp_${Date.now()}_${Math.random()}`;
      sendGroupMessage({
        conversationId: selectedGroup._id,
        content: file.name,
        messageType: result.resource_type === "video" ? "video" : "image",
        attachment: result,
        tempId,
      });

      message.success("Gửi file thành công!");
    } catch (error) {
      console.error("Error uploading file:", error);
      message.error("Không thể gửi file");
    } finally {
      setUploading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getAvailableUsers = () => {
    const currentIds = selectedGroup?.participants.map((p) => p._id) || [];
    return allUsers.filter((u) => !currentIds.includes(u._id));
  };

  const formatMessageTime = (ts) => {
    return new Date(ts).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Prepare options for dropdowns
  const projectOptions = projects.map((project) => ({
    value: project._id,
    label: project.name,
    description: project.description || "Không có mô tả",
  }));

  const memberOptions = projectMembers.map((member) => ({
    value: member.userId._id,
    label: `${member.userId.name} (${member.role})`,
  }));

  const availableUserOptions = getAvailableUsers().map((user) => ({
    value: user._id,
    label: user.name,
  }));

  const renderMembersList = () => (
    <List
      dataSource={selectedGroup.participants}
      renderItem={(member) => {
        const isAdmin = selectedGroup.admins?.includes(member._id);
        const isCurrentUserAdmin = isGroupAdmin(selectedGroup, user.id);
        return (
          <List.Item
            actions={
              isCurrentUserAdmin && member._id !== user.id
                ? [
                    <Tooltip
                      title={isAdmin ? "Hạ quyền" : "Thăng quyền"}
                      key="crown"
                    >
                      <Button
                        shape="circle"
                        icon={<CrownOutlined />}
                        onClick={() => handleToggleAdmin(member._id, isAdmin)}
                      />
                    </Tooltip>,
                    <Popconfirm
                      title="Xác nhận xóa?"
                      onConfirm={() => handleRemoveMember(member._id)}
                      key="remove"
                    >
                      <Button
                        danger
                        shape="circle"
                        icon={<UserDeleteOutlined />}
                      />
                    </Popconfirm>,
                  ]
                : []
            }
          >
            <List.Item.Meta
              avatar={
                <Avatar src={member.avatar?.url}>{member.name[0]}</Avatar>
              }
              title={
                <Space>
                  {member.name}
                  {member._id === user.id && "(Bạn)"}
                  {isAdmin && <CrownOutlined style={{ color: "#faad14" }} />}
                </Space>
              }
            />
          </List.Item>
        );
      }}
    />
  );

  const renderChatArea = () => (
    <div className="flex-1 flex flex-col bg-gray-50">
      <div className="p-4 border-b flex justify-between">
        <Title level={5} className="mb-0">
          {getConversationDisplayName(selectedGroup, user.id)}
        </Title>
        <Space>
          <Button
            shape="circle"
            icon={<SettingOutlined />}
            onClick={() => {
              setSettingsGroupName(selectedGroup.name);
              setSettingsAvatar(selectedGroup.avatar || "");
              setGroupSettingsModal(true);
            }}
          />
          <Button
            shape="circle"
            icon={<UserAddOutlined />}
            onClick={() => setAddMemberModal(true)}
          />
          <Popconfirm title="Rời nhóm?" onConfirm={handleLeaveGroup}>
            <Button shape="circle" danger icon={<LogoutOutlined />} />
          </Popconfirm>
        </Space>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messagesLoading ? (
          <Spin />
        ) : messages.length === 0 ? (
          <Empty description="Chưa có tin nhắn" />
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${
                msg.senderId._id === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div className="bg-white p-2 rounded shadow max-w-md">
                <Text strong>{msg.senderId.name}</Text>
                <div>
                  {msg.messageType === "text" && <Text>{msg.content}</Text>}
                  {msg.messageType === "image" && (
                    <img
                      src={msg.attachment.secure_url}
                      className="max-w-[200px] cursor-pointer"
                      onClick={() => {
                        setPreviewUrl(msg.attachment.secure_url);
                        setPreviewType("image");
                      }}
                    />
                  )}
                  {msg.messageType === "video" && (
                    <video
                      src={msg.attachment.secure_url}
                      controls
                      className="max-w-[200px]"
                      onClick={() => {
                        setPreviewUrl(msg.attachment.secure_url);
                        setPreviewType("video");
                      }}
                    />
                  )}
                </div>
                <Text
                  type="secondary"
                  className="text-xs block text-right mt-1"
                >
                  {formatMessageTime(msg.createdAt)}
                </Text>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t flex items-center gap-2">
        <Upload
          showUploadList={false}
          beforeUpload={(file) => {
            handleFileUpload(file);
            return false;
          }}
        >
          <Button icon={<FileImageOutlined />} />
        </Upload>
        <Upload
          showUploadList={false}
          accept="video/*"
          beforeUpload={(file) => {
            handleFileUpload(file);
            return false;
          }}
        >
          <Button icon={<VideoCameraOutlined />} />
        </Upload>
        <TextArea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onPressEnter={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          rows={1}
          placeholder="Nhập tin nhắn..."
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendMessage}
          disabled={!messageInput.trim()}
          loading={uploading}
        />
      </div>
    </div>
  );

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b flex justify-between items-center">
          <Title level={4} className="mb-0">
            Nhóm Chat
          </Title>
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setCreateGroupModal(true)}
          >
            Tạo nhóm
          </Button>
        </div>
        <div
          className="overflow-y-auto"
          style={{ height: "calc(100vh - 80px)" }}
        >
          <List
            loading={loading}
            dataSource={groups}
            locale={{
              emptyText: <Empty description="Chưa có nhóm chat nào" />,
            }}
            renderItem={(group) => (
              <List.Item
                className={`cursor-pointer hover:bg-gray-50 ${
                  selectedGroup?._id === group._id
                    ? "bg-blue-50 border-l-4 border-blue-500"
                    : ""
                }`}
                onClick={() => setSelectedGroup(group)}
              >
                <List.Item.Meta
                  avatar={
                    <Avatar src={getConversationAvatar(group, user.id)}>
                      {getConversationDisplayName(group, user.id)[0]}
                    </Avatar>
                  }
                  title={
                    <Text strong>
                      {getConversationDisplayName(group, user.id)}
                    </Text>
                  }
                  description={
                    <Text type="secondary">
                      {group.lastMessage?.content || "Chưa có tin nhắn"}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1">
        {selectedGroup ? (
          renderChatArea()
        ) : (
          <div className="flex items-center justify-center h-full">
            <Empty description="Chọn một nhóm để bắt đầu chat" />
          </div>
        )}
      </div>

      {/* Members */}
      {selectedGroup && (
        <div className="w-80 border-l bg-white">
          <div className="p-4 border-b">
            <Title level={5}>
              Thành viên ({selectedGroup.participants.length})
            </Title>
          </div>
          <div
            className="overflow-y-auto"
            style={{ height: "calc(100vh - 80px)" }}
          >
            {renderMembersList()}
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      <Modal
        title="Tạo nhóm"
        open={createGroupModal}
        onCancel={() => {
          setCreateGroupModal(false);
          setSelectedProject(null);
          setSelectedMembers([]);
          setGroupName("");
          setProjectMembers([]);
        }}
        onOk={handleCreateGroup}
        destroyOnClose
        styles={{ body: { padding: "20px" } }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Chọn dự án *
            </label>
            <CustomSelect
              value={selectedProject}
              onChange={handleProjectChange}
              options={projectOptions}
              placeholder="-- Chọn dự án --"
              loading={projectsLoading}
              allowClear
              showSearch
              style={{ width: "100%" }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Tên nhóm (tùy chọn)
            </label>
            <Input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Để trống sẽ dùng tên dự án"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Thêm thành viên
            </label>
            <CustomSelect
              value={selectedMembers}
              onChange={setSelectedMembers}
              options={memberOptions}
              placeholder={
                selectedProject
                  ? "Chọn thành viên từ dự án"
                  : "Vui lòng chọn dự án trước"
              }
              disabled={!selectedProject}
              loading={projectMembersLoading}
              multiple
              showSearch
              style={{ width: "100%" }}
              notFoundContent={
                projectMembersLoading ? (
                  <Spin size="small" />
                ) : (
                  "Không có thành viên nào"
                )
              }
            />
          </div>
        </div>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        title="Thêm thành viên"
        open={addMemberModal}
        onCancel={() => {
          setAddMemberModal(false);
          setSelectedAddMembers([]);
        }}
        onOk={handleAddMembers}
        destroyOnClose
        styles={{ body: { padding: "20px" } }}
      >
        <div>
          <label className="block text-sm font-medium mb-2">
            Chọn thành viên *
          </label>
          <CustomSelect
            value={selectedAddMembers}
            onChange={setSelectedAddMembers}
            options={availableUserOptions}
            placeholder="Chọn người dùng"
            multiple
            showSearch
            style={{ width: "100%" }}
          />
        </div>
      </Modal>

      {/* Group Settings Modal */}
      <Modal
        title="Cài đặt nhóm"
        open={groupSettingsModal}
        onCancel={() => setGroupSettingsModal(false)}
        onOk={handleUpdateGroupSettings}
        destroyOnClose
        styles={{ body: { padding: "20px" } }}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Tên nhóm *</label>
            <Input
              value={settingsGroupName}
              onChange={(e) => setSettingsGroupName(e.target.value)}
              placeholder="Nhập tên nhóm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Avatar nhóm
            </label>
            <Input
              value={settingsAvatar}
              onChange={(e) => setSettingsAvatar(e.target.value)}
              placeholder="URL ảnh nhóm"
            />
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={!!previewUrl}
        footer={null}
        onCancel={() => setPreviewUrl(null)}
        centered
        width={800}
        styles={{ body: { padding: "0" } }}
      >
        {previewType === "image" ? (
          <img
            src={previewUrl}
            className="w-full h-auto max-h-[80vh] object-contain"
          />
        ) : (
          <video src={previewUrl} controls className="w-full max-h-[80vh]" />
        )}
      </Modal>
    </div>
  );
}
