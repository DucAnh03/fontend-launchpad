// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import api from "@/services/api/axios";

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} name
 * @property {string} username
 * @property {string} email
 * @property {string} [avatarUrl]
 * @property {string} [bio]
 * @property {number} level
 * @property {number} points
 * @property {string} userRank
 * @property {boolean} isVerified
 * @property {boolean} isUnlimited
 * @property {'user'|'leader'|'admin'} role
 * @property {Object} subscription
 * @property {{ skill: string, level: number, createdAt: string }[]} skills
 * @property {string[]} followers
 * @property {string[]} following
 * @property {number} followerCount
 * @property {number} followingCount
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {boolean} loading
 * @property {(email: string, password: string)=>Promise<void>} login
 * @property {()=>void} loginWithGoogle
 * @property {()=>void} loginWithFacebook
 * @property {()=>void} logout
 * @property {(userData: Partial<User>)=>void} setUser
 * @property {(role: string)=>boolean} hasRole
 * @property {(roles: string[])=>boolean} hasAnyRole
 * @property {()=>boolean} isAdmin
 * @property {()=>boolean} isLeaderOrAdmin
 */

const AuthContext = createContext(/** @type {AuthContextType|null} */ (null));

export function AuthProvider({ children }) {
  const [user, setUser] = useState(/** @type {User|null} */ (null));
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Khi mount: nếu đã có token, fetch profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      api
        .get("/users/profile")
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  // Helper function for role-based routing
  const performRoleBasedRouting = (user) => {
    if (!user) return;

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
  };

  // Login bình thường với admin routing
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { accessToken, user: u } = res.data.data;
      localStorage.setItem("token", accessToken);
      setUser(u);

      // Role-based routing
      performRoleBasedRouting(u);
    } catch (error) {
      console.error("Login error:", error);
      message.error("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Giữ nguyên OAuth Google logic
  const loginWithGoogle = () => {
    const base = `${api.defaults.baseURL}/auth/google`;
    const url = `${base}?prompt=select_account`;
    window.location.href = url;
  };

  // Giữ nguyên Facebook OAuth (nếu có)
  const loginWithFacebook = () => {
    const base = `${api.defaults.baseURL}/auth/facebook`;
    window.location.href = base;
  };

  const loginWithGithub = () => {
    window.location.href = `${api.defaults.baseURL}/auth/github`;
  };

  // Handle OAuth success - gọi từ oauth callback
  const handleOAuthSuccess = (userData) => {
    setUser(userData);
    performRoleBasedRouting(userData);
  };

  // Logout với thông báo
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    message.success("Đăng xuất thành công! 👋");
    navigate("/signin");
  };

  // Helper functions for role checking
  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isLeaderOrAdmin = () => {
    return ["leader", "admin"].includes(user?.role);
  };

  const isVerified = () => {
    return user?.isVerified === true;
  };

  const isPremium = () => {
    return (
      user?.subscription?.status === "active" || user?.isUnlimited === true
    );
  };

  const getDisplayName = () => {
    return user?.name || user?.username || "User";
  };

  const getAvatarUrl = () => {
    return user?.avatarUrl || user?.avatar?.url || "";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        loginWithGithub,
        handleOAuthSuccess, // Thêm function này
        logout,
        setUser,
        hasRole,
        hasAnyRole,
        isAdmin,
        isLeaderOrAdmin,
        isVerified,
        isPremium,
        getDisplayName,
        getAvatarUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook tiện lợi để dùng trong component
 * @returns {AuthContextType}
 */
export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be inside <AuthProvider>");
  return ctx;
}
