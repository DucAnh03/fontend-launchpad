import React, { useEffect, useState } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import api from "@/services/api/axios";
import {
  UserOutlined,
  MailOutlined,
  TrophyOutlined,
  StarOutlined,
  TeamOutlined,
  EditOutlined,
  CameraOutlined,
  LoadingOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Card,
  Avatar,
  Button,
  message,
  Spin,
  Modal,
  Form,
  Input,
  Select,
  Upload,
} from "antd";
import BecomeLeaderVerification from "./BecomeLeaderVerification";

const { Option } = Select;
const { TextArea } = Input;

const Profile = () => {
  const { user, setUser } = useAuthContext();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showLeaderModal, setShowLeaderModal] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/profile");
      setProfile(response.data.data);
    } catch (error) {
      message.error("Không thể tải thông tin profile");
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = () => {
    form.setFieldsValue({
      name: profile?.name,
      bio: profile?.bio,
      skills: profile?.skills?.map((s) => s.skill),
    });
    setIsEditModalVisible(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalVisible(false);
  };

  const handleEditSubmit = async (values) => {
    try {
      const formattedSkills = values.skills.map((skillName) => ({
        skill: skillName,
        level: 1,
      }));

      const updateData = {
        name: values.name,
        bio: values.bio,
        skills: formattedSkills,
      };

      const response = await api.put("/users/profile", updateData);
      if (response.data.success) {
        message.success("Cập nhật profile thành công!");
        setProfile(response.data.data);
        if (setUser) {
          setUser(response.data.data);
        }
        setIsEditModalVisible(false);
      } else {
        message.error(response.data.message || "Cập nhật profile thất bại!");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi cập nhật profile."
      );
      console.error("Error updating profile:", error);
    }
  };

  const handleAvatarUpload = async (file) => {
    const formData = new FormData();
    formData.append("avatar", file);

    setUploadingAvatar(true);
    try {
      const response = await api.post("/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        message.success("Cập nhật avatar thành công!");
        setProfile((prevProfile) => ({
          ...prevProfile,
          avatar: response.data.data.avatar,
        }));
        if (setUser) {
          setUser((prevUser) => ({
            ...prevUser,
            avatar: response.data.data.avatar,
          }));
        }
      } else {
        message.error(response.data.message || "Cập nhật avatar thất bại!");
      }
    } catch (error) {
      message.error(
        error.response?.data?.message || "Có lỗi xảy ra khi upload avatar."
      );
      console.error("Error uploading avatar:", error);
    } finally {
      setUploadingAvatar(false);
    }
    return false;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-50 min-h-screen">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 transform hover:scale-[1.01] transition-transform duration-200">
        <div className="flex items-center space-x-8">
          <div className="relative group">
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={handleAvatarUpload}
              accept="image/*"
              disabled={uploadingAvatar}
            >
              <Avatar
                size={160}
                src={profile?.avatar?.url}
                icon={<UserOutlined />}
                className="border-4 border-blue-100 shadow-xl cursor-pointer transition-all duration-300 hover:border-blue-300"
              >
                {uploadingAvatar && (
                  <Spin
                    indicator={
                      <LoadingOutlined style={{ fontSize: 24 }} spin />
                    }
                  />
                )}
                {!uploadingAvatar && !profile?.avatar?.url && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                    <PlusOutlined style={{ fontSize: 40 }} />
                  </div>
                )}
              </Avatar>
              <Button
                type="primary"
                shape="circle"
                icon={<CameraOutlined />}
                className="absolute bottom-0 right-0 shadow-lg hover:scale-110 transition-transform"
                loading={uploadingAvatar}
              />
            </Upload>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-4xl font-bold text-gray-800">
                {profile?.name}
              </h1>
              <div className="flex gap-3 items-center">
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={showEditModal}
                  className="hover:scale-105 transition-transform"
                >
                  Chỉnh sửa profile
                </Button>
                {profile?.role !== "leader" && (
                  <>
                    <Button
                      type="primary"
                      onClick={() => setShowLeaderModal(true)}
                      className=""
                    >
                      Đăng ký trở thành Leader
                    </Button>
                    <BecomeLeaderVerification
                      open={showLeaderModal}
                      onClose={() => setShowLeaderModal(false)}
                    />
                  </>
                )}
              </div>
            </div>
            <p className="text-gray-500 text-lg mb-4">@{profile?.username}</p>
          </div>
        </div>
      </div>

      {/* Profile Content - Chia thành 2 cột: 40% bên trái và 60% bên phải */}
      <div className="grid grid-cols-5 gap-8">
        {/* Cột trái - Chứa toàn bộ thông tin profile (40%) */}
        <div className="col-span-2 space-y-8">
          {" "}
          {/* col-span-2 trên tổng grid-cols-5 tương đương 40% */}
          {/* Basic Info */}
          <Card
            title="Thông tin cơ bản"
            className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
            headStyle={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <MailOutlined className="text-2xl mr-4 text-blue-500" />
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium text-gray-800">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <TrophyOutlined className="text-2xl mr-4 text-yellow-500" />
                <div>
                  <p className="text-gray-500 text-sm">Cấp độ</p>
                  <p className="font-medium text-gray-800">
                    Level {profile?.level}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <StarOutlined className="text-2xl mr-4 text-yellow-400" />
                <div>
                  <p className="text-gray-500 text-sm">Điểm</p>
                  <p className="font-medium text-gray-800">
                    {profile?.points} points
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {/* About */}
          <Card
            title="Giới thiệu"
            className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
            headStyle={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <p className="text-gray-700 leading-relaxed">
              {profile?.bio || "Chưa có thông tin giới thiệu"}
            </p>
          </Card>
          {/* Skills */}
          <Card
            title="Kỹ năng"
            className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
            headStyle={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div className="flex flex-wrap gap-3">
              {profile?.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md hover:shadow-lg transition-shadow duration-300"
                >
                  {skill.skill} - Level {skill.level}
                </div>
              ))}
            </div>
          </Card>
          {/* Stats */}
          <Card
            title="Thống kê"
            className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
            headStyle={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-600">Người theo dõi</span>
                <span className="font-medium text-lg text-blue-600">
                  {profile?.followers?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-gray-600">Đang theo dõi</span>
                <span className="font-medium text-lg text-blue-600">
                  {profile?.following?.length || 0}
                </span>
              </div>
            </div>
          </Card>
          {/* Rank */}
          <Card
            title="Hạng thành viên"
            className="shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
            headStyle={{
              fontSize: "1.25rem",
              fontWeight: "bold",
              borderBottom: "2px solid #f0f0f0",
            }}
          >
            <div className="text-center py-6">
              <TeamOutlined className="text-5xl text-blue-500 mb-4" />
              <p className="text-2xl font-bold text-gray-800">
                {profile?.userRank}
              </p>
            </div>
          </Card>
        </div>

        {/* Cột phải - Để trống cho nội dung sau (60%) */}
        <div className="col-span-3">
          {" "}
          {/* col-span-3 trên tổng grid-cols-5 tương đương 60% */}
          {/* Bạn của bạn có thể thêm code vào đây */}
          {/* Ví dụ: */}
          {/* <div className="bg-white rounded-xl shadow-lg p-8 h-full flex items-center justify-center text-gray-400">
            Không gian trống cho nội dung khác
          </div> */}
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa Profile"
        open={isEditModalVisible}
        onCancel={handleCancelEdit}
        footer={null}
        className="rounded-lg"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleEditSubmit}
          initialValues={{
            name: profile?.name,
            bio: profile?.bio,
            skills: profile?.skills?.map((s) => s.skill),
          }}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Tên hiển thị"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input className="rounded-lg" />
          </Form.Item>

          <Form.Item name="bio" label="Giới thiệu">
            <TextArea rows={4} className="rounded-lg" />
          </Form.Item>

          <Form.Item name="skills" label="Kỹ năng">
            <Select
              mode="tags"
              placeholder="Thêm kỹ năng của bạn (VD: React, Node.js)"
              tokenSeparators={[","]}
              className="rounded-lg"
            ></Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full h-10 rounded-lg hover:scale-[1.02] transition-transform"
            >
              Lưu thay đổi
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
