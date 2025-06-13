import styled from "styled-components";

// wrapper toàn trang header
export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${({ theme }) => theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid ${({ theme }) => theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)"};
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

// inner để căn giữa, giới hạn độ rộng
export const HeaderInner = styled.div`
  max-width: 1200px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

// nav links
export const Nav = styled.nav`
  ul {
    display: flex;
    gap: 1.5rem;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 1rem;
    line-height: 60px;
  }
  a {
    color: ${({ theme, active }) =>
      active
        ? "#1890ff"
        : theme === "dark"
        ? "#fff"
        : "#333"};
    text-decoration: none;
    font-weight: ${({ active }) => (active ? 600 : 400)};
    transition: all 0.3s ease;
    &:hover {
      color: #1890ff;
      transform: translateY(-2px);
    }
  }
`;

// vùng chứa icon, button
export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
  color: ${({ theme }) => (theme === "dark" ? "#fff" : "#333")};
  
  a {
    color: ${({ theme }) => (theme === "dark" ? "#fff" : "#333")};
    transition: all 0.3s ease;
    &:hover {
      color: #1890ff;
      transform: translateY(-2px);
    }
  }
  
  .ant-btn-primary {
    background: linear-gradient(to right, #667eea, #764ba2);
    border: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
    }
  }
`;
