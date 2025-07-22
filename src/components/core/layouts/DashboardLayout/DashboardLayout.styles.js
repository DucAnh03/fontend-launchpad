import styled, { keyframes } from "styled-components";
import { Layout } from "antd";

const { Sider, Header, Content } = Layout;

// Animation cho content fade-in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Animation cho hover effects
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0px); }
`;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(120, 119, 198, 0.3) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(255, 119, 198, 0.3) 0%,
        transparent 50%
      );
    pointer-events: none;
    z-index: 0;
  }
`;

export const StyledSider = styled(Sider)`
  && {
    transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: blur(20px);
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 4px 0 30px rgba(0, 0, 0, 0.1);
    z-index: 100;

    .ant-layout-sider-children {
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;

      /* Custom scrollbar */
      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 0, 0, 0.2);
      }
    }

    .ant-menu {
      background: transparent;
      color: #262626 !important;
      border-right: none;
      flex: 1;
      padding: 8px 0;
    }

    .ant-menu-item {
      color: #595959 !important;
      margin: 2px 8px;
      border-radius: 12px;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(
          90deg,
          transparent,
          rgba(24, 144, 255, 0.1),
          transparent
        );
        transition: left 0.5s;
      }

      &:hover::before {
        left: 100%;
      }
    }

    .ant-menu-item-selected {
      background: linear-gradient(135deg, #1890ff 0%, #36cfc9 100%) !important;
      color: #fff !important;
      box-shadow: 0 4px 15px rgba(24, 144, 255, 0.4);
      transform: translateX(2px);

      .anticon {
        color: #fff !important;
      }

      a {
        color: #fff !important;
      }
    }

    .ant-menu-item:hover:not(.ant-menu-item-selected) {
      background: rgba(24, 144, 255, 0.08) !important;
      color: #1890ff !important;
      transform: translateX(4px);

      .anticon {
        color: #1890ff !important;
        animation: ${float} 1s ease-in-out infinite;
      }
    }

    .ant-menu-item .anticon {
      color: #8c8c8c !important;
      font-size: 18px;
      transition: all 0.3s ease;
    }
  }
`;

export const Logo = styled.div`
  height: 64px;
  margin: 16px 12px 24px 12px;
  background: linear-gradient(135deg, #1890ff, #36cfc9);
  color: #fff;
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
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.3);

  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 8px 30px rgba(24, 144, 255, 0.4);
    background: linear-gradient(135deg, #40a9ff, #5cdbd3);
  }

  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

export const StyledHeader = styled(Header)`
  && {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(240, 240, 240, 0.8);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 72px;
    position: sticky;
    top: 0;
    z-index: 99;

    .trigger-btn {
      color: #595959;
      font-size: 18px;
      width: 48px;
      height: 48px;
      border-radius: 12px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #1890ff;
        background: rgba(24, 144, 255, 0.08);
        transform: scale(1.1) rotate(180deg);
      }
    }

    .notification-btn {
      color: #8c8c8c;
      font-size: 18px;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        color: #1890ff;
        background: rgba(24, 144, 255, 0.08);
        transform: scale(1.1);
      }
    }
  }
`;

export const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

export const PageTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  background: linear-gradient(135deg, #1890ff, #722ed1);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 12px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(24, 144, 255, 0.06);
    transform: translateY(-1px);
  }
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
`;

export const ContentWrapper = styled(Content)`
  margin: 24px;
  padding: 0;
  animation: ${fadeIn} 0.6s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 120px);

  /* Responsive scrolling */
  overflow-x: hidden;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(24, 144, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(24, 144, 255, 0.5);
    }
  }

  /* Smooth scrolling */
  scroll-behavior: smooth;

  @media (max-width: 768px) {
    margin: 16px;
    padding: 0 8px;
  }
`;

// Responsive breakpoints
export const ResponsiveContainer = styled.div`
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 1200px) {
    max-width: 1200px;
  }

  @media (min-width: 992px) and (max-width: 1199px) {
    max-width: 960px;
  }

  @media (min-width: 768px) and (max-width: 991px) {
    max-width: 720px;
  }

  @media (max-width: 767px) {
    padding: 0 16px;
  }
`;
