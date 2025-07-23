import React, { useEffect, useState } from 'react';
import { Card, Avatar, Button, Spin, Tag, message, Tooltip } from 'antd';
import { UserOutlined, MessageOutlined, EyeOutlined, TeamOutlined, ProjectOutlined } from '@ant-design/icons';
import api from '@/services/api/axios';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { startConversation } from '@/services/api/Chat/chatservice';
import ChatWindow from '@/components/elements/ChatWindow/ChatWindow';

export default function WorkGroupsPage() {
  const { user } = useAuthContext();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    api.get('/projects/user')
      .then(res => setProjects(res.data.data || []))
      .catch(() => message.error('Không load được danh sách project'))
      .finally(() => setLoading(false));
  }, [user]);

  // Lấy thành viên của project
  const fetchMembers = async (projectId) => {
    try {
      const res = await api.get(`/projects/${projectId}`);
      return res.data.data.members || [];
    } catch {
      return [];
    }
  };

  // State lưu member cho từng project
  const [membersMap, setMembersMap] = useState({});

  useEffect(() => {
    // Khi có projects, fetch member cho từng project
    if (projects.length > 0) {
      projects.forEach(async (proj) => {
        if (!membersMap[proj._id]) {
          const members = await fetchMembers(proj._id);
          setMembersMap(prev => ({ ...prev, [proj._id]: members }));
        }
      });
    }
    // eslint-disable-next-line
  }, [projects]);

  // State quản lý các cửa sổ chat
  const [chatWindows, setChatWindows] = useState([]);

  // Hàm mở chat với 1 user
  const openChatWithUser = async (otherUser) => {
    try {
      const conv = await startConversation(otherUser._id);
      if (!conv) return;
      setChatWindows((prev) => {
        if (prev.some((c) => c.conv.id === conv._id)) return prev;
        return [
          ...prev,
          {
            conv: {
              id: conv._id,
              name: otherUser.name,
              avatar: otherUser.avatar?.url || '',
              participants: conv.participants,
            },
          },
        ];
      });
    } catch (error) {
      message.error('Không thể mở cuộc trò chuyện!');
    }
  };

  // Đóng chat window
  const closeChatWindow = (convId) => {
    setChatWindows((prev) => prev.filter((c) => c.conv.id !== convId));
  };

  if (loading) return <div className="flex justify-center items-center min-h-[200px]"><Spin size="large" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.146-1.283-.423-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.146-1.283.423-1.857m0 0A9.002 9.002 0 0112 9m6.003 9c-.528 0-1.05-.084-1.555-.249M12 12H5.356c-.146-.277-.27-.56-.377-.857M12 12h6.003" />
          </svg>
          Dự án của bạn
        </h2>
  
        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg border border-blue-200 p-12 text-center text-gray-600 text-lg bg-gradient-to-br from-blue-50 to-purple-50">
            <svg className="w-16 h-16 mx-auto mb-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            <p>Bạn chưa tham gia dự án nào. Hãy bắt đầu một dự án mới!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              console.log('Project:', project);
              // Define status colors for a more vibrant look
              const statusThemes = {
                'Đang hoạt động': { color: 'blue', text: 'text-blue-700', bg: 'bg-blue-100', gradient: 'from-blue-50 to-blue-100', border: 'border-blue-300' },
                'Hoàn thành': { color: 'green', text: 'text-green-700', bg: 'bg-green-100', gradient: 'from-green-50 to-green-100', border: 'border-green-300' },
                'Tạm dừng': { color: 'orange', text: 'text-orange-700', bg: 'bg-orange-100', gradient: 'from-orange-50 to-orange-100', border: 'border-orange-300' },
                'Đã hủy': { color: 'red', text: 'text-red-700', bg: 'bg-red-100', gradient: 'from-red-50 to-red-100', border: 'border-red-300' },
              };
              const currentStatus = project.status || 'Đang hoạt động';
              const theme = statusThemes[currentStatus] || statusThemes['Đang hoạt động'];
  
              return (
                <Card
                  key={project._id}
                  title={
                    <span className="flex items-center gap-2 text-xl font-semibold text-gray-800">
                      <ProjectOutlined className={`text-${theme.color}-600`} />
                      {project.name}
                    </span>
                  }
                  className={`bg-gradient-to-br ${theme.gradient} rounded-xl shadow-lg border ${theme.border} hover:shadow-xl transition-all duration-300`}
                  extra={
                    <Tag color={theme.color} className={`rounded-full px-3 py-1 text-sm font-medium ${theme.text} ${theme.bg} border-none`}>
                      {currentStatus}
                    </Tag>
                  }
                  style={{ minHeight: 250 }}
                >
                  <div className="font-semibold mb-3 text-gray-700 flex items-center gap-2">
                    <svg className={`w-5 h-5 text-${theme.color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.146-1.283-.423-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.146-1.283.423-1.857m0 0A9.002 9.002 0 0112 9m6.003 9c-.528 0-1.05-.084-1.555-.249M12 12H5.356c-.146-.277-.27-.56-.377-.857M12 12h6.003" />
                    </svg>
                    Thành viên:
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {(membersMap[project._id] || []).length === 0 && <span className="text-gray-400 italic">Chưa có thành viên nào.</span>}
                    {(membersMap[project._id] || []).map(member => (
                      <div key={member.userId._id} className={`flex items-center gap-3 bg-white rounded-lg px-3 py-2 shadow-md border border-${theme.color}-200 transition-all duration-200 hover:bg-gray-50`}>
                        <Avatar 
                          src={member.userId.avatar} 
                          icon={<UserOutlined />} 
                          size={36} 
                          className={`border-2 border-${theme.color}-400`}
                        />
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{member.userId.name}</span>
                          <span className="text-xs text-gray-500">@{member.userId.username}</span>
                        </div>
                        <div className="flex gap-1 ml-auto">
                          <Tooltip title="Nhắn tin" placement="top">
                            <Button
                              shape="circle"
                              icon={<MessageOutlined />}
                              size="small"
                              className={`text-${theme.color}-600 hover:text-${theme.color}-800 hover:bg-${theme.color}-100 transition-all duration-200`}
                              onClick={() => openChatWithUser(member.userId)}
                            />
                          </Tooltip>
                          <Tooltip title="Xem profile" placement="top">
                            <Button
                              shape="circle"
                              icon={<EyeOutlined />}
                              size="small"
                              className={`text-${theme.color}-600 hover:text-${theme.color}-800 hover:bg-${theme.color}-100 transition-all duration-200`}
                              onClick={() => navigate(`/profile/id/${member.userId._id}`)}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
        {/* Cửa sổ chat nhỏ ở góc phải */}
        <div className="fixed bottom-4 right-4 flex flex-row-reverse gap-4 z-[9999]">
          {chatWindows.map((c) => (
            <ChatWindow
              key={c.conv.id}
              conv={c.conv}
              onClose={() => closeChatWindow(c.conv.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 