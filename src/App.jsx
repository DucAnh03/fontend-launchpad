// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// layouts
import AuthLayout from "@/components/core/layouts/AuthLayout/AuthLayout";
import MainLayout from "@/components/core/layouts/MainLayout/MainLayout";
import DashboardLayout from "@/components/core/layouts/DashboardLayout/DashboardLayout";

// auth guard
import RequireAuth from "@/components/common/RequireAuth";

// pages – public
import SignInPage from "@/components/pages/Auth/SignInPage/SignIn";
import SignUpPage from "@/components/pages/Auth/SignUpPage/SignUp";
import OAuthCallback from "@/components/pages/Auth/Oauth-callback/oauth-callback";
import VerifySignUp from "@/components/pages/Auth/VerificationPage/VerifySignUp";
// pages – main
import RecruitmentPage from "@/components/pages/RecruitmentPage/Recruitment";
import PostPage from "@/components/pages/PostPage/PostPage";
import CommunityPage from "@/components/pages/Community/Community";
import PortfolioPage from "@/components/pages/Portfolio/Portfolio";
import Profile from '@/components/pages/Profile/Profile';

// pages – dashboard
import ChatGroupPage from "@/components/pages/Dashboard/ChatGroupPage";
import TasksPage from "@/components/pages/Dashboard/TasksPage";
import ProjectsPage from "@/components/pages/Dashboard/ProjectsPage";
import PerformancePage from "@/components/pages/Dashboard/PerformancePage";

export default function App() {
  return (
    <Routes>
      {/*** Public routes ***/}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/verify-signup" element={<VerifySignUp />} />
      </Route>

      {/*** Protected routes ***/}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/recruitment" replace />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/*** Dashboard routes ***/}
      <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Navigate to="/dashboard/chat" replace />} />
        <Route path="/dashboard/chat" element={<ChatGroupPage />} />
        <Route path="/dashboard/tasks" element={<TasksPage />} />
        <Route path="/dashboard/projects" element={<ProjectsPage />} />
        <Route path="/dashboard/performance" element={<PerformancePage />} />
      </Route>
    </Routes>
  );
}
