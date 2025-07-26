import React, { useState, useRef, useEffect } from "react";
import { Layout, Button, Avatar, Space, Typography, Badge } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/elements/AdminSidebar/AdminSidebar";
import { useAuthContext } from "@/contexts/AuthContext";
import styled from "styled-components";

const { Text } = Typography;

// Styled Components for Admin Layout
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(231, 76, 60, 0.2) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(155, 89, 182, 0.2) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }
`;

// ✅ Fix: Layout bên phải với margin-left để không bị sidebar che
const RightLayout = styled(Layout)`
  margin-left: ${(props) =>
    props.collapsed ? "80px" : "256px"}; /* Sidebar width */
  transition: margin-left 0.3s ease;
  background: transparent;

  @media (max-width: 992px) {
    margin-left: 0; /* Mobile không margin */
  }
`;

const StyledHeader = styled(Layout.Header)`
  && {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(240, 240, 240, 0.8);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    position: sticky;
    top: 0;
    z-index: 99;

    .trigger-btn {
      color: #595959;
      font-size: 18px;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.08);
        transform: scale(1.1) rotate(180deg);
      }
    }

    .notification-btn {
      color: #8c8c8c;
      font-size: 18px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        color: #e74c3c;
        background: rgba(231, 76, 60, 0.08);
        transform: scale(1.1);
      }
    }
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  background: linear-gradient(135deg, #e74c3c, #8e44ad);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  &::before {
    content: "👑";
    margin-right: 8px;
  }
`;

const AdminBadge = styled.div`
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.3);
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(231, 76, 60, 0.06);
    transform: translateY(-1px);
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
`;

// ✅ Custom Dropdown Component
const CustomDropdown = ({ trigger, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div style={{ position: "relative" }} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: "8px",
            background: "white",
            border: "1px solid #d9d9d9",
            borderRadius: "8px",
            boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)",
            zIndex: 1000,
            minWidth: "180px",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// ✅ Dropdown Menu Item
const DropdownItem = ({ icon, children, onClick, danger = false }) => {
  return (
    <div
      style={{
        padding: "12px 16px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: danger ? "#ff4d4f" : "#262626",
        transition: "all 0.2s ease",
        borderBottom: "1px solid #f0f0f0",
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.background = danger ? "#fff2f0" : "#f5f5f5";
      }}
      onMouseLeave={(e) => {
        e.target.style.background = "white";
      }}
    >
      {icon}
      <span style={{ fontSize: "14px" }}>{children}</span>
    </div>
  );
};

// ✅ Divider for dropdown
const DropdownDivider = () => (
  <div style={{ height: "1px", background: "#f0f0f0", margin: "4px 0" }} />
);
const LogoutButton = styled(Button)`
  && {
    background: linear-gradient(135deg, #ff4757, #ff3838);
    border: none;
    border-radius: 8px;
    height: 40px;
    padding: 0 16px;
    color: white;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);

    &:hover {
      background: linear-gradient(135deg, #ff3838, #ff2f2f) !important;
      color: white !important;
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(255, 71, 87, 0.4);
    }

    &:active {
      transform: translateY(0);
    }

    @media (max-width: 768px) {
      padding: 0 12px;
      height: 36px;

      .ant-btn-icon {
        margin-right: 4px;
      }

      span:last-child {
        display: none; /* Hide text on mobile */
      }
    }
  }
`;

const ContentWrapper = styled(Layout.Content)`
  margin: 24px;
  padding: 0;
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 120px);

  overflow-x: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(231, 76, 60, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(231, 76, 60, 0.5);
    }
  }

  @media (max-width: 768px) {
    margin: 16px;
    padding: 0 8px;
  }
`;

// ✅ Overlay cho mobile khi sidebar mở
const SidebarOverlay = styled.div`
  display: ${(props) => (props.show ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;

  @media (min-width: 993px) {
    display: none;
  }
`;

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthContext();
  const location = useLocation();

  // Get page title based on route
  const getPageTitle = (pathname) => {
    const routes = {
      "/admin": "Admin Dashboard",
      "/admin/users": "Quản lý người dùng",
      "/admin/posts": "Quản lý bài viết",
      "/admin/recruitments": "Quản lý tuyển dụng",
      "/admin/reports": "Báo cáo & Thống kê",
      "/admin/settings": "Cài đặt hệ thống",
      "/admin/payments": "Quản lý thanh toán",
      "/admin/subscriptions": "Quản lý gói dịch vụ",
      "/admin/analytics": "Phân tích dữ liệu",
      "/admin/moderation": "Kiểm duyệt nội dung",
    };
    return routes[pathname] || "Admin Panel";
  };

  const handleProfileClick = () => {
    console.log("Navigate to profile");
    // navigate('/admin/profile');
  };

  const handleSettingsClick = () => {
    console.log("Navigate to settings");
    // navigate('/admin/settings');
  };

  return (
    <StyledLayout>
      {/* Sidebar - fixed position */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Overlay cho mobile */}
      <SidebarOverlay show={!collapsed} onClick={() => setCollapsed(true)} />

      {/* ✅ Layout bên phải với margin để tránh sidebar */}
      <RightLayout collapsed={collapsed}>
        <StyledHeader>
          <HeaderLeft>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            <PageTitle>{getPageTitle(location.pathname)}</PageTitle>
          </HeaderLeft>

          <HeaderRight>
            <Space size="middle">
              <Badge count={5} offset={[0, 0]}>
                <Button
                  type="text"
                  icon={<BellOutlined />}
                  className="notification-btn"
                  size="large"
                />
              </Badge>

              <AdminBadge>Admin</AdminBadge>

              {/* ✅ Prominent Logout Button */}
              <LogoutButton icon={<LogoutOutlined />} onClick={logout}>
                Đăng xuất
              </LogoutButton>

              {/* ✅ Custom Dropdown thay vì Ant Design Dropdown */}
              <CustomDropdown
                trigger={
                  <UserSection>
                    <Avatar
                      size="default"
                      src={user?.avatar?.url}
                      icon={!user?.avatar?.url && <UserOutlined />}
                      style={{
                        backgroundColor: "#e74c3c",
                        border: "2px solid rgba(231, 76, 60, 0.2)",
                      }}
                    />
                    <UserInfo>
                      <Text strong style={{ color: "#262626" }}>
                        {user?.name || "Admin"}
                      </Text>
                      <Text type="secondary" style={{ fontSize: "12px" }}>
                        Quản trị viên
                      </Text>
                    </UserInfo>
                  </UserSection>
                }
              >
                <DropdownItem
                  icon={<UserOutlined />}
                  onClick={handleProfileClick}
                >
                  Hồ sơ Admin
                </DropdownItem>
                <DropdownItem
                  icon={<SettingOutlined />}
                  onClick={handleSettingsClick}
                >
                  Cài đặt
                </DropdownItem>
                <DropdownDivider />
                <DropdownItem icon={<LogoutOutlined />} onClick={logout} danger>
                  Đăng xuất
                </DropdownItem>
              </CustomDropdown>
            </Space>
          </HeaderRight>
        </StyledHeader>

        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </RightLayout>
    </StyledLayout>
  );
}
