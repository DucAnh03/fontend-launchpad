import React, { useState } from "react";
import { Layout, Menu, Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MessageOutlined,
  CheckSquareOutlined,
  ProjectOutlined,
  LineChartOutlined,
} from "@ant-design/icons";
import { Link, Outlet, useLocation } from "react-router-dom";
import * as S from "./DashboardLayout.styles";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  const items = [
    {
      key: "/dashboard/chat",
      icon: <MessageOutlined />,
      label: <Link to="/dashboard/chat">Nhóm chat</Link>,
    },
    {
      key: "/dashboard/tasks",
      icon: <CheckSquareOutlined />,
      label: <Link to="/dashboard/tasks">Tasks</Link>,
    },
    {
      key: "/dashboard/projects",
      icon: <ProjectOutlined />,
      label: <Link to="/dashboard/projects">Dự án</Link>,
    },
    {
      key: "/dashboard/performance",
      icon: <LineChartOutlined />,
      label: <Link to="/dashboard/performance">Hiệu suất</Link>,
    },
  ];

  return (
    <S.StyledLayout>
      <S.StyledSider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
      >
        <S.Logo onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? "DP" : "Dashboard"}
        </S.Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          items={items}
        />
      </S.StyledSider>

      <Layout>
        <S.StyledHeader>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 40,
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "rotate(180deg)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "rotate(0deg)")
            }
          />
          <h2 style={{ margin: 0, transition: "color 0.3s" }}>Chào, User!</h2>
        </S.StyledHeader>

        <S.ContentWrapper>
          <Outlet />
        </S.ContentWrapper>
      </Layout>
    </S.StyledLayout>
  );
}
