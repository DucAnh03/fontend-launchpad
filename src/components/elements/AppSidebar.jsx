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
      label: <Link to="/dashboard/workspace">Workspace</Link>,
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

  // Communication & collaboration
  const collaborationItems = {
    key: "collaboration",
    label: "Hợp tác",
    type: "group",
    children: [
      {
        key: "/dashboard/chat",
        icon: (
          <Badge count={12} size="small" offset={[8, -8]}>
            <MessageOutlined />
          </Badge>
        ),
        label: <Link to="/dashboard/chat">Trình nhắn tin</Link>,
      },
      {
        key: "/community",
        icon: <FileTextOutlined />,
        label: <Link to="/community">Bản tin</Link>,
      },
      {
        key: "/dashboard/work-groups",
        icon: <TeamOutlined />,
        label: <Link to="/dashboard/work-groups">Nhóm làm việc</Link>,
      },
    ],
  };

  // Combine all items
  const items = [
    ...workspaceItems,
    { type: "divider" },
    [collaborationItems],
    { type: "divider" },
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
        items={items.flat()}
        defaultOpenKeys={
          collapsed ? [] : ["collaboration", "tools", "business"]
        }
        style={{
          borderRight: "none",
          backgroundColor: "transparent",
          flex: 1,
          paddingBottom: "0px",
        }}
      />

      {/* Settings ngay dưới menu chính */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={
          pathname === "/dashboard/settings" ? ["/dashboard/settings"] : []
        }
        items={[{
          key: "/dashboard/settings",
          icon: <SettingOutlined />,
          label: <Link to="/dashboard/settings">Cài đặt</Link>,
        }]}
        style={{
          borderRight: "none",
          backgroundColor: "transparent",
          marginTop: 8,
        }}
      />
    </S.StyledSider>
  );
}
