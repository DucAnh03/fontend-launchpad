import React, { useState } from "react";
import { Layout, Button, Avatar, Dropdown, Space, Typography } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/elements/AppSidebar";
import * as S from "./DashboardLayout.styles";
import { useAuthContext } from "@/contexts/AuthContext";

const { Text } = Typography;

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();
  const location = useLocation();

  // Get page title based on route
  const getPageTitle = (pathname) => {
    const routes = {
      "/dashboard": "Tổng quan",
      "/dashboard/workspace": "Workspace",
      "/dashboard/chat": "Nhóm chat",
      "/dashboard/tasks": "Tác vụ và Dự án",
      "/dashboard/projects": "Dự án",
      "/dashboard/calendar": "Lịch",
      "/dashboard/performance": "Hiệu suất",
      "/dashboard/news": "Bản tin",
      "/dashboard/documents": "Tài liệu",
      "/dashboard/drive": "Drive",
      "/dashboard/webmail": "Webmail",
      "/dashboard/work-groups": "Nhóm làm việc",
    };
    return routes[pathname] || "Dashboard";
  };

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
  ];

  return (
    <S.StyledLayout>
      <AppSidebar
        isDashboard={true}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />
      <Layout style={{ background: "#f5f7fa" }}>
        <S.StyledHeader>
          <S.HeaderLeft>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-btn"
            />
            <S.PageTitle>{getPageTitle(location.pathname)}</S.PageTitle>
          </S.HeaderLeft>

          <S.HeaderRight>
            <Space size="middle">
              <Button
                type="text"
                icon={<BellOutlined />}
                className="notification-btn"
                size="large"
              />
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                arrow
              >
                <S.UserSection>
                  <Avatar
                    size="default"
                    icon={<UserOutlined />}
                    style={{ backgroundColor: "#1890ff" }}
                  />
                  <S.UserInfo>
                    <Text strong style={{ color: "#262626" }}>
                      {user?.name || "User"}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {user?.role || "Thành viên"}
                    </Text>
                  </S.UserInfo>
                </S.UserSection>
              </Dropdown>
            </Space>
          </S.HeaderRight>
        </S.StyledHeader>

        <S.ContentWrapper>
          <Outlet />
        </S.ContentWrapper>
      </Layout>
    </S.StyledLayout>
  );
}
