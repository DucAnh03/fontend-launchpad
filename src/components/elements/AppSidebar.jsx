import React from "react";
import { Menu, Badge, Tooltip } from "antd";
import {
  MessageOutlined,
  CheckSquareOutlined,
  ProjectOutlined,
  LineChartOutlined,
  HomeOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  TeamOutlined,
  FileTextOutlined,
  FolderOutlined,
  CloudOutlined,
  MailOutlined,
  ToolOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  RocketOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "./SidebarBase.styles";

export default function AppSidebar({ isDashboard, collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Main workspace items
  const workspaceItems = [
    {
      key: "/dashboard/workspace",
      icon: <AppstoreOutlined />,
      label: collapsed ? null : (
        <Link to="/dashboard/workspace">Workspace</Link>
      ),
      tooltip: "Workspace",
    },
    {
      key: "/dashboard/tasks",
      icon: (
        <Badge count={8} size="small" offset={[8, -8]}>
          <CheckSquareOutlined />
        </Badge>
      ),
      label: collapsed ? null : <Link to="/dashboard/tasks">Tác vụ</Link>,
      tooltip: "Tác vụ (8 mới)",
    },
    {
      key: "/dashboard/projects",
      icon: <ProjectOutlined />,
      label: collapsed ? null : <Link to="/dashboard/projects">Dự án</Link>,
      tooltip: "Dự án",
    },
    {
      key: "/dashboard/calendar",
      icon: <CalendarOutlined />,
      label: collapsed ? null : <Link to="/dashboard/calendar">Lịch</Link>,
      tooltip: "Lịch",
    },
    {
      key: "/dashboard/performance",
      icon: <LineChartOutlined />,
      label: collapsed ? null : (
        <Link to="/dashboard/performance">Hiệu suất</Link>
      ),
      tooltip: "Hiệu suất",
    },
  ];

  // Communication & collaboration
  const collaborationItems = {
    key: "collaboration",
    label: collapsed ? null : "Hợp tác",
    type: "group",
    children: [
      {
        key: "/dashboard/chat",
        icon: (
          <Badge count={12} size="small" offset={[8, -8]}>
            <MessageOutlined />
          </Badge>
        ),
        label: collapsed ? null : (
          <Link to="/dashboard/chat">Trình nhắn tin</Link>
        ),
        tooltip: "Trình nhắn tin (12 tin mới)",
      },
      {
        key: "/community",
        icon: <FileTextOutlined />,
        label: collapsed ? null : <Link to="/community">Bản tin</Link>,
        tooltip: "Bản tin",
      },
      {
        key: "/dashboard/work-groups",
        icon: <TeamOutlined />,
        label: collapsed ? null : (
          <Link to="/dashboard/work-groups">Nhóm làm việc</Link>
        ),
        tooltip: "Nhóm làm việc",
      },
      {
        key: "/dashboard/webmail",
        icon: (
          <Badge count={3} size="small" offset={[8, -8]}>
            <MailOutlined />
          </Badge>
        ),
        label: collapsed ? null : <Link to="/dashboard/webmail">Webmail</Link>,
        tooltip: "Webmail (3 email mới)",
      },
    ],
  };

  // Combine all items
  const items = [
    ...workspaceItems,
    { type: "divider" },
    ...(collapsed ? collaborationItems.children : [collaborationItems]),
    { type: "divider" },
  ];

  // Render menu item with tooltip for collapsed state
  const renderMenuItem = (item) => {
    if (collapsed && item.tooltip) {
      return (
        <Tooltip title={item.tooltip} placement="right">
          <div>{item.icon}</div>
        </Tooltip>
      );
    }
    return item;
  };

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
        zIndex: 1000,
      }}
    >
      {/* Logo/Home button */}
      {isDashboard && (
        <S.Logo
          onClick={() => navigate("/")}
          style={{
            cursor: "pointer",
            marginBottom: collapsed ? 16 : 24,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed ? "center" : "flex-start",
            padding: collapsed ? "12px" : "12px 24px",
            transition: "all 0.3s ease",
          }}
        >
          {collapsed ? (
            <Tooltip title="Trang chủ" placement="right">
              <HomeOutlined style={{ fontSize: 24, color: "#fff" }} />
            </Tooltip>
          ) : (
            <>
              <HomeOutlined
                style={{ fontSize: 20, marginRight: 12, color: "#fff" }}
              />
              <span
                style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}
              >
                Trang chủ
              </span>
            </>
          )}
        </S.Logo>
      )}

      {/* Dashboard title */}
      <S.Logo style={{ marginBottom: collapsed ? 8 : 16 }}>
        {collapsed ? (
          <Tooltip title="Dashboard" placement="right">
            <span
              style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
            >
              DP
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}>
            Dashboard
          </span>
        )}
      </S.Logo>

      {/* Main menu */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={items.map((item) => {
          if (item.type === "divider") return item;
          if (collapsed && item.tooltip) {
            return {
              ...item,
              label: (
                <Tooltip title={item.tooltip} placement="right">
                  {item.label || <span></span>}
                </Tooltip>
              ),
            };
          }
          return item;
        })}
        defaultOpenKeys={
          collapsed ? [] : ["collaboration", "tools", "business"]
        }
        style={{
          borderRight: "none",
          backgroundColor: "transparent",
          flex: 1,
          paddingBottom: "80px", // Space for settings at bottom
        }}
      />

      {/* Settings at bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 16,
          left: 0,
          right: 0,
          padding: collapsed ? "0 16px" : "0 8px",
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={
            pathname === "/dashboard/settings" ? ["/dashboard/settings"] : []
          }
          items={[
            {
              key: "/dashboard/settings",
              icon: collapsed ? (
                <Tooltip title="Cài đặt" placement="right">
                  <SettingOutlined />
                </Tooltip>
              ) : (
                <SettingOutlined />
              ),
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
