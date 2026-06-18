import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import ComplaintDetail from './pages/ComplaintDetail';
import LoadingScreen from './components/Common/LoadingScreen';

// Route guards
const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  if (!adminOnly && user.role === 'admin') return <Navigate to="/admin" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingScreen />;
  if (user) return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen gradient-bg font-body">
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'rgba(15, 23, 42, 0.9)',
                  color: '#e2e8f0',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  backdropFilter: 'blur(20px)',
                  fontFamily: 'DM Sans, sans-serif',
                },
                success: { iconTheme: { primary: '#34d399', secondary: '#0f172a' } },
                error: { iconTheme: { primary: '#f87171', secondary: '#0f172a' } },
              }}
            />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
              <Route path="/dashboard" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
              <Route path="/submit" element={<PrivateRoute><SubmitComplaint /></PrivateRoute>} />
              <Route path="/complaint/:id" element={<PrivateRoute><ComplaintDetail /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
