import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, Mail, Shield, Upload, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleGuard from '../../components/Guards/RoleGuard';
import { MODULES, getProductModule } from '../../utils/roles';
import StudentDashboard from '../../features/analytics/components/StudentDashboard';
import RecruiterDashboard from '../../features/analytics/components/RecruiterDashboard';
import CollegeAdminDashboard from '../../features/analytics/components/CollegeAdminDashboard';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getRoleHeader = () => {
    const productModule = getProductModule(user?.role);
    switch (productModule) {
      case MODULES.STUDENT:
        return {
          title: 'Student Hub',
          subtitle: 'Track your profile strength, job applications, and AI career recommendations',
        };
      case MODULES.COMPANY:
        return {
          title: 'Company Recruitment Hub',
          subtitle: 'Monitor active job listings, review applicant pipelines, and manage candidate conversions',
        };
      case MODULES.ADMIN:
        return {
          title: 'Admin Governance Console',
          subtitle: 'System-wide governance, company metrics, job vacancy oversight, and analytics',
        };
      default:
        return {
          title: 'Dashboard',
          subtitle: 'Welcome back to SkillSync',
        };
    }
  };

  if (!user) return null;

  const roleHeader = getRoleHeader();
  const productModule = getProductModule(user.role);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">{roleHeader.title}</h1>
            <p className="text-gray-500 mt-1">{roleHeader.subtitle}</p>
          </div>
          <button
            onClick={handleLogout}
            className="hidden sm:flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-all shadow-sm border border-gray-200 hover:shadow-md font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 border-b border-gray-100 pb-4">Profile Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="font-semibold text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Module / Role</p>
                <p className="font-semibold text-gray-900 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {productModule} ({user.role})
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Module-Based Section Rendering */}
        <div className="mt-8 space-y-6">
          <RoleGuard allowedRoles={[MODULES.STUDENT]}>
            <div className="mb-6">
              <StudentDashboard />
            </div>

            <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6 mb-6 hidden">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center mb-4">
                <Upload className="w-5 h-5 mr-2" /> Student Actions
              </h3>
              <p className="text-gray-300">Upload your latest resume to get AI feedback.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors">
                Upload Resume
              </button>
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={[MODULES.ADMIN]}>
            <div className="mb-6">
              <CollegeAdminDashboard />
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={[MODULES.COMPANY]}>
            <div className="mb-6">
              <RecruiterDashboard />
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={[MODULES.ADMIN, MODULES.COMPANY]}>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-emerald-800 flex items-center mb-2">
                <Settings className="w-5 h-5 mr-2" /> Settings
              </h3>
              <p className="text-emerald-600 mb-4">Manage workspace preferences and account configurations.</p>
              <button
                onClick={() => navigate('/admin/settings')}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                Open Settings
              </button>
            </div>
          </RoleGuard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
