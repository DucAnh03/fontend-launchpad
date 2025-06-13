import styled from "styled-components";
import { Layout } from "antd";

export const StyledSider = styled(Layout.Sider)`
  min-height: 100vh;
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-right: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  padding-top: 12px;
  
  .ant-menu {
    background: transparent;
    font-size: 1.08rem;
    font-weight: 500;
    border-inline-end: none;
    color: rgba(210, 104, 104, 0.8) !important;
  }
  
  .ant-menu-item {
    border-radius: 8px;
    margin: 4px 8px;
    transition: all 0.3s ease;
    color: rgba(193, 93, 93, 0.8) !important;
    
    &:hover {
      background: rgba(177, 82, 82, 0.2) !important;
      color: #fff !important;
      transform: translateY(-2px);
    }
  }
  
  .ant-menu-item-selected {
    background: rgba(255, 255, 255, 0.25) !important;
    color: #fff !important;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
  
  .ant-menu-item .anticon {
    font-size: 20px;
    color: rgba(173, 135, 135, 0.8) !important;
  }
  
  .ant-menu-item-selected .anticon {
    color: #fff !important;
  }
`;

export const Logo = styled.div`
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color:rgb(207, 100, 100);
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 16px;
  user-select: none;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    text-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
`; 