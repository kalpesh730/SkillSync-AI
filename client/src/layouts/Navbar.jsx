import React from 'react';
import { Menu, Bell, User, LogOut, Settings, UserCircle, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Dropdown, { DropdownItem, DropdownDivider } from '../components/ui/Dropdown';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const getProfileLink = () => {
    if (!user) return '/';
    if (user.role === 'STUDENT') return '/student/profile';
    if (user.role === 'COMPANY_HR' || user.role === 'RECRUITER') return '/company/dashboard'; // Update later
    return '/admin/dashboard';
  };

  const getSettingsLink = () => {
    if (!user) return '/';
    if (user.role === 'STUDENT') return '/student/settings';
    return '/admin/settings';
  };

  const ProfileTrigger = (
    <div className="flex items-center gap-3">
      <div className="hidden md:block text-right">
        <p className="text-sm font-medium text-gray-700">{user?.name || 'User'}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role?.replace('_', ' ').toLowerCase() || 'Role'}</p>
      </div>
      <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md hover:shadow-lg transition-all border-2 border-white ring-2 ring-gray-100">
        <User className="w-5 h-5" />
      </div>
    </div>
  );

  const NotificationsTrigger = (
    <div className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
      <Bell className="w-5 h-5 text-gray-600" />
      <span className="absolute top-1 right-1 block w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
    </div>
  );

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-blue-600 lg:hidden focus:outline-none p-2 rounded-md hover:bg-blue-50 transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <Dropdown trigger={NotificationsTrigger} align="right">
          <div className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-100">
            Notifications
          </div>
          <div className="max-h-64 overflow-y-auto p-4 text-sm text-gray-500 text-center">
            No new notifications
          </div>
          <DropdownDivider />
          <div className="px-4 py-2 text-xs text-center text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
            View all
          </div>
        </Dropdown>

        <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

        <Dropdown trigger={ProfileTrigger} align="right">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <DropdownItem icon={UserCircle} onClick={() => navigate(getProfileLink())}>
            My Profile
          </DropdownItem>
          <DropdownItem icon={Settings} onClick={() => navigate(getSettingsLink())}>
            Account Settings
          </DropdownItem>
          <DropdownItem icon={HelpCircle} onClick={() => navigate('/support')}>
            Help & Support
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem icon={LogOut} onClick={handleLogout} className="text-red-600 hover:text-red-700 hover:bg-red-50">
            Sign out
          </DropdownItem>
        </Dropdown>
      </div>
    </header>
  );
};

export default Navbar;
