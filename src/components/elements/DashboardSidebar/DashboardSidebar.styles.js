import styled from "styled-components";
import { Layout } from "antd";

export const StyledSider = styled(Layout.Sider)`
  min-height: 100vh;
  background: rgba(255,255,255,0.08) !important;
  backdrop-filter: blur(12px);
  border-top-right-radius: 18px;
  border-bottom-right-radius: 18px;
  box-shadow: 2px 0 8px rgba(80, 80, 160, 0.08);
  padding-top: 12px;
  .ant-menu {
    background: transparent;
    font-size: 1.08rem;
    font-weight: 500;
    border-inline-end: none;
    color: #222 !important;
  }
  .ant-menu-item {
    border-radius: 8px;
    margin: 4px 8px;
    transition: background 0.2s, color 0.2s;
    color: #222 !important;
  }
  .ant-menu-item-selected {
    background: rgba(255,255,255,0.18) !important;
    color: #1890ff !important;
  }
  .ant-menu-item:hover {
    background: rgba(255,255,255,0.12) !important;
    color: #1890ff !important;
  }
  .ant-menu-item .anticon {
    font-size: 20px;
    color: #222 !important;
  }
`;

export const LogoHome = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${props => (props.collapsed ? 'center' : 'flex-start')};
  color: #000;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  padding: 12px 18px 8px 18px;
  margin-bottom: 4px;
  border-radius: 8px;
  transition: background 0.2s;
  &:hover {
    background: rgba(255,255,255,0.12);
    color: #1890ff;
  }
`;

export const Logo = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #222;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 16px;
`; 