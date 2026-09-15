import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Briefcase, FileText, Settings, Zap, LayoutDashboard, Building2, Award, TrendingUp, X } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { MODULES, getProductModule } from '../utils/roles';

const Sidebar = ({ isOpen, toggleSidebar, closeSidebar }) => {
  const { user } = useAuthStore();

  const handleNavClick = () => {
    if (closeSidebar) {
      closeSidebar();
    } else if (toggleSidebar && isOpen) {
      toggleSidebar();
    }
  };

  const getNavItems = () => {
    if (!user) return [];

    const productModule = getProductModule(user.role);

    if (productModule === MODULES.STUDENT) {
      return [
        { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { name: 'Profile', path: '/student/profile', icon: Users },
        { name: 'Resume', path: '/student/profile', icon: FileText },
        { name: 'Skills', path: '/student/profile', icon: Award },
        { name: 'Jobs', path: '/jobs', icon: Briefcase },
        { name: 'Applications', path: '/applications', icon: FileText },
        { name: 'AI Support', path: '/ai/dashboard', icon: Zap },
        { name: 'Settings', path: '/student/settings', icon: Settings },
      ];
    }

    if (productModule === MODULES.COMPANY) {
      return [
        { name: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
        { name: 'My Company', path: '/companies', icon: Building2 },
        { name: 'My Vacancies', path: '/jobs', icon: Briefcase },
        { name: 'My Applicants', path: '/applications', icon: FileText },
        { name: 'AI Support', path: '/ai/dashboard', icon: Zap },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
      ];
    }

    // MODULES.ADMIN (SUPER_ADMIN, COLLEGE_ADMIN, PLACEMENT_OFFICER)
    return [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Students', path: '/student/profile', icon: Users },
      { name: 'Companies', path: '/companies', icon: Building2 },
      { name: 'Vacancies', path: '/jobs', icon: Briefcase },
      { name: 'Analytics', path: '/college/dashboard', icon: TrendingUp },
      { name: 'AI Support', path: '/ai/dashboard', icon: Zap },
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-lg lg:shadow-none ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
      aria-label="Sidebar Navigation"
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
        <button
          onClick={closeSidebar || toggleSidebar}
          className="lg:hidden text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Close navigation sidebar"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
                }`
              }
            >
              <Icon
                className="w-5 h-5 mr-3 transition-colors duration-200"
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
