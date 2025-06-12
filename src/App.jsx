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
      </Route>

      {/*** Main routes (no auth required) ***/}
      <Route element={<MainLayout />}>
        <Route path="/" element={<RecruitmentPage />} />
        <Route path="/post" element={<PostPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/*** Dashboard routes (auth required) ***/}
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        {/* Khi truy cập /dashboard sẽ tự redirect tới /dashboard/chat */}
        <Route index element={<Navigate to="chat" replace />} />

        <Route path="chat" element={<ChatGroupPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="performance" element={<PerformancePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
