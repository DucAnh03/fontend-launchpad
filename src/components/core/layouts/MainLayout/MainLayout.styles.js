import styled from "styled-components";

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => (theme === "dark" ? "#111" : "#fafafa")};
`;

export const Body = styled.main`
  padding-top: 60px; /* = chiều cao header */
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;
