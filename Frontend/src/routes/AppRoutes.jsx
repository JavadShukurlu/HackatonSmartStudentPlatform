import { Navigate, Route, Routes } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from '../utils/constants';
import { useAuth } from '../hooks/useAuth';
import { getRoleDashboard } from '../utils/constants';

import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import SuperAdminDashboard from '../pages/superadmin/SuperAdminDashboard';
import Users from '../pages/Users';
import Grades from '../pages/Grades';
import Courses from '../pages/Courses';
import Announcements from '../pages/Announcements';
import Events from '../pages/Events';
import LostFound from '../pages/LostFound';
import TeamFinder from '../pages/TeamFinder';
import Messages from '../pages/Messages';
import Statistics from '../pages/Statistics';
import Notifications from '../pages/Notifications';
import Settings from '../pages/Settings';
import Unauthorized from '../pages/Unauthorized';
import NotFound from '../pages/NotFound';

/** Redirect root to the correct dashboard based on role. */
const RoleRedirect = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={getRoleDashboard(user?.role)} replace />;
};

const AppRoutes = () => (
  <Routes>
    {/* Root → role-based redirect */}
    <Route path="/" element={<RoleRedirect />} />

    {/* Auth (public) */}
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    {/* Legacy /admin/login redirect */}
    <Route path="/admin/login" element={<Navigate to="/login" replace />} />
    <Route path="/admin/register" element={<Navigate to="/register" replace />} />

    {/* Public: Unauthorized */}
    <Route path="/unauthorized" element={<Unauthorized />} />

    {/* ──────────────── SUPER ADMIN PANEL ──────────────── */}
    <Route
      path="/superadmin"
      element={
        <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
          <SuperAdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"     element={<SuperAdminDashboard />} />
      <Route path="users"         element={<Users />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="events"        element={<Events />} />
      <Route path="lost-found"    element={<LostFound />} />
      <Route path="team-finder"   element={<TeamFinder />} />
      <Route path="messages"      element={<Messages />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="statistics"    element={<Statistics />} />
      <Route path="grades"        element={<Grades />} />
      <Route path="courses"       element={<Courses />} />
      <Route path="settings"      element={<Settings />} />
    </Route>

    {/* ──────────────── ADMIN PANEL ──────────────── */}
    <Route
      path="/admin"
      element={
        <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      }
    >
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard"     element={<Dashboard />} />
      <Route path="users"         element={<Users />} />
      <Route path="announcements" element={<Announcements />} />
      <Route path="events"        element={<Events />} />
      <Route path="lost-found"    element={<LostFound />} />
      <Route path="team-finder"   element={<TeamFinder />} />
      <Route path="messages"      element={<Messages />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="statistics"    element={<Statistics />} />
      <Route path="grades"        element={<Grades />} />
      <Route path="courses"       element={<Courses />} />
      <Route path="settings"      element={<Settings />} />
    </Route>

    {/* 404 */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRoutes;
