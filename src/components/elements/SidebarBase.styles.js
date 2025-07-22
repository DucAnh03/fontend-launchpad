// SidebarBase.styles.js - FIX BLUR ISSUE

import styled, { keyframes } from "styled-components";
import { Layout } from "antd";

const slideIn = keyframes`
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
`;

export const StyledSider = styled(Layout.Sider)`
  && {
    min-height: 100vh;
    /* ❌ Bỏ backdrop-filter gây mờ */
    background: #2c3e50 !important; /* Solid background thay vì gradient */
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    position: relative;
    animation: ${slideIn} 0.3s ease-out;

    /* ❌ Bỏ pseudo element ::before gây overlay mờ */
    /* &::before {
      content: '';
      position: absolute;
      ...
      backdrop-filter: blur(10px); // ← Đây là nguyên nhân gây mờ
    } */

    .ant-layout-sider-children {
      overflow-x: hidden;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(255, 255, 255, 0.2);
        border-radius: 3px;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .ant-menu {
      background: transparent !important;
      border-right: none !important;
      color: #ecf0f1 !important;
      position: relative;
      z-index: 2;
      padding: 8px 0;
    }

    .ant-menu-item,
    .ant-menu-submenu-title {
      color: #bdc3c7 !important;
      border-radius: 12px !important;
      margin: 3px 8px !important;
      padding: 12px 24px !important;
      height: auto !important;
      line-height: 1.5 !important;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
      position: relative;
      overflow: hidden;
      background: transparent !important; /* Đảm bảo background trong suốt */

      &:hover {
        color: #3498db !important;
        background: rgba(52, 152, 219, 0.1) !important;
        transform: translateX(4px);
        box-shadow: 0 4px 15px rgba(52, 152, 219, 0.2);

        .anticon {
          color: #3498db !important;
        }
      }
    }

    .ant-menu-item-selected {
      background: linear-gradient(135deg, #3498db, #2980b9) !important;
      color: #ffffff !important;
      box-shadow: 0 4px 20px rgba(52, 152, 219, 0.4);
      transform: translateX(6px);

      .anticon {
        color: #ffffff !important;
      }

      a {
        color: #ffffff !important;
      }
    }

    .ant-menu-item .anticon,
    .ant-menu-submenu-title .anticon {
      font-size: 18px !important;
      margin-right: 12px !important;
      color: #95a5a6 !important;
      transition: all 0.3s ease !important;
    }

    .ant-menu-item-group-title {
      color: #7f8c8d !important;
      font-size: 12px !important;
      font-weight: 600 !important;
      text-transform: uppercase !important;
      letter-spacing: 0.5px !important;
      padding: 16px 24px 8px !important;
      margin: 0 !important;
      background: transparent !important; /* Đảm bảo không bị mờ */

      &::after {
        content: "";
        display: block;
        width: 30px;
        height: 1px;
        background: linear-gradient(90deg, #7f8c8d, transparent);
        margin-top: 8px;
      }
    }

    .ant-menu-submenu-arrow {
      color: #7f8c8d !important;
      transition: all 0.3s ease !important;
    }

    .ant-menu-submenu-open .ant-menu-submenu-arrow {
      color: #3498db !important;
      transform: rotate(90deg);
    }

    .ant-menu-item-divider {
      background: rgba(255, 255, 255, 0.1) !important;
      margin: 8px 16px !important;
      height: 1px !important;
    }

    .ant-badge {
      .ant-badge-count {
        background: linear-gradient(135deg, #e74c3c, #c0392b) !important;
        color: #ffffff !important;
        border: 2px solid rgba(255, 255, 255, 0.2) !important;
        box-shadow: 0 2px 8px rgba(231, 76, 60, 0.4) !important;
        font-size: 11px !important;
        min-width: 18px !important;
        height: 18px !important;
        line-height: 14px !important;
      }
    }

    .ant-layout-sider-trigger {
      background: linear-gradient(135deg, #34495e, #2c3e50) !important;
      border-top: 1px solid rgba(255, 255, 255, 0.1) !important;
      color: #bdc3c7 !important;
      transition: all 0.3s ease !important;

      &:hover {
        background: linear-gradient(135deg, #3498db, #2980b9) !important;
        color: #ffffff !important;
      }
    }

    @media (max-width: 768px) {
      position: fixed !important;
      z-index: 1001 !important;
      height: 100vh !important;
    }
  }
`;

export const Logo = styled.div`
  height: 60px;
  margin: 16px 16px 24px 16px;
  background: linear-gradient(135deg, #3498db 0%, #2980b9 50%, #1abc9c 100%);
  color: #ffffff;
  font-weight: 700;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(52, 152, 219, 0.3);
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(52, 152, 219, 0.4);
    background: linear-gradient(135deg, #5dade2 0%, #3498db 50%, #48c9b0 100%);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

// ✅ Alternative: Clean version without blur effects
export const StyledSiderClean = styled(Layout.Sider)`
  && {
    min-height: 100vh;
    background: #2c3e50 !important; /* Solid color - không mờ */
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    border-right: none;

    .ant-layout-sider-children {
      overflow-y: auto;
    }

    .ant-menu {
      background: transparent;
      border-right: none;
      color: #ffffff;
    }

    .ant-menu-item {
      color: #ecf0f1 !important;
      border-radius: 8px;
      margin: 4px 8px;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.1) !important;
        color: #3498db !important;
      }
    }

    .ant-menu-item-selected {
      background: #3498db !important;
      color: #ffffff !important;

      .anticon {
        color: #ffffff !important;
      }
    }

    .ant-menu-item .anticon {
      font-size: 18px;
      color: #ecf0f1 !important;
    }
  }
`;
