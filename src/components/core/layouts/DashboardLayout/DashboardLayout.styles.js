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
`;

export const StyledSider = styled(Sider)`
  && {
    transition: width 0.3s ease;
    .ant-layout-sider-children {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
`;

export const Logo = styled.div`
  height: 32px;
  margin: 16px;
  width: 100%;
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  font-weight: bold;
  text-align: center;
  line-height: 32px;
  user-select: none;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;

export const StyledHeader = styled(Header)`
  && {
    background: #fff;
    padding: 0 16px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

export const ContentWrapper = styled(Content)`
  margin: 16px;
  animation: ${fadeIn} 0.3s ease-out;
`;
