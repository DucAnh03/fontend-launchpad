import React from "react";
import { Menu, Badge, Tooltip } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  TeamOutlined,
  BarChartOutlined,
  SettingOutlined,
  CreditCardOutlined,
  GiftOutlined,
  LineChartOutlined,
  EyeOutlined,
  ShieldOutlined,
  BellOutlined,
  DatabaseOutlined,
  ToolOutlined,
  AuditOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Layout } from "antd";

// ✅ Styled Sidebar for Admin - Remove fixed position
const StyledSider = styled(Layout.Sider)`
  && {
    min-height: 100vh;
    background: linear-gradient(
      180deg,
      #2c3e50 0%,
      #34495e 50%,
      #2c3e50 100%
    ) !important;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    position: relative; /* ✅ Thay đổi từ fixed thành relative */
    z-index: 100;

    /* ✅ Bỏ position fixed styles */
    /* position: fixed;
    left: 0;
    top: 0;
    bottom: 0; */

    .ant-layout-sider-children {
      overflow-x: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .ant-menu {
      background: transparent !important;
      border-right: none !important;
      color: #ecf0f1 !important;
      position: relative;
      z-index: 2;
      padding: 8px 0;
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
      color: #bdc3c7 !important;
      border-radius: 12px !important;
      margin: 3px 8px !important;
      padding: 12px 24px !important;
      height: auto !important;
      line-height: 1.5 !important;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
      position: relative;
      overflow: hidden;

      &:hover {
        color: #e74c3c !important;
        background: rgba(231, 76, 60, 0.1) !important;
        transform: translateX(4px);
        box-shadow: 0 4px 15px rgba(231, 76, 60, 0.2);

        .anticon {
          color: #e74c3c !important;
        }
      }
    }

    .ant-menu-item-selected {
      background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 20px rgba(231, 76, 60, 0.4);
      transform: translateX(6px);

      &::before {
        content: "";
        position: absolute;
        left: -4px;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 60%;
        background: linear-gradient(180deg, #f39c12, #e67e22);
        border-radius: 0 2px 2px 0;
      }

      .anticon {
        color: #ffffff !important;
      }

      a {
        color: #ffffff !important;
      }
    }

    .ant-menu-item-group-title {
      color: #7f8c8d !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      padding: 16px 24px 8px !important;
      margin: 0 !important;

      &::after {
        content: "";
        display: block;
        width: 30px;
        height: 1px;
        background: linear-gradient(90deg, #7f8c8d, transparent);
        margin-top: 8px;
      }
    }

    .ant-menu-item .anticon,
    .ant-menu-submenu-title .anticon {
      font-size: 18px !important;
      margin-right: 12px !important;
      color: #95a5a6 !important;
      transition: all 0.3s ease !important;
    }

    .ant-badge {
      .ant-badge-count {
        background: linear-gradient(135deg, #f39c12, #e67e22) !important;
        color: #ffffff !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 2px 8px rgba(243, 156, 18, 0.4) !important;
        font-size: 11px !important;
        min-width: 18px !important;
        height: 18px !important;
        line-height: 14px !important;
      }
    }

    /* ✅ Responsive cho mobile */
    @media (max-width: 992px) {
      position: fixed !important;
      left: ${(props) => (props.collapsed ? "-256px" : "0")} !important;
      top: 0 !important;
      bottom: 0 !important;
      z-index: 1000 !important;
      transition: left 0.3s ease !important;
    }
  }
`;

const Logo = styled.div`
  height: 60px;
  margin: 16px 16px 24px 16px;
  background: linear-gradient(135deg, #e74c3c 0%, #c0392b 50%, #8e44ad 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(231, 76, 60, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "👑";
    position: absolute;
    top: 8px;
    right: 8px;
    font-size: 14px;
  }

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(231, 76, 60, 0.4);
    background: linear-gradient(135deg, #ec7063 0%, #e74c3c 50%, #a569bd 100%);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export default function AdminSidebar({ collapsed, setCollapsed }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Core admin menu items
  const coreItems = [
    {
      key: "/admin",
      icon: <DashboardOutlined />,
      label: collapsed ? null : <Link to="/admin">Dashboard</Link>,
      tooltip: "Dashboard",
    },
    {
      key: "/admin/users",
      icon: (
        <Badge count={12} size="small" offset={[8, -8]}>
          <UserOutlined />
        </Badge>
      ),
      label: collapsed ? null : <Link to="/admin/users">Người dùng</Link>,
      tooltip: "Quản lý người dùng (12 mới)",
    },
    {
      key: "/admin/posts",
      icon: (
        <Badge count={5} size="small" offset={[8, -8]}>
          <FileTextOutlined />
        </Badge>
      ),
      label: collapsed ? null : <Link to="/admin/posts">Bài viết</Link>,
      tooltip: "Quản lý bài viết (5 chờ duyệt)",
    },
    {
      key: "/admin/recruitments",
      icon: <TeamOutlined />,
      label: collapsed ? null : (
        <Link to="/admin/recruitments">Tuyển dụng</Link>
      ),
      tooltip: "Quản lý tuyển dụng",
    },
  ];

  // Analytics & Reports
  const analyticsItems = {
    key: "analytics-group",
    label: collapsed ? null : "Phân tích & Báo cáo",
    type: "group",
    children: [
      {
        key: "/admin/analytics",
        icon: <LineChartOutlined />,
        label: collapsed ? null : (
          <Link to="/admin/analytics">Phân tích dữ liệu</Link>
        ),
        tooltip: "Phân tích dữ liệu",
      },
      {
        key: "/admin/reports",
        icon: <BarChartOutlined />,
        label: collapsed ? null : <Link to="/admin/reports">Báo cáo</Link>,
        tooltip: "Báo cáo & Thống kê",
      },
      {
        key: "/admin/audit",
        icon: <AuditOutlined />,
        label: collapsed ? null : (
          <Link to="/admin/audit">Nhật ký hệ thống</Link>
        ),
        tooltip: "Nhật ký hệ thống",
      },
    ],
  };

  // Business & Finance
  const businessItems = {
    key: "business-group",
    label: collapsed ? null : "Kinh doanh & Tài chính",
    type: "group",
    children: [
      {
        key: "/admin/payments",
        icon: (
          <Badge count={3} size="small" offset={[8, -8]}>
            <CreditCardOutlined />
          </Badge>
        ),
        label: collapsed ? null : <Link to="/admin/payments">Thanh toán</Link>,
        tooltip: "Quản lý thanh toán (3 cần xử lý)",
      },
      {
        key: "/admin/subscriptions",
        icon: <GiftOutlined />,
        label: collapsed ? null : (
          <Link to="/admin/subscriptions">Gói dịch vụ</Link>
        ),
        tooltip: "Quản lý gói dịch vụ",
      },
    ],
  };

  // System & Security
  const systemItems = {
    key: "system-group",
    label: collapsed ? null : "Hệ thống & Bảo mật",
    type: "group",
    children: [
      {
        key: "/admin/moderation",
        icon: (
          <Badge count={8} size="small" offset={[8, -8]}>
            <EyeOutlined />
          </Badge>
        ),
        label: collapsed ? null : (
          <Link to="/admin/moderation">Kiểm duyệt</Link>
        ),
        tooltip: "Kiểm duyệt nội dung (8 chờ)",
      },
      {
        key: "/admin/security",
        icon: <SafetyCertificateOutlined />,
        label: collapsed ? null : <Link to="/admin/security">Bảo mật</Link>,
        tooltip: "Cài đặt bảo mật",
      },
      {
        key: "/admin/notifications",
        icon: <BellOutlined />,
        label: collapsed ? null : (
          <Link to="/admin/notifications">Thông báo</Link>
        ),
        tooltip: "Quản lý thông báo",
      },
      {
        key: "/admin/database",
        icon: <DatabaseOutlined />,
        label: collapsed ? null : (
          <Link to="/admin/database">Cơ sở dữ liệu</Link>
        ),
        tooltip: "Quản lý CSDL",
      },
    ],
  };

  // Combine all items
  const allItems = [
    ...coreItems,
    { type: "divider", key: "divider-1" },
    ...(collapsed ? analyticsItems.children : [analyticsItems]),
    { type: "divider", key: "divider-2" },
    ...(collapsed ? businessItems.children : [businessItems]),
    { type: "divider", key: "divider-3" },
    ...(collapsed ? systemItems.children : [systemItems]),
  ];

  return (
    <StyledSider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      breakpoint="lg"
      collapsedWidth="80"
      /* ✅ Bỏ inline styles cho fixed position */
    >
      <Logo
        onClick={() => navigate("/admin")}
        style={{
          cursor: "pointer",
          marginBottom: collapsed ? 16 : 24,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {collapsed ? (
          <Tooltip title="Admin Panel" placement="right">
            <span
              style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
            >
              AP
            </span>
          </Tooltip>
        ) : (
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: "16px" }}>
            Admin Panel
          </span>
        )}
      </Logo>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[pathname]}
        items={allItems.map((item) => {
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
          collapsed ? [] : ["analytics-group", "business-group", "system-group"]
        }
        style={{
          borderRight: "none",
          backgroundColor: "transparent",
          flex: 1,
          paddingBottom: "80px",
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
            pathname === "/admin/settings" ? ["/admin/settings"] : []
          }
          items={[
            {
              key: "/admin/settings",
              icon: collapsed ? (
                <Tooltip title="Cài đặt hệ thống" placement="right">
                  <SettingOutlined />
                </Tooltip>
              ) : (
                <SettingOutlined />
              ),
              label: collapsed ? null : (
                <Link to="/admin/settings">Cài đặt</Link>
              ),
            },
          ]}
          style={{
            borderRight: "none",
            backgroundColor: "transparent",
          }}
        />
      </div>
    </StyledSider>
  );
}
