// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
 * @property {'user'|'admin'} role
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
        .get("/users/me")
        .then((res) => setUser(res.data.data))
        .catch(() => {
          localStorage.removeItem("token");
          setUser(null);
        });
    }
  }, []);

  // Login bình thường
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      // giả sử backend trả: { success, data: { token, user } }
      const { token, user: u } = res.data.data;
      localStorage.setItem("token", token);
      setUser(u);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  // OAuth Google
  const loginWithGoogle = () => {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  };

  // OAuth Facebook
  const loginWithFacebook = () => {
    window.location.href = `${api.defaults.baseURL}/auth/facebook`;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/signin");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        loginWithFacebook,
        logout,
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
