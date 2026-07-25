import React from 'react';
import { Menu, Bell, User } from 'lucide-react';

const Navbar = ({ toggleSidebar }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-700 lg:hidden focus:outline-none"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-gray-700 relative focus:outline-none">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 block w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <User className="w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
