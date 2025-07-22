import React from "react";
import { Menu, Badge, Divider } from "antd";
import {
  MessageOutlined,
  CheckSquareOutlined,
  ProjectOutlined,
  LineChartOutlined,
  HomeOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  FolderOutlined,
  CloudOutlined,
  MailOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  BlockOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "../SidebarBase.styles";

export default function DashboardSidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Main navigation items
  const mainItems = [
    {
      key: "/dashboard/workspace",
      icon: <AppstoreOutlined />,
      label: <Link to="/dashboard/workspace">Workspace</Link>,
    },
    {
      key: "/dashboard/tasks",
      icon: (
        <Badge count={3} size="small" offset={[4, -4]}>
          <CheckSquareOutlined />
        </Badge>
      ),
      label: <Link to="/dashboard/tasks">Tác vụ & Dự án</Link>,
    },
    {
      key: "/dashboard/projects",
      icon: <ProjectOutlined />,
      label: <Link to="/dashboard/projects">Dự án</Link>,
    },
    {
      key: "/dashboard/calendar",
      icon: <CalendarOutlined />,
      label: <Link to="/dashboard/calendar">Lịch</Link>,
    },
    {
      key: "/dashboard/performance",
      icon: <LineChartOutlined />,
      label: <Link to="/dashboard/performance">Hiệu suất</Link>,
    },
  ];

  // Collaboration submenu
  const collaborationItems = [
    {
      key: "collaboration-header",
      type: "group",
      label: "Hợp tác & Giao tiếp",
      children: [
        {
          key: "/dashboard/chat",
          icon: (
            <Badge count={5} size="small" offset={[4, -4]}>
              <MessageOutlined />
            </Badge>
          ),
          label: <Link to="/dashboard/chat">Trình nhắn tin</Link>,
        },
        {
          key: "/dashboard/news",
          icon: <FileTextOutlined />,
          label: <Link to="/dashboard/news">Bản tin</Link>,
        },
        {
          key: "/dashboard/work-groups",
          icon: <TeamOutlined />,
          label: <Link to="/dashboard/work-groups">Nhóm làm việc</Link>,
        },
      ],
    },
  ];

  // Tools & Resources submenu

  // Combine all items
  const allItems = [
    ...mainItems,
    { type: "divider", key: "divider-1" },
    ...collaborationItems,
    { type: "divider", key: "divider-2" },
  ];

  return (
    <S.StyledSider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth="80"
      style={{
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
      }}
    >
      <S.Logo
        onClick={() => navigate("/")}
        style={{
          cursor: "pointer",
          marginBottom: collapsed ? 16 : 24,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          padding: collapsed ? "0" : "0 16px",
        }}
      >
        <HomeOutlined
          style={{
            fontSize: collapsed ? 24 : 20,
            marginRight: collapsed ? 0 : 12,
            color: "#fff",
          }}
        />
        {!collapsed && (
          <span style={{ color: "#fff", fontWeight: "bold" }}>Trang chủ</span>
        )}
      </S.Logo>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={allItems}
        defaultOpenKeys={
          collapsed ? [] : ["collaboration-header", "tools-header"]
        }
        style={{
          borderRight: "none",
          backgroundColor: "transparent",
        }}
      />

      {/* Settings at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: collapsed ? "50%" : 24,
          transform: collapsed ? "translateX(-50%)" : "none",
          width: collapsed ? "auto" : "calc(100% - 48px)",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[]}
          items={[
            {
              key: "/dashboard/settings",
              icon: <SettingOutlined />,
              label: collapsed ? null : (
                <Link to="/dashboard/settings">Cài đặt</Link>
              ),
            },
          ]}
          style={{
            borderRight: "none",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </S.StyledSider>
  );
}
