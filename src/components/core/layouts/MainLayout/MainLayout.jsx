import React from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/elements/Header/Header";
import * as S from "./MainLayout.styles";

export default function MainLayout() {
  return (
    <S.LayoutWrapper>
      <Header />
      <S.Body>
        <Outlet />
      </S.Body>
    </S.LayoutWrapper>
  );
}
