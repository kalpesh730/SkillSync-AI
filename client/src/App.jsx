import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

// Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import ProfilePage from './features/student/pages/ProfilePage';
import EditProfilePage from './features/student/pages/EditProfilePage';
import CompanyProfile from './features/company/pages/CompanyProfile';
import JobsPage from './features/job/pages/JobsPage';
import ApplicationsPage from './features/application/pages/ApplicationsPage';
import JobApplicationsPage from './features/application/pages/JobApplicationsPage';

function App() {
  const { getCurrentUser, loading } = useAuthStore();

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid #374151',
          }
        }} 
      />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/student/dashboard" element={<Dashboard />} />
            <Route path="/student/profile" element={<ProfilePage />} />
            <Route path="/student/profile/edit" element={<EditProfilePage />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/college/dashboard" element={<Dashboard />} />
            <Route path="/company/dashboard" element={<Dashboard />} />
            <Route path="/companies" element={<CompanyProfile />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:jobId/applications" element={<JobApplicationsPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Route>
        </Route>

        {/* Catch all redirect to root/login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
