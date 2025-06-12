import React from "react";
import { Menu } from "antd";
import {
    MessageOutlined,
    CheckSquareOutlined,
    ProjectOutlined,
    LineChartOutlined,
    HomeOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "./SidebarBase.styles";

export default function AppSidebar({ isDashboard, collapsed, setCollapsed }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
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
        <S.StyledSider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
        >
            {isDashboard && (
                <S.Logo onClick={() => navigate("/")}
                    style={{ cursor: "pointer", marginBottom: 8 }}
                >
                    <HomeOutlined style={{ fontSize: 24, marginRight: collapsed ? 0 : 8 }} />
                    {!collapsed && "Trang chủ"}
                </S.Logo>
            )}
            <S.Logo>
                {collapsed ? "DP" : "Dashboard"}
            </S.Logo>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[pathname]}
                items={items}
            />
        </S.StyledSider>
    );
} 