import styled from "styled-components";

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => (theme === "dark" ? "#111" : "#fafafa")};
`;

export const Body = styled.main`
  position: relative;
  z-index: 1;
  padding: 2rem;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
`;
