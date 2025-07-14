// Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Popover, Avatar, Menu, Button } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  MessageOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/AuthContext";
import { useSocket } from "@/contexts/SocketContext"; // Import useSocket
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logoDark.png";
import axios from "axios";
import ChatWindow from "@/components/elements/ChatWindow/ChatWindow";

export default function Header() {
  const { user, logout } = useAuthContext();
  const { onReceiveMessage, offReceiveMessage, unreadCount } = useSocket(); // Lấy từ useSocket
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showMessenger, setShowMessenger] = useState(false);
  const [openChats, setOpenChats] = useState([]);
  const messengerRef = useRef();

  const [conversations, setConversations] = useState([]);

  // Fetch conversations khi user đăng nhập
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/conversations", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data.data || []);
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
        setConversations([]);
      }
    };

    if (user) {
      fetchConversations();
    } else {
      setConversations([]); // Xóa danh sách nếu không có user
    }
  }, [user]);

  // Lắng nghe tin nhắn mới để cập nhật danh sách hội thoại
  useEffect(() => {
    const handleNewMessageForConversations = (newMessage) => {
      setConversations(prevConversations => {
        const updatedConversations = prevConversations.map(conv => {
          if (conv._id === newMessage.conversationId) {
            // Cập nhật lastMessage của cuộc trò chuyện này
            return {
              ...conv,
              lastMessage: {
                content: newMessage.content || `[${newMessage.messageType}]`,
                sender: newMessage.senderId // Đảm bảo senderId có đủ thông tin như { name: "..." }
              },
              updatedAt: newMessage.createdAt // Cập nhật thời gian cuối cùng
            };
          }
          return conv;
        });

        // Nếu tin nhắn đến từ một cuộc trò chuyện chưa có trong danh sách
        // (ví dụ: người dùng gửi tin nhắn đầu tiên cho bạn), bạn cần xem xét
        // thêm cuộc trò chuyện đó vào danh sách hoặc làm mới toàn bộ danh sách.
        // Cách đơn giản nhất là kiểm tra nếu không tìm thấy, gọi lại fetchConversations.
        const conversationExists = updatedConversations.some(c => c._id === newMessage.conversationId);
        if (!conversationExists) {
          // Tin nhắn mới từ cuộc trò chuyện chưa có trong danh sách,
          // Fetch lại toàn bộ danh sách để đảm bảo không bị thiếu.
          // Cân nhắc debounce hoặc throttle nếu có quá nhiều tin nhắn.
          // Hoặc bạn có thể chủ động tạo một conversation object mới dựa trên newMessage
          // nếu biết cấu trúc đầy đủ.
          console.log("New conversation detected, refetching conversations...");
          // fetchConversations(); // Gây ra re-fetch toàn bộ, có thể không tối ưu
        }

        // Sắp xếp lại danh sách để cuộc trò chuyện có tin nhắn mới nhất lên đầu
        return updatedConversations.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      });
    };

    onReceiveMessage(handleNewMessageForConversations);

    return () => {
      offReceiveMessage(handleNewMessageForConversations);
    };
  }, [onReceiveMessage, offReceiveMessage]); // Dependencies

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", dark);
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (messengerRef.current && !messengerRef.current.contains(event.target)) {
        setShowMessenger(false);
      }
    }
    if (showMessenger) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMessenger]);

  const routes = [
    { label: "Recruitment", path: "/" },
    { label: "Post", path: "/posts" },
    { label: "Community", path: "/community" },
    { label: "Portfolio", path: "/portfolio" },
  ];

  const profileMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      onClick: () => navigate("/profile")
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout
    }
  ];

  const themeProp = dark ? "dark" : "light";

  const openChatWindow = (convData) => { // Đổi tên param để tránh nhầm lẫn
    setShowMessenger(false);
    setOpenChats((prev) => {
      const chatExists = prev.some((c) => c.id === convData.id);
      if (chatExists) return prev; // Không mở trùng
      return [...prev, { ...convData, currentUserId: user._id }]; // Thêm currentUserId vào conv data
    });
  };

  const closeChatWindow = (id) => {
    setOpenChats((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <>
      <header className="sticky top-0 left-0 right-0 h-16 z-50 backdrop-blur-2xl border-b-2 border-white/30 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-rose-300/20 via-transparent to-purple-300/20 animate-pulse"></div>
        <div className="relative max-w-7xl h-full mx-auto flex items-center justify-between px-8">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <div className="relative p-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 group-hover:bg-white/30 transition-all duration-500">
                <img
                  src={dark ? logoDark : logoLight}
                  alt="Logo"
                  className="h-8 cursor-pointer transition-all duration-500 hover:scale-110 drop-shadow-lg filter brightness-110"
                  onClick={() => navigate("/")}
                />
              </div>
            </div>

            <nav className="hidden lg:block">
              <ul className="flex gap-2 list-none m-0 p-0">
                {routes.map(({ label, path }, index) => {
                  const gemColors = [
                    'from-rose-400 to-pink-500',
                    'from-purple-400 to-indigo-500',
                    'from-blue-400 to-cyan-500',
                    'from-yellow-400 to-orange-500'
                  ];
                  const gemColor = gemColors[index % gemColors.length];

                  return (
                    <li key={path} className="relative">
                      <Link
                        to={path}
                        className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-500 no-underline group overflow-hidden ${pathname === path
                          ? 'text-black bg-white/30 shadow-lg backdrop-blur-sm border border-white/40'
                          : 'text-black/90 hover:text-black hover:bg-white/20'
                          }`}
                      >
                        <div className={`absolute inset-0 bg-gradient-to-r ${gemColor} opacity-0 group-hover:opacity-20 rounded-full transition-all duration-500`}></div>
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>
                        <span className="relative z-10 drop-shadow-sm">{label}</span>
                        {pathname === path && (
                          <div className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r ${gemColor} rounded-full shadow-lg`}></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 group border border-white/30">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/30 to-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg className="relative w-5 h-5 text-black drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            <div className="relative">
              <button
                title="Messages"
                className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 group no-underline border border-white/30"
                onClick={() => setShowMessenger((v) => !v)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400/30 to-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <MessageOutlined className="relative text-black text-lg drop-shadow-sm" />
                {unreadCount > 0 && ( // Chỉ hiển thị badge nếu có tin nhắn chưa đọc
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-xs text-black font-bold shadow-lg border border-white/50">
                        {unreadCount}
                    </div>
                )}
              </button>
              {showMessenger && (
                <div
                  ref={messengerRef}
                  className="absolute right-0 mt-3 w-80 max-w-xs bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 overflow-hidden animate-fade-in"
                  style={{ minHeight: 400 }}
                >
                  <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-rose-400 to-pink-500">
                    <span className="font-semibold text-white">Tin nhắn</span>
                    <button
                      className="text-white hover:text-gray-200"
                      onClick={() => setShowMessenger(false)}
                    >
                      <svg width={20} height={20} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 bg-white h-[320px] overflow-y-auto">
                    <div className="flex flex-col gap-3">
                      {conversations.map((conv) => {
                        const other = conv.participants.find(p => p._id !== user._id);
                        const avatarUrl = other?.avatar?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(other?.name || "Unknown")}`;
                        const name = other?.name || "Unknown";
                        const lastMsg = conv.lastMessage?.content || "Chưa có tin nhắn";

                        return (
                          <div
                            key={conv._id}
                            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                            onClick={() => openChatWindow({
                              id: conv._id,
                              name,
                              avatar: avatarUrl,
                              lastMsg, // Đây là lastMsg của conversation list, không truyền vào ChatWindow
                              participants: conv.participants,
                            })}
                          >
                            <img src={avatarUrl} alt="avatar" className="w-10 h-10 rounded-full" />
                            <div>
                              <div className="font-medium text-gray-900">{name}</div>
                              <div className="text-xs text-gray-500 truncate max-w-[160px]">{lastMsg}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="p-3 border-t bg-gray-50">
                    <input
                      type="text"
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-200"
                      placeholder="Tìm kiếm tin nhắn..."
                    />
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/notifications"
              title="Notifications"
              className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 group no-underline border border-white/30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/30 to-indigo-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <BellOutlined className="relative text-black text-lg drop-shadow-sm" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-xs text-black font-bold shadow-lg border border-white/50">
                5
              </div>
            </Link>

            {!user && (
              <Link to="/signin" className="no-underline">
                <button className="relative px-6 py-3 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 hover:from-rose-500 hover:to-purple-600 text-black font-bold shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group overflow-hidden border-2 border-white/40">
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
                  <span className="relative z-10 flex items-center gap-2 drop-shadow-sm">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Login
                  </span>
                </button>
              </Link>
            )}

            {user && (
              <div className="relative">
                <span className="relative cursor-pointer group inline-block">
                  <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-40 blur-lg transition-all duration-700 pointer-events-none"></div>
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-300 to-purple-400 rounded-full opacity-60 pointer-events-none"></div>
                  <Avatar
                    src={user.avatarUrl}
                    icon={!user.avatarUrl && <UserOutlined />}
                    className="relative transition-all duration-500 hover:scale-110 shadow-2xl border-2 border-white/60 z-10"
                    size={44}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDropdownOpen(!dropdownOpen);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-200/30 to-purple-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </span>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 via-purple-100/30 to-blue-100/50"></div>
                    <div className="relative">
                      <div
                        className="px-5 py-4 hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50 cursor-pointer flex items-center gap-3 transition-all duration-300 group"
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                      >
                        <div className="p-2 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 group-hover:from-rose-500 group-hover:to-purple-600 transition-all duration-300">
                          <UserOutlined className="text-white text-sm" />
                        </div>
                        <div>
                          <span className="text-gray-800 font-semibold group-hover:text-gray-900 transition-colors">Profile</span>
                          <p className="text-xs text-gray-500">View your profile</p>
                        </div>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4"></div>
                      <div
                        className="px-5 py-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 cursor-pointer flex items-center gap-3 transition-all duration-300 group"
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                      >
                        <div className="p-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 group-hover:from-red-500 group-hover:to-pink-600 transition-all duration-300">
                          <LogoutOutlined className="text-white text-sm" />
                        </div>
                        <div>
                          <span className="text-gray-800 font-semibold group-hover:text-gray-900 transition-colors">Logout</span>
                          <p className="text-xs text-gray-500">Sign out of your account</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <button className="lg:hidden p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 border border-white/30">
              <svg className="w-5 h-5 text-black drop-shadow-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 via-purple-400 via-blue-400 via-cyan-400 to-yellow-400 opacity-60"></div>
      </header>

      <div className="fixed bottom-4 right-4 flex flex-row-reverse gap-4 z-[9999]">
        {openChats.map((conv) => (
          <ChatWindow
            key={conv.id}
            conv={conv}
            onClose={() => closeChatWindow(conv.id)}
          />
        ))}
      </div>
    </>
  );
}