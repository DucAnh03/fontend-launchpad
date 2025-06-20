import React from "react";
import { Menu } from "antd";
import {
    MessageOutlined,
    CheckSquareOutlined,
    ProjectOutlined,
    LineChartOutlined,
    HomeOutlined,
    TeamOutlined, // Icon cho Nhóm Làm việc
    FileTextOutlined, // Icon cho Bản tin
    CalendarOutlined, // Icon cho Lịch
    FolderOutlined, // Icon cho Tài liệu
    CloudOutlined, // Icon cho Drive
    MailOutlined, // Icon cho Webmail
    ToolOutlined, // Icon cho CRM
    ClockCircleOutlined, // Icon cho Đặt chỗ
    ShopOutlined, // Icon cho Quản lý kho hàng
    RocketOutlined, // Icon cho Tiếp thị
    ShoppingCartOutlined, // Icon cho Website và cửa hàng
    SettingOutlined, // Icon cho Cài đặt
    BlockOutlined, // Icon cho Dự án hợp tác (dùng tạm)
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as S from "../SidebarBase.styles";
import styled from "styled-components";
import { Layout } from "antd";


// // Dashboard ở dashboard    
// export const StyledSider = styled(Layout.Sider)`
//   min-height: 100vh;
//   background: transparent !important;
//   backdrop-filter: blur(12px);
//   border-top-right-radius: 18px;
//   border-bottom-right-radius: 18px;
//   box-shadow: 2px 0 8px rgba(80, 80, 160, 0.08);
//   padding-top: 12px;
//   // ... các style khác
// `;

export default function DashboardSidebar({ collapsed, setCollapsed }) {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const items = [
        // Mục "Hợp tác" - SubMenu
        {
            key: "collaboration",
            label: "Hợp tác",
            icon: <TeamOutlined />, // Icon cho Hợp tác, có thể thay đổi
            type: 'group', // Để tạo header cho nhóm
            children: [
                {
                    key: "/dashboard/chat",
                    icon: (
                        <Badge count={1} offset={[-10, 0]}> {/* Offset để điều chỉnh vị trí badge */}
                            <MessageOutlined />
                        </Badge>
                    ),
                    label: <Link to="/dashboard/chat">Trình nhắn tin</Link>,
                },
                {
                    key: "/dashboard/news", // Giả định route cho Bản tin
                    icon: <FileTextOutlined />,
                    label: <Link to="/dashboard/news">Bản tin</Link>,
                },
                {
                    key: "/dashboard/cooperative-projects", // Giả định route cho Dự án hợp tác
                    icon: <BlockOutlined />,
                    label: <Link to="/dashboard/cooperative-projects">Dự án hợp tác</Link>,
                },
                {
                    key: "/dashboard/calendar", // Giả định route cho Lịch
                    icon: <CalendarOutlined />,
                    label: <Link to="/dashboard/calendar">Lịch</Link>,
                },
                {
                    key: "/dashboard/documents", // Giả định route cho Tài liệu
                    icon: <FolderOutlined />,
                    label: <Link to="/dashboard/documents">Tài liệu</Link>,
                },
                {
                    key: "/dashboard/drive", // Giả định route cho Drive
                    icon: <CloudOutlined />,
                    label: <Link to="/dashboard/drive">Drive</Link>,
                },
                {
                    key: "/dashboard/webmail", // Giả định route cho Webmail
                    icon: <MailOutlined />,
                    label: <Link to="/dashboard/webmail">Webmail</Link>,
                },
                {
                    key: "/dashboard/work-groups", // Giả định route cho Nhóm làm việc
                    icon: <TeamOutlined />,
                    label: <Link to="/dashboard/work-groups">Nhóm Làm việc</Link>,
                },
            ],
        },
        // Mục "Tác vụ và Dự án"
        {
            key: "/dashboard/tasks", // Sử dụng lại route tasks cũ
            icon: (
                <Badge count={1} offset={[-10, 0]}> {/* Offset để điều chỉnh vị trí badge */}
                    <CheckSquareOutlined />
                </Badge>
            ),
            label: <Link to="/dashboard/tasks">Tác vụ và Dự án</Link>,
        },
    ];

    return (
        <S.StyledSider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            breakpoint="lg"
            collapsedWidth="80" // Đảm bảo khi collapse icon vẫn hiển thị rõ
        >
            <S.Logo onClick={() => navigate("/")}
                style={{ cursor: "pointer", marginBottom: collapsed ? 24 : 16 }} // Điều chỉnh margin bottom
            >
                {/* Logo khi collapsed (chỉ icon) và khi mở rộng (icon + text) */}
                {collapsed ? (
                    <HomeOutlined style={{ fontSize: 24 }} />
                ) : (
                    <>
                        <HomeOutlined style={{ fontSize: 24, marginRight: 8 }} />
                        <span>Trang chủ</span>
                    </>
                )}
            </S.Logo>
            <Menu
                theme="dark" // Giữ theme dark để menu tự động điều chỉnh màu chữ/nền nếu cần
                mode="inline"
                selectedKeys={[pathname]}
                items={items}
                defaultOpenKeys={['collaboration']} // Mở mặc định phần "Hợp tác"
            />
        </S.StyledSider>
    );
}