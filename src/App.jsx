// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import AuthLayout from "@/components/core/layouts/AuthLayout/AuthLayout";
import MainLayout from "@/components/core/layouts/MainLayout/MainLayout";

import SignInPage from "@/components/pages/Auth/SignInPage/SignIn";
import SignUpPage from "@/components/pages/Auth/SignUpPage/SignUp";
import RecruitmentPage from "@/components/pages/RecruitmentPage/Recruitment";
import PostPage from "@/components/pages/PostPage/PostPage";
import CommunityPage from "@/components/pages/Community/Community";
import PortfolioPage from "@/components/pages/Portfolio/Portfolio";

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Route>

      {/* Main routes */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
      </Route>
    </Routes>
  );
}
