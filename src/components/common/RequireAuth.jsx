// src/components/common/RequireAuth.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

export default function RequireAuth({ children }) {
  const { user, loading } = useAuthContext();
  const location = useLocation();

  // Nếu còn đang loading thông tin user, bạn có thể hiển thị spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  // Nếu chưa login, redirect về /signin và nhớ đường dẫn hiện tại
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Nếu đã login thì render children (DashboardLayout, vv)
  return children;
}
