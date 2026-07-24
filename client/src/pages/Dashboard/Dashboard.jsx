import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { LogOut, User, Mail, Shield, Upload, BarChart, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RoleGuard from '../../components/Guards/RoleGuard';
import { ROLES } from '../../utils/roles';

const Dashboard = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-gray-400 mt-1">Welcome back to SkillSync</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors border border-gray-700"
          >
            <LogOut className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">Log out</span>
          </button>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-xl">
          <h2 className="text-xl font-semibold mb-6 border-b border-gray-700 pb-4">Profile Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Full Name</p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Mail className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Email Address</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <div className="p-3 bg-emerald-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Account Role</p>
                <p className="font-medium">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Based Section Rendering */}
        <div className="mt-8 space-y-6">
          <RoleGuard allowedRoles={[ROLES.STUDENT]}>
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-blue-400 flex items-center mb-4">
                <Upload className="w-5 h-5 mr-2" /> Student Actions
              </h3>
              <p className="text-gray-300">Upload your latest resume to get AI feedback.</p>
              <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors">
                Upload Resume
              </button>
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={[ROLES.COLLEGE_ADMIN, ROLES.PLACEMENT_OFFICER, ROLES.SUPER_ADMIN]}>
            <div className="bg-purple-900/20 border border-purple-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-purple-400 flex items-center mb-4">
                <BarChart className="w-5 h-5 mr-2" /> Institutional Analytics
              </h3>
              <p className="text-gray-300">View placement metrics and cohort performance.</p>
              <button className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium text-sm transition-colors">
                View Reports
              </button>
            </div>
          </RoleGuard>

          <RoleGuard allowedRoles={[ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN, ROLES.COMPANY_HR]}>
            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-emerald-400 flex items-center mb-4">
                <Settings className="w-5 h-5 mr-2" /> Administrator Settings
              </h3>
              <p className="text-gray-300">Manage tenant preferences and user access.</p>
              <button className="mt-4 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium text-sm transition-colors">
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
