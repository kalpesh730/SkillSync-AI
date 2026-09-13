import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, FileText, Settings, Menu, Zap, LayoutDashboard, Building2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuthStore();

  const getNavItems = () => {
    if (!user) return [];

    if (user.role === 'STUDENT') {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Profile', path: '/student/profile', icon: Users },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Applications', path: '/applications', icon: FileText },
        { name: 'AI Assistant', path: '/ai/dashboard', icon: Zap },
      ];
    }

    if (user.role === 'RECRUITER') {
      return [
        { name: 'Recruitment Hub', path: '/company/dashboard', icon: LayoutDashboard },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Applicants', path: '/applications', icon: FileText },
        { name: 'Company Profile', path: '/companies', icon: Building2 },
      ];
    }

    if (user.role === 'COMPANY_HR') {
      return [
        { name: 'HR Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Applicants', path: '/applications', icon: FileText },
        { name: 'Company Profile', path: '/companies', icon: Building2 },
        { name: 'HR Settings', path: '/admin/settings', icon: Settings },
      ];
    }

    if (user.role === 'PLACEMENT_OFFICER') {
      return [
        { name: 'Placement Hub', path: '/college/dashboard', icon: LayoutDashboard },
        { name: 'Partner Companies', path: '/companies', icon: Building2 },
        { name: 'Jobs & Drives', path: '/jobs', icon: Briefcase },
        { name: 'Applications', path: '/applications', icon: FileText },
      ];
    }

    if (user.role === 'COLLEGE_ADMIN') {
      return [
        { name: 'Campus Overview', path: '/college/dashboard', icon: LayoutDashboard },
        { name: 'Partner Companies', path: '/companies', icon: Building2 },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Applications', path: '/applications', icon: FileText },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    }

    // SUPER_ADMIN
    return [
      { name: 'Admin Console', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Partner Companies', path: '/companies', icon: Building2 },
      { name: 'Jobs', path: '/jobs', icon: Briefcase },
      { name: 'Applications', path: '/applications', icon: FileText },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            SkillSync
          </span>
        </div>
        <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              <Icon
                className={`w-5 h-5 mr-3 transition-colors duration-200 ${
                  /* Can't easily use isActive outside the callback, but we rely on parent text color to cascade */
                  ''
                }`}
              />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
