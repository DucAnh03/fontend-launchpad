import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { message } from "antd";
import api from "@/services/api/axios";

export default function OAuthCallback() {
  const { setUser } = useAuthContext();
  const navigate = useNavigate();
  const search = new URLSearchParams(useLocation().search);
  const token = search.get("token");

  useEffect(() => {
    if (!token) return navigate("/signin");
    localStorage.setItem("token", token);

    (async () => {
      try {
        const { data } = await api.get("/users/profile");
        const user = data.data;
        setUser(user);

        // Role-based routing - chỉ thêm phần này
        const userRole = user.role;
        if (userRole === "admin") {
          message.success(`Chào mừng Admin ${user.name}! 👑`);
          navigate("/admin");
        } else if (userRole === "leader") {
          message.success(`Chào mừng ${user.name}! 🎉`);
          navigate("/dashboard");
        } else {
          message.success(`Chào mừng ${user.name}! 🎉`);
          navigate("/");
        }
      } catch {
        message.error("Đăng nhập thất bại!");
        navigate("/signin");
      }
    })();
  }, [token, navigate, setUser]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <div
        style={{
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.1)",
          padding: "32px",
          borderRadius: "16px",
          backdropFilter: "blur(10px)",
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔐</div>
        <h3 style={{ color: "white", margin: 0 }}>Đang đăng nhập...</h3>
      </div>
    </div>
  );
}
