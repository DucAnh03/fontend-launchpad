import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/services/api/axios';
import { Card, Avatar, Spin, message } from 'antd';
import {
  UserOutlined, MailOutlined, TrophyOutlined, StarOutlined, TeamOutlined
} from '@ant-design/icons';

export default function UserPublicProfile() {
  const { userId } = useParams();
  console.log('UserPublicProfile userId:', userId); // Log userId để kiểm tra
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile for userId:', userId); // Log trước khi gọi API
        const res = await api.get(`/users/profile/${userId}`);
        setProfile(res.data.data);
      } catch (err) {
        console.error('Lỗi khi fetch profile:', err);
        message.error('Không thể tải thông tin user');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <Spin size="large" />
    </div>
  );
  if (!profile) return <div className="text-center py-8">Không tìm thấy user</div>;

  return (
    <div className="container mx-auto px-4 py-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <div className="flex items-center space-x-8">
          <Avatar
            size={160}
            src={profile?.avatar?.url}
            icon={<UserOutlined />}
            className="border-4 border-blue-100 shadow-xl"
          />
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-800">{profile?.name}</h1>
            <p className="text-gray-500 text-lg mb-4">@{profile?.username}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-5 gap-8">
        {/* Left column */}
        <div className="col-span-2 space-y-8">
          <Card title="Thông tin cơ bản" className="shadow-lg rounded-xl">
            <div className="space-y-6">
              <div className="flex items-center p-3">
                <MailOutlined className="text-2xl mr-4 text-blue-500" />
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-medium text-gray-800">{profile?.email}</p>
                </div>
              </div>
              <div className="flex items-center p-3">
                <TrophyOutlined className="text-2xl mr-4 text-yellow-500" />
                <div>
                  <p className="text-gray-500 text-sm">Cấp độ</p>
                  <p className="font-medium text-gray-800">Level {profile?.level}</p>
                </div>
              </div>
              <div className="flex items-center p-3">
                <StarOutlined className="text-2xl mr-4 text-yellow-400" />
                <div>
                  <p className="text-gray-500 text-sm">Điểm</p>
                  <p className="font-medium text-gray-800">{profile?.points} points</p>
                </div>
              </div>
            </div>
          </Card>
          <Card title="Giới thiệu" className="shadow-lg rounded-xl">
            <p className="text-gray-700">{profile?.bio || 'Chưa có thông tin giới thiệu'}</p>
          </Card>
          <Card title="Kỹ năng" className="shadow-lg rounded-xl">
            <div className="flex flex-wrap gap-3">
              {profile?.skills?.map((skill, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
                  {skill.skill} - Level {skill.level}
                </div>
              ))}
            </div>
          </Card>
          <Card title="Thống kê" className="shadow-lg rounded-xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3">
                <span className="text-gray-600">Người theo dõi</span>
                <span className="font-medium text-lg text-blue-600">{profile?.followers?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3">
                <span className="text-gray-600">Đang theo dõi</span>
                <span className="font-medium text-lg text-blue-600">{profile?.following?.length || 0}</span>
              </div>
            </div>
          </Card>
          <Card title="Hạng thành viên" className="shadow-lg rounded-xl">
            <div className="text-center py-6">
              <TeamOutlined className="text-5xl text-blue-500 mb-4" />
              <p className="text-2xl font-bold text-gray-800">{profile?.userRank}</p>
            </div>
          </Card>
        </div>
        {/* Right column: có thể để trống hoặc thêm portfolio, bài viết, ... */}
        <div className="col-span-3"></div>
      </div>
    </div>
  );
} 