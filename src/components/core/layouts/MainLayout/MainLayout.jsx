import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "@/components/elements/Header/Header";
import AppSidebar from "@/components/elements/AppSidebar";
import * as S from "./MainLayout.styles";

export default function MainLayout() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isHome = pathname === '/';
  return (
    <S.LayoutWrapper style={{ display: 'flex', minHeight: '100vh' }}>
      {isHome && (
        <AppSidebar isDashboard={false} collapsed={collapsed} setCollapsed={setCollapsed} />
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <S.Body>
          <Outlet />
        </S.Body>
      </div>
    </S.LayoutWrapper>
  );
}
