import styled from "styled-components";

// wrapper toàn trang header
export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: ${({ theme }) => (theme === "dark" ? "#222" : "#fff")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
        ? theme === "dark"
          ? "#ffd700"
          : "#1890ff"
        : theme === "dark"
        ? "#ccc"
        : "#555"};
    text-decoration: none;
    font-weight: ${({ active }) => (active ? 600 : 400)};
    &:hover {
      opacity: 0.8;
    }
  }
`;

// vùng chứa icon, button
export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.25rem;
`;
