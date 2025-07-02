// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// layouts
import AuthLayout from "@/components/core/layouts/AuthLayout/AuthLayout";
import MainLayout from "@/components/core/layouts/MainLayout/MainLayout";
import DashboardLayout from "@/components/core/layouts/DashboardLayout/DashboardLayout";
import ProfileLayout from "@/components/core/layouts/ProfileLayout/ProfileLayout";

// auth guard
import RequireAuth from "@/components/common/RequireAuth";

// pages – public
import SignInPage from "@/components/pages/Auth/SignInPage/SignIn";
import SignUpPage from "@/components/pages/Auth/SignUpPage/SignUp";
import OAuthCallback from "@/components/pages/Auth/Oauth-callback/oauth-callback";
import VerifySignUp from "@/components/pages/Auth/VerificationPage/VerifySignUp";


import SubscriptionPage from "@/components/pages/Payment/SubscriptionPage";
import PaymentSuccess from "@/components/pages/Payment/PaymentSuccess";
import PaymentFailed from "@/components/pages/Payment/PaymentFailed";

// pages – main
import RecruitmentPage from "@/components/pages/RecruitmentPage/Recruitment";
import CreateRecruitment from "@/components/pages/Profile/Recruitment/CreateRecruitment";
import RecruitmentDetail from "@/components/pages/Profile/Recruitment/RecruitmentDetail";
import PostPage from "@/components/pages/PostPage/PostPage";
import CommunityPage from "@/components/pages/Community/Community";
import PortfolioPage from "@/components/pages/Portfolio/Portfolio";

// pages – profile nested
import Overview from "@/components/pages/Profile/Overview";
import RecruitmentList from "@/components/pages/Profile/Recruitment/RecruitmentList";
import PostsList from "@/components/pages/Profile/PostsList";
import PortfolioList from "@/components/pages/Profile/PortfolioList";

// pages – dashboard
import WorkspacePage from "@/components/pages/Dashboard/WorkspacePage";
import WorkspaceProjectsPage from "@/components/pages/Dashboard/WorkspaceProjectsPage";
import ChatGroupPage from "@/components/pages/Dashboard/ChatGroupPage/ChatGroupPage";
import TasksPage from "@/components/pages/Dashboard/TasksPage";
import ProjectsPage from "@/components/pages/Dashboard/ProjectsPage";
import PerformancePage from "@/components/pages/Dashboard/PerformancePage";
import ChatPage from "@/components/pages/Chatpage/ChatPage"; 

export default function App() {
  return (
    <Routes>
      {/*** Public routes ***/}
      <Route element={<AuthLayout />}>
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/oauth-callback" element={<OAuthCallback />} />
        <Route path="/verify-signup" element={<VerifySignUp />} />
        <Route path="/subscription" element={<SubscriptionPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/failed" element={<PaymentFailed />} />
      </Route>

      {/*** Protected routes ***/}
      <Route element={<RequireAuth><MainLayout /></RequireAuth>}>
        <Route path="/" element={<Navigate to="/recruitment" replace />} />
        <Route path="/recruitment" element={<RecruitmentPage />} />
        <Route path="/recruitment/create" element={<CreateRecruitment />} />
        <Route path="/recruitment/:id" element={<RecruitmentDetail />} />
        <Route path="/posts" element={<PostPage />} />
        <Route path="/community" element={<CommunityPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />

        {/*** nested Profile ***/}
        <Route path="/profile" element={<ProfileLayout />}>
          <Route index element={<Overview />} />
          <Route path="recruitment" element={<RecruitmentList />} />
          <Route path="posts" element={<PostsList />} />
          <Route path="portfolio" element={<PortfolioList />} />
        </Route>
      </Route>

      {/*** Dashboard routes ***/}
      <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
        <Route path="/dashboard" element={<Navigate to="/dashboard/chat" replace />} />
        <Route path="/dashboard/workspace" element={<WorkspacePage />} />
        <Route path="/dashboard/workspace/:workspaceId/projects" element={<WorkspaceProjectsPage />} />
        <Route path="/dashboard/chat" element={<ChatGroupPage />} />
        <Route path="/dashboard/tasks" element={<TasksPage />} />
        <Route path="/dashboard/projects" element={<ProjectsPage />} />
        <Route path="/dashboard/performance" element={<PerformancePage />} />
        <Route path="/dashboard/messages/:userId" element={<ChatPage />} />
        <Route path="/dashboard/messages" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}
