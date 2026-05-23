/**
 * App - Root component with lazy-loaded routes and role-based protection.
 */
import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import DashboardLayout from './layouts/DashboardLayout';

// Lazy-loaded pages for code splitting and performance
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Team = lazy(() => import('./pages/Team'));
const Profile = lazy(() => import('./pages/Profile'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading fallback for lazy-loaded components
const LazyFallback = () => (
  <div className="flex items-center justify-center h-64">
    <div className="w-8 h-8 border-3 border-surface-700 border-t-brand-500 rounded-full animate-spin" />
  </div>
);

// Full-screen loading for auth checks
const AuthLoading = () => (
  <div className="min-h-screen bg-surface-950 flex items-center justify-center">
    <div className="w-10 h-10 border-3 border-surface-700 border-t-brand-500 rounded-full animate-spin" />
  </div>
);

// Protected route - requires authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  return user ? children : <Navigate to="/login" replace />;
};

// Public route - redirects authenticated users
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <AuthLoading />;
  return !user ? children : <Navigate to="/dashboard" replace />;
};

// Admin-only route - restricts access to admin role
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <AuthLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: 'rgba(24, 24, 27, 0.95)', color: '#fafafa', border: '1px solid rgba(244, 63, 94, 0.15)', fontSize: '14px', backdropFilter: 'blur(16px)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
          success: { iconTheme: { primary: '#10b981', secondary: '#fafafa' } },
          error: { iconTheme: { primary: '#f43f5e', secondary: '#fafafa' } }
        }}
      />
      <Suspense fallback={<AuthLoading />}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected routes with dashboard layout */}
          <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Suspense fallback={<LazyFallback />}><Dashboard /></Suspense>} />
            <Route path="projects" element={<Suspense fallback={<LazyFallback />}><Projects /></Suspense>} />
            <Route path="projects/:id" element={<Suspense fallback={<LazyFallback />}><ProjectDetail /></Suspense>} />
            <Route path="tasks" element={<Suspense fallback={<LazyFallback />}><Tasks /></Suspense>} />
            <Route path="team" element={<Suspense fallback={<LazyFallback />}><AdminRoute><Team /></AdminRoute></Suspense>} />
            <Route path="profile" element={<Suspense fallback={<LazyFallback />}><Profile /></Suspense>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
