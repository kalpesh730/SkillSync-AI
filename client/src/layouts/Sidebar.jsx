import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Users, Briefcase, FileText, Settings, Menu } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Students', path: '/students', icon: Users },
    { name: 'Jobs', path: '/jobs', icon: Briefcase },
    { name: 'Applications', path: '/applications', icon: FileText },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <span className="text-xl font-bold text-blue-600">SkillSync</span>
        <button onClick={toggleSidebar} className="lg:hidden text-gray-500 hover:text-gray-700">
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
                `flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
              }
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
