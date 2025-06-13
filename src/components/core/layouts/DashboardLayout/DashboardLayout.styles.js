import styled, { keyframes } from "styled-components";
import { Layout } from "antd";

const { Sider, Header, Content } = Layout;

// animation cho content fade-in
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background:rgb(186, 129, 185);
`;

export const StyledSider = styled(Sider)`
  && {
    transition: width 0.3s ease;
    background: #fff !important;
    .ant-layout-sider-children {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .ant-menu {
      background: transparent;
      color: #222 !important;
    }
    .ant-menu-item {
      color: #222 !important;
    }
    .ant-menu-item-selected {
      background: #e6f7ff !important;
      color: #1890ff !important;
    }
    .ant-menu-item:hover {
      background: #f5f5f5 !important;
      color: #1890ff !important;
    }
    .ant-menu-item .anticon {
      color: #222 !important;
    }
    .ant-menu-item-selected .anticon {
      color: #1890ff !important;
    }
  }
`;

export const Logo = styled.div`
  height: 32px;
  margin: 16px;
  width: 100%;
  background: #f5f5f5;
  color: #222;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  user-select: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  &:hover {
    background: #e6f7ff;
    color: #1890ff;
  }
`;

export const StyledHeader = styled(Header)`
  && {
    background: #fff;
    border-bottom: 1px solid #eee;
    box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    padding: 0 16px;
    display: flex;
    align-items: center;
    h2 {
      color: #222;
      margin: 0;
    }
    .ant-btn {
      color: #222;
      &:hover {
        color: #1890ff;
        background: #f5f5f5;
      }
    }
  }
`;

export const ContentWrapper = styled(Content)`
  margin: 16px;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  z-index: 1;
  color: #222;
`;
