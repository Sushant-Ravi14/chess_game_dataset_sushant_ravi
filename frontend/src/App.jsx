import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Lazy loading pages for better performance
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const DashboardOverview = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Players'));
const Matches = lazy(() => import('./pages/Matches'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const Settings = lazy(() => import('./pages/Settings'));

const App = () => {
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <>
      <Toaster position="top-right" />
      <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-[#0b0f19]"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardOverview />} />
              <Route path="/users" element={<Users />} />
              <Route path="/matches" element={<Matches />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
          
          <Route path="*" element={<div className="p-8 text-center flex flex-col items-center justify-center min-h-screen"><h1 className="text-4xl font-bold mb-4">404 Not Found</h1><a href="/dashboard" className="text-blue-600 hover:underline">Return to Dashboard</a></div>} />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
