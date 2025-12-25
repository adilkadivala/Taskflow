import ForgotPassword from "@/auth/forgot-password";
import AuthLayout from "@/auth/layout";
import SignIn from "@/auth/sign-in";
import SignUp from "@/auth/sign-up";
import Dashboard from "@/dashboard";
import DashLayout from "@/dashboard/dash-layout";
import TaskManagement from "@/dashboard/tasks";
import LandingPage from "@/pages/landing-page";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import Teams from "@/dashboard/teams";
import Activity from "@/dashboard/activity";
import Profile from "@/dashboard/profile";
import Notifications from "@/dashboard/notification";
import AboutTeam from "@/components/dashboard/team/about-team";
import AboutTeamTask from "@/components/dashboard/team/about-team-task";
import AiCommandPage from "@/dashboard/ai-command";

const Paths = () => {
  const token = useAuthStore((state) => state.token);

  if (!token) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth" element={<AuthLayout />}>
          <Route path="sign-in" element={<SignIn />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/dashboard" element={<DashLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="task-management" element={<TaskManagement />} />
        <Route path="teams" element={<Teams />} />
        <Route path="teams/:teamId" element={<AboutTeam />} />
        <Route path="teams/:teamId/tasks/:taskId" element={<AboutTeamTask />} />
        <Route path="activity" element={<Activity />} />
        <Route path="ai-command" element={<AiCommandPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="notification" element={<Notifications />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default Paths;
