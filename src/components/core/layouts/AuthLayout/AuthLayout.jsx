import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { Flex } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

import Button from "@/components/common/Button/index";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logoDark.png";

import * as S from "./AuthLayout.styles";

export default function AuthLayout() {
  // Dark mode state + persistence
  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", dark);
    localStorage.setItem("darkMode", dark);
  }, [dark]);

  const location = useLocation();

  return (
    <S.LayoutWrapper>
      <S.Body>
        {/* Các trang con (SignIn, SignUp) sẽ render ở đây */}
        <Outlet />
      </S.Body>
    </S.LayoutWrapper>
  );
}
