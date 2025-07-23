import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Result, Button } from "antd";
import { useAuthContext } from "@/contexts/AuthContext";
import { ExclamationCircleOutlined, HomeOutlined } from "@ant-design/icons";
import styled from "styled-components";

// Styled components for the access denied page
const AccessDeniedWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
        circle at 20% 80%,
        rgba(231, 76, 60, 0.2) 0%,
        transparent 50%
      ),
      radial-gradient(
        circle at 80% 20%,
        rgba(155, 89, 182, 0.2) 0%,
        transparent 50%
      );
    pointer-events: none;
  }
`;

const StyledResult = styled(Result)`
  && {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(20px);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 48px;
    margin: 24px;
    position: relative;
    z-index: 1;

    .ant-result-icon {
      .ant-result-icon-error {
        color: #e74c3c;
      }
    }

    .ant-result-title {
      color: #2c3e50;
      font-weight: 700;
      font-size: 24px;
    }

    .ant-result-subtitle {
      color: #7f8c8d;
      font-size: 16px;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 24px;

  .ant-btn {
    border-radius: 12px;
    height: 48px;
    padding: 0 24px;
    font-weight: 600;
    border: none;

    &.primary {
      background: linear-gradient(135deg, #e74c3c, #c0392b);
      color: white;
      box-shadow: 0 4px 15px rgba(231, 76, 60, 0.3);

      &:hover {
        background: linear-gradient(135deg, #ec7063, #e74c3c);
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(231, 76, 60, 0.4);
      }
    }

    &.secondary {
      background: rgba(255, 255, 255, 0.8);
      color: #2c3e50;
      border: 1px solid rgba(44, 62, 80, 0.2);

      &:hover {
        background: rgba(255, 255, 255, 1);
        color: #e74c3c;
        border-color: #e74c3c;
        transform: translateY(-2px);
      }
    }
  }
`;

export default function RequireAdmin({ children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Show loading state
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "18px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: 16 }}>🔐</div>
          Đang xác thực quyền admin...
        </div>
      </div>
    );
  }

  // Not logged in - redirect to signin with return url
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Not admin role - show access denied page
  if (user.role !== "admin") {
    return (
      <AccessDeniedWrapper>
        <StyledResult
          status="403"
          title="Truy cập bị từ chối"
          subTitle="Bạn không có quyền truy cập vào trang quản trị. Chỉ có quản trị viên mới có thể truy cập khu vực này."
          extra={
            <ActionButtons>
              <Button
                className="primary"
                size="large"
                icon={<HomeOutlined />}
                onClick={() => (window.location.href = "/")}
              >
                Về trang chủ
              </Button>
              <Button
                className="secondary"
                size="large"
                onClick={() => window.history.back()}
              >
                Quay lại
              </Button>
            </ActionButtons>
          }
        />
      </AccessDeniedWrapper>
    );
  }

  // User is admin - render admin content
  return children;
}
