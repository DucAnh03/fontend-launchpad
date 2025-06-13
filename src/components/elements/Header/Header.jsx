import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge, Dropdown, Avatar, Menu, Button } from "antd";
import {
  SunOutlined,
  MoonOutlined,
  MessageOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useAuthContext } from "@/contexts/AuthContext";
import logoLight from "@/assets/logo.png";
import logoDark from "@/assets/logoDark.png";
import * as S from "./Header.styles";

export default function Header() {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // dark mode
  const [dark, setDark] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", dark);
    localStorage.setItem("darkMode", String(dark));
  }, [dark]);

  const routes = [
    { label: "Recruitment", path: "/" },
    { label: "Post", path: "/posts" },
    { label: "Community", path: "/community" },
    { label: "Portfolio", path: "/portfolio" },
  ];

  const profileMenu = (
    <Menu>
      <Menu.Item
        key="profile"
        icon={<UserOutlined />}
        onClick={() => navigate("/profile")}
      >
        Profile
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const themeProp = dark ? "dark" : "light";

  return (
    <S.HeaderWrapper theme={themeProp}>
      <S.HeaderInner>
        {/* Logo + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <img
            src={dark ? logoDark : logoLight}
            alt="Logo"
            height={40}
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />

          <S.Nav theme={themeProp}>
            <ul>
              {routes.map(({ label, path }) => (
                <li key={path}>
                  <Link to={path} active={pathname === path ? 1 : 0}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </S.Nav>
        </div>

        {/* Actions */}
        <S.Actions>


          <Link to="/messages" title="Messages">
            <Badge count={3}>
              <MessageOutlined />
            </Badge>
          </Link>

          <Link to="/notifications" title="Notifications">
            <Badge count={5}>
              <BellOutlined />
            </Badge>
          </Link>

          {!user && (
            <Link to="/signin">
              <Button type="primary">Login</Button>
            </Link>
          )}

          {user && (
            <Dropdown overlay={profileMenu} placement="bottomRight" arrow>
              <Avatar
                src={user.avatarUrl}
                icon={!user.avatarUrl && <UserOutlined />}
                style={{ cursor: "pointer", fontSize: "1rem" }}
              />
            </Dropdown>
          )}
        </S.Actions>
      </S.HeaderInner>
    </S.HeaderWrapper>
  );
}
