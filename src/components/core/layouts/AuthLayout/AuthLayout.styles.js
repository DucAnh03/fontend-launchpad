import styled from "styled-components";

export const LayoutWrapper = styled.div`
  min-height: 100vh;
  background: ${({ theme }) =>
    theme === "dark"
      ? "#0c0c0c"
      : `linear-gradient(
          0deg,
          rgb(120, 165, 51) 0%,
          rgb(117, 13, 13) 45%,
          rgb(17, 23, 134) 100%
        )`};
`;

export const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  backdrop-filter: blur(20px);
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
`;

export const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

export const Body = styled.div`
  padding-top: 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
`;
