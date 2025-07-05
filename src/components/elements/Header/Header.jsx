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
import { useSocket } from "@/contexts/SocketContext";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logoDark.png";
import ConversationListBox from "@/components/pages/Chat/ConversationListBox";
import ChatBox from "@/components/pages/PostPage/ChatBox"; // Đảm bảo đúng đường dẫn

export default function Header() {
  const { user, logout } = useAuthContext();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // dark mode
  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  // dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConversationBox, setShowConversationBox] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const messageBtnRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", dark);
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  // Lấy danh sách cuộc trò chuyện và tính tổng số chưa đọc
  useEffect(() => {
    if (!showConversationBox) {
      // Gọi API lấy conversations (hoặc dùng websocket cập nhật realtime)
      import("@/services/api/Chat/chatservice")
        .then(({ getConversations }) => {
          getConversations().then((convs) => {
            const totalUnread = convs.reduce(
              (sum, c) => sum + (c.unreadCount || 0),
              0
            );
            setUnreadCount(totalUnread);
          });
        })
        .catch((error) => console.error("Error loading conversations:", error));
    }
  }, [showConversationBox]);

  // Lắng nghe socket để cập nhật badge khi có tin nhắn mới
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = () => {
      import("@/services/api/Chat/chatservice")
        .then(({ getConversations }) => {
          getConversations().then((convs) => {
            const totalUnread = convs.reduce(
              (sum, c) => sum + (c.unreadCount || 0),
              0
            );
            setUnreadCount(totalUnread);
          });
        });
    };
    socket.on("new_message_notification", handleNewMessage);
    return () => socket.off("new_message_notification", handleNewMessage);
  }, [socket]);

  const routes = [
    { label: "Recruitment", path: "/" },
    { label: "Post", path: "/posts" },
    { label: "Community", path: "/community" },
    { label: "Portfolio", path: "/portfolio" },
  ];

  const profileMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: logout,
    },
  ];

  const themeProp = dark ? "dark" : "light";

  return (
    <>
      <header className="sticky top-0 left-0 right-0 h-16 z-50 backdrop-blur-2xl border-b-2 border-white/30 shadow-2xl">
        {/* Magical aura overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-300/20 via-transparent to-purple-300/20 animate-pulse"></div>

        <div className="relative max-w-7xl h-full mx-auto flex items-center justify-between px-8">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            {/* Logo */}
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

            {/* Gem-themed Navigation */}
            <nav className="hidden lg:block">
              <ul className="flex gap-2 list-none m-0 p-0">
                {routes.map(({ label, path }, index) => {
                  const gemColors = [
                    "from-rose-400 to-pink-500",
                    "from-purple-400 to-indigo-500",
                    "from-blue-400 to-cyan-500",
                    "from-yellow-400 to-orange-500",
                  ];
                  const gemColor = gemColors[index % gemColors.length];

                  return (
                    <li key={path} className="relative">
                      <Link
                        to={path}
                        className={`relative px-5 py-2 rounded-full text-sm font-semibold transition-all duration-500 no-underline group overflow-hidden ${
                          pathname === path
                            ? "text-black bg-white/30 shadow-lg backdrop-blur-sm border border-white/40"
                            : "text-black/90 hover:text-black hover:bg-white/20"
                        }`}
                      >
                        {/* Gem glow effect */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${gemColor} opacity-0 group-hover:opacity-20 rounded-full transition-all duration-500`}
                        ></div>

                        {/* Crystal shimmer */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"></div>

                        <span className="relative z-10 drop-shadow-sm">{label}</span>

                        {/* Active gem indicator */}
                        {pathname === path && (
                          <div
                            className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gradient-to-r ${gemColor} rounded-full shadow-lg`}
                          ></div>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Magical Actions */}
          <div className="flex items-center gap-5">
            {/* Crystal Search */}
            <button className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 group border border-white/30">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-400/30 to-purple-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <svg
                className="relative w-5 h-5 text-black drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>

            {/* Rose Quartz Messages */}
            <div className="relative">
              <button
                ref={messageBtnRef}
                title="Messages"
                className="relative p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 group no-underline border border-white/30"
                onClick={() => setShowConversationBox((v) => !v)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-400/30 to-pink-500/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <MessageOutlined className="relative text-black text-lg drop-shadow-sm" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-gradient-to-r from-rose-400 to-pink-500 rounded-full flex items-center justify-center text-xs text-white font-bold shadow-lg border border-white/50">
                    {unreadCount}
                  </span>
                )}
              </button>
              <ConversationListBox
                visible={showConversationBox}
                onClose={() => setShowConversationBox(false)}
                onSelect={(conv) => {
                  setShowConversationBox(false);
                  setSelectedConversation(conv);
                  // Lấy user còn lại trong participants để truyền cho ChatBox
                  const other = conv.participants.find(
                    (p) => p._id !== conv.me?._id
                  );
                  setChatUser(other);
                }}
                anchorRef={messageBtnRef}
              />
            </div>

            {/* Amethyst Notifications */}
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
                  {/* Steven's shield glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 opacity-0 group-hover:opacity-50 transition-opacity duration-500 rounded-full"></div>

                  {/* Star shimmer */}
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
                  {/* Crystal aura */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-rose-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-40 blur-lg transition-all duration-700 pointer-events-none"></div>

                  {/* Gem border */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-rose-300 to-purple-400 rounded-full opacity-60 pointer-events-none"></div>

                  <Avatar
                    src={user.avatarUrl}
                    icon={!user.avatarUrl && <UserOutlined />}
                    className="relative transition-all duration-500 hover:scale-110 shadow-2xl border-2 border-white/60 z-10"
                    size={44}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Avatar clicked!");
                      setDropdownOpen(!dropdownOpen);
                    }}
                  />

                  {/* Magical sparkle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-rose-200/30 to-purple-200/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                </span>

                {/* Custom Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 z-50 overflow-hidden">
                    {/* Magical aura overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-rose-100/50 via-purple-100/30 to-blue-100/50"></div>

                    <div className="relative">
                      <div
                        className="px-5 py-4 hover:bg-gradient-to-r hover:from-rose-50 hover:to-purple-50 cursor-pointer flex items-center gap-3 transition-all duration-300 group"
                        onClick={() => {
                          console.log("Profile clicked");
                          setDropdownOpen(false);
                          navigate("/profile");
                        }}
                      >
                        <div className="p-2 rounded-full bg-gradient-to-r from-rose-400 to-purple-500 group-hover:from-rose-500 group-hover:to-purple-600 transition-all duration-300">
                          <UserOutlined className="text-white text-sm" />
                        </div>
                        <div>
                          <span className="text-gray-800 font-semibold group-hover:text-gray-900 transition-colors">
                            Profile
                          </span>
                          <p className="text-xs text-gray-500">
                            View your profile
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mx-4"></div>

                      <div
                        className="px-5 py-4 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 cursor-pointer flex items-center gap-3 transition-all duration-300 group"
                        onClick={() => {
                          console.log("Logout clicked");
                          setDropdownOpen(false);
                          logout();
                        }}
                      >
                        <div className="p-2 rounded-full bg-gradient-to-r from-red-400 to-pink-500 group-hover:from-red-500 group-hover:to-pink-600 transition-all duration-300">
                          <LogoutOutlined className="text-white text-sm" />
                        </div>
                        <div>
                          <span className="text-gray-800 font-semibold group-hover:text-gray-900 transition-colors">
                            Logout
                          </span>
                          <p className="text-xs text-gray-500">
                            Sign out of your account
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Crystal Menu */}
            <button className="lg:hidden p-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-500 hover:scale-110 border border-white/30">
              <svg
                className="w-5 h-5 text-black drop-shadow-sm"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Rainbow light beam */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-rose-400 via-purple-400 via-blue-400 via-cyan-400 to-yellow-400 opacity-60"></div>
      </header>

      {/* Hiển thị ChatBox nếu đã chọn cuộc trò chuyện */}
      {selectedConversation && chatUser && (
        <ChatBox
          key={selectedConversation._id} // <-- key này phải là duy nhất!
          user={chatUser}
          onClose={() => setSelectedConversation(null)}
        />
      )}
    </>
  );
}
