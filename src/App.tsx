import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { Role } from './types';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import CareerTracksPage from './pages/CareerTracksPage';
import ProfilePage from './pages/ProfilePage';
import AdminUsersPage from './pages/AdminUsersPage';

// Placeholder pages - these would be implemented later
const LearningPage = () => (
  <div className="text-center py-16">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">My Learning</h1>
    <p className="text-gray-600">Your personalized learning journey and courses will appear here.</p>
  </div>
);

const ProgressPage = () => (
  <div className="text-center py-16">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Progress Tracking</h1>
    <p className="text-gray-600">Track your learning progress and achievements.</p>
  </div>
);

const ResourcesPage = () => (
  <div className="text-center py-16">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Resources</h1>
    <p className="text-gray-600">Curated learning materials and resources for your career path.</p>
  </div>
);

const AchievementsPage = () => (
  <div className="text-center py-16">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Achievements</h1>
    <p className="text-gray-600">Your badges, certificates, and learning milestones.</p>
  </div>
);

const SettingsPage = () => (
  <div className="text-center py-16">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Settings</h1>
    <p className="text-gray-600">Customize your learning experience.</p>
  </div>
);

const AdminAnalyticsPage = () => (
  <div className="text-center py-16">
    <h1 className="text-2xl font-bold text-gray-900 mb-4">Analytics Dashboard</h1>
    <p className="text-gray-600">Platform analytics and reporting.</p>
  </div>
);

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Access Denied</h2>
      <p className="text-gray-600 mb-8">You don't have permission to access this page.</p>
      <button 
        onClick={() => window.history.back()} 
        className="btn btn-primary"
      >
        Go Back
      </button>
    </div>
  </div>
);

const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
      <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
      <a href="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </a>
    </div>
  </div>
);

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              
              {/* Protected routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                {/* Default redirect to dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                
                {/* User routes */}
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="career-tracks" element={<CareerTracksPage />} />
                <Route path="learning" element={<LearningPage />} />
                <Route path="progress" element={<ProgressPage />} />
                <Route path="resources" element={<ResourcesPage />} />
                <Route path="achievements" element={<AchievementsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
                
                {/* Admin routes */}
                <Route
                  path="admin/dashboard"
                  element={
                    <ProtectedRoute requiredRole={Role.ADMIN}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/users"
                  element={
                    <ProtectedRoute requiredRole={Role.SUPER_ADMIN}>
                      <AdminUsersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="admin/analytics"
                  element={
                    <ProtectedRoute requiredRole={Role.ADMIN}>
                      <AdminAnalyticsPage />
                    </ProtectedRoute>
                  }
                />
              </Route>
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            
            {/* Toast notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#fff',
                  color: '#333',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                },
                success: {
                  style: {
                    border: '1px solid #10B981',
                  },
                },
                error: {
                  style: {
                    border: '1px solid #EF4444',
                  },
                },
              }}
            />
          </div>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
