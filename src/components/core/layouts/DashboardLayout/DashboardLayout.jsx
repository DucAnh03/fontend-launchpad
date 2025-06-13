import React, { useState } from "react";
import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Outlet, useLocation } from "react-router-dom";
import AppSidebar from "@/components/elements/AppSidebar";
import * as S from "./DashboardLayout.styles";
import { useAuthContext } from "@/contexts/AuthContext";

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuthContext();

  return (
    <S.StyledLayout>
      <AppSidebar isDashboard={true} collapsed={collapsed} setCollapsed={setCollapsed} />
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
          <h2 style={{ margin: 0, transition: "color 0.3s" }}>
            Chào, {user?.name || 'User'}!
          </h2>
        </S.StyledHeader>
        <S.ContentWrapper>
          <Outlet />
        </S.ContentWrapper>
      </Layout>
    </S.StyledLayout>
  );
}
