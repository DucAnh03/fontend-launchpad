import styled from "styled-components";
import { Layout } from "antd";

export const StyledSider = styled(Layout.Sider)`
  min-height: 100vh;
  background-color: #3668b5 !important; /* Màu xanh đậm từ Bitrix24 */
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1); /* Đổ bóng nhẹ */
  padding-top: 12px;

  .ant-menu {
    background: transparent;
    font-size: 1.08rem;
    font-weight: 500;
    border-inline-end: none;
    color: #ffffff !important; /* Màu chữ trắng */
  }

  .ant-menu-item, .ant-menu-submenu-title {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.3s ease;
    color: #ffffff !important; /* Màu chữ trắng */
    padding-left: 24px !important; /* Tăng padding để tạo khoảng trống cho icon */

    &:hover {
      background-color: rgba(255, 255, 255, 0.1) !important; /* Nền trắng hơi trong suốt khi hover */
      color: #ffffff !important;
      transform: none; /* Bỏ hiệu ứng translateY */
    }
  }
  
  .ant-menu-item-selected {
    background-color: rgba(255, 255, 255, 0.15) !important; /* Nền trắng đậm hơn khi chọn */
    color: #ffffff !important;
    box-shadow: none; /* Bỏ đổ bóng */
  }

  .ant-menu-item .anticon, .ant-menu-submenu-title .anticon {
    font-size: 20px;
    color: #ffffff !important; /* Màu icon trắng */
  }

  .ant-menu-item-selected .anticon {
    color: #ffffff !important; /* Màu icon trắng khi chọn */
  }

  /* Style cho submenu header (ví dụ: "Hợp tác") */
  .ant-menu-submenu-title {
    font-size: 0.9rem; /* Nhỏ hơn một chút */
    font-weight: bold;
    color: #a0aec0 !important; /* Màu xám nhạt cho header */
    margin-bottom: 0px;
    padding-left: 16px !important; /* Padding cho header */

    &:hover {
      background-color: transparent !important; /* Header không thay đổi màu khi hover */
    }
  }
  
  .ant-menu-submenu-title .ant-menu-submenu-arrow {
    color: #a0aec0 !important; /* Màu mũi tên xám nhạt */
  }

  /* Kích thước và màu của badge */
  .ant-badge-count {
    background-color: #ff4d4f !important; /* Màu đỏ */
    box-shadow: none !important;
  }
`;

export const Logo = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff; /* Màu trắng cho logo */
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 16px;
  user-select: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: none; /* Bỏ hiệu ứng translateY */
    text-shadow: none; /* Bỏ đổ bóng text */
  }
`;