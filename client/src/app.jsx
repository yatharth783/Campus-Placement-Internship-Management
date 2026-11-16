
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import RegisterStudent from './pages/RegisterStudent';
import RegisterRecruiter from './pages/RegisterRecruiter';
import BrowseJobs from './pages/BrowseJobs';
import JobDetail from './pages/JobDetail';
import About from './pages/About';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import StudentApplications from './pages/student/StudentApplications';
import MLCareerAssistant from './pages/student/MLCareerAssistant';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import ManageJobs from './pages/recruiter/ManageJobs';
import PostJob from './pages/recruiter/PostJob';
import ReviewApplicants from './pages/recruiter/ReviewApplicants';
import RecruiterProfile from './pages/recruiter/RecruiterProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageUsers from './pages/admin/ManageUsers';
import AdminManageJobs from './pages/admin/ManageJobs';
import PlacementReports from './pages/admin/PlacementReports';

// Role Protected Route Component
const ProtectedRoleRoute = ({ allowedRole, children }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-10 h-10 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (user.role === 'recruiter') {
      return <Navigate to="/recruiter/dashboard" replace />;
    }

    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

// 404 Not Found Page
const NotFound = () => (
  <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
    <h1 className="text-6xl font-black text-brand-600">404</h1>

    <h2 className="text-xl font-bold text-slate-900 mt-2">
      Page Not Found
    </h2>

    <p className="text-xs text-slate-500 mt-1 max-w-sm">
      The requested URL does not exist or has been moved within the placement platform.
    </p>

    <a
      href="/"
      className="mt-6 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition"
    >
      Return to Home
    </a>
  </div>
);

// Main App Component
export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<Login adminOnly />} />
      <Route path="/register-student" element={<RegisterStudent />} />
      <Route path="/register-recruiter" element={<RegisterRecruiter />} />
      <Route path="/jobs" element={<BrowseJobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/about" element={<About />} />

      {/* Student Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoleRoute allowedRole="student">
            <StudentDashboard />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/student/profile"
        element={
          <ProtectedRoleRoute allowedRole="student">
            <StudentProfile />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/student/applications"
        element={
          <ProtectedRoleRoute allowedRole="student">
            <StudentApplications />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/applications"
        element={
          <ProtectedRoleRoute allowedRole="student">
            <StudentApplications />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/student/ml-assistant"
        element={
          <ProtectedRoleRoute allowedRole="student">
            <MLCareerAssistant />
          </ProtectedRoleRoute>
        }
      />

      {/* Recruiter Protected Routes */}
      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <RecruiterDashboard />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/recruiter/manage-jobs"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <ManageJobs />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <ManageJobs />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/recruiter/post-job"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <PostJob />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/recruiter/applicants"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <ReviewApplicants />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/recruiter/applications"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <ReviewApplicants />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/recruiter/profile"
        element={
          <ProtectedRoleRoute allowedRole="recruiter">
            <RecruiterProfile />
          </ProtectedRoleRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <AdminManageUsers />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/admin/jobs"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <AdminManageJobs />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <PlacementReports />
          </ProtectedRoleRoute>
        }
      />

      <Route
        path="/admin/reports"
        element={
          <ProtectedRoleRoute allowedRole="admin">
            <PlacementReports />
          </ProtectedRoleRoute>
        }
      />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
