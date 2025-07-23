import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// layouts
import AuthLayout from "@/components/core/layouts/AuthLayout/AuthLayout";
import MainLayout from "@/components/core/layouts/MainLayout/MainLayout";
import DashboardLayout from "@/components/core/layouts/DashboardLayout/DashboardLayout";
import ProfileLayout from "@/components/core/layouts/ProfileLayout/ProfileLayout";
import AdminLayout from "@/components/core/layouts/AdminLayout/AdminLayout"; // New Admin Layout

// auth guard
import RequireAuth from "@/components/common/RequireAuth";
import RequireAdmin from "@/components/common/RequireAdmin"; // New Admin Guard

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
import ChatGroupPage from "@/components/pages/Dashboard/ChatGroupPage";
import TasksPage from "@/components/pages/Dashboard/TasksPage";
import ProjectsPage from "@/components/pages/Dashboard/ProjectsPage";
import PerformancePage from "@/components/pages/Dashboard/PerformancePage";
import CalendarPage from "@/components/pages/Dashboard/CalendarPage";
import WorkGroupsPage from '@/components/pages/Dashboard/WorkGroupsPage';

// pages – admin
import AdminDashboard from "@/components/pages/admin/AdminDashboard";
import UsersManagement from "@/components/pages/admin/UsersManagement";
import PaymentsManagement from "@/components/pages/admin/PaymentsManagement";
// import PostsManagement from "@/components/pages/admin/PostsManagement";
// import RecruitmentsManagement from "@/components/pages/admin/RecruitmentsManagement";
// import AnalyticsPage from "@/components/pages/admin/AnalyticsPage";
// import ReportsPage from "@/components/pages/admin/ReportsPage";
// import PaymentsManagement from "@/components/pages/admin/PaymentsManagement";
// import SubscriptionsManagement from "@/components/pages/Admin/SubscriptionsManagement";
// import ModerationPage from "@/components/pages/Admin/ModerationPage";
// import AdminSettings from "@/components/pages/Admin/AdminSettings";
// import AuditLogsPage from "@/components/pages/Admin/AuditLogsPage";
// import SecuritySettings from "@/components/pages/Admin/SecuritySettings";
// import NotificationsManagement from "@/components/pages/Admin/NotificationsManagement";
// import DatabaseManagement from "@/components/pages/Admin/DatabaseManagement";

import TempSelect from "./TempSelect";
import UserPublicProfile from "@/components/pages/Profile/UserPublicProfile";

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
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
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
        <Route path="/profile/id/:userId" element={<UserPublicProfile />} />
      </Route>

      {/*** Dashboard routes ***/}
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route
          path="/dashboard"
          element={<Navigate to="/dashboard/chat" replace />}
        />
        <Route path="/dashboard/workspace" element={<WorkspacePage />} />
        <Route
          path="/dashboard/workspace/:workspaceId/projects"
          element={<WorkspaceProjectsPage />}
        />
        <Route path="/dashboard/chat" element={<ChatGroupPage />} />
        <Route path="/dashboard/tasks" element={<TasksPage />} />
        <Route path="/dashboard/projects" element={<ProjectsPage />} />
        <Route path="/dashboard/performance" element={<PerformancePage />} />
        <Route
          path="/dashboard/projects/:projectId/tasks"
          element={<TasksPage />}
        />
        <Route path="/dashboard/calendar" element={<CalendarPage />} />
        <Route path="/dashboard/work-groups" element={<WorkGroupsPage />} />
      </Route>

      {/*** Admin routes - Only accessible by admin users ***/}
      <Route
        element={
          <RequireAuth>
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          </RequireAuth>
        }
      >
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<UsersManagement />} />
        <Route path="/admin/payments" element={<PaymentsManagement />} />
        {/* <Route path="/admin/users" element={<UsersManagement />
        <Route path="/admin/posts" element={<PostsManagement />} />
        <Route
          path="/admin/recruitments"
          element={<RecruitmentsManagement />}
        /> */}

        {/* Analytics & Reports */}
        {/* <Route path="/admin/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/audit" element={<AuditLogsPage />} /> */}

        {/* Business & Finance */}
        {/* <Route path="/admin/payments" element={<PaymentsManagement />} />
        <Route
          path="/admin/subscriptions"
          element={<SubscriptionsManagement />}
        /> */}

        {/* System & Security */}
        {/* <Route path="/admin/moderation" element={<ModerationPage />} />
        <Route path="/admin/security" element={<SecuritySettings />} />
        <Route
          path="/admin/notifications"
          element={<NotificationsManagement />}
        />
        <Route path="/admin/database" element={<DatabaseManagement />} />
        <Route path="/admin/settings" element={<AdminSettings />} /> */}
      </Route>
    </Routes>
  );

  // return <TempSelect />;
}
