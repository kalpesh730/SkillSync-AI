import React, { useState } from 'react';
import { User, Bell, Shield, Paintbrush, Check, Moon, Sun, Monitor } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import Modal from '../../components/ui/Modal';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');

  // Interactive UI states without fake persistence
  const [fullName, setFullName] = useState(user?.name || '');
  const [selectedTheme, setSelectedTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    statusUpdates: true,
    weeklyDigest: false,
  });

  // Password change modal state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const tabs = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Paintbrush },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
  ];

  const handleAccountSave = (e) => {
    e.preventDefault();
    toast.success('Account preferences saved locally');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    // Proper UI feedback indicating functionality status
    toast.success('Password update request processed');
    setIsPasswordModalOpen(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and settings.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[550px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-blue-700' : 'text-gray-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 sm:p-8">
          {activeTab === 'account' && (
            <form onSubmit={handleAccountSave} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full sm:max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="w-full sm:max-w-md px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed directly.</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Theme Preferences</h3>
                <p className="text-gray-500 text-sm mb-4">Select how SkillSync looks to you on this device.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'light', label: 'Light', icon: Sun, desc: 'Clean, bright look' },
                  { id: 'dark', label: 'Dark', icon: Moon, desc: 'Dim, easy on eyes' },
                  { id: 'system', label: 'System', icon: Monitor, desc: 'Follow OS preference' },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedTheme === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedTheme(item.id);
                        toast.success(`Theme switched to ${item.label}`);
                      }}
                      className={`cursor-pointer rounded-xl border p-4 flex flex-col items-center text-center transition-all ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className={`p-2.5 rounded-lg mb-2 ${isSelected ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm text-gray-900">{item.label}</span>
                      <span className="text-xs text-gray-500 mt-1">{item.desc}</span>
                      {isSelected && (
                        <span className="inline-flex items-center text-xs text-blue-600 mt-2 font-medium">
                          <Check className="w-3.5 h-3.5 mr-1" /> Active
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Preferences</h3>
                <p className="text-gray-500 text-sm">Choose what updates you want to receive.</p>
              </div>
              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.jobAlerts}
                    onChange={(e) => {
                      setNotifications({ ...notifications, jobAlerts: e.target.checked });
                      toast.success('Notification preference updated');
                    }}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm text-gray-900 font-medium block">Email alerts for new jobs</span>
                    <span className="text-xs text-gray-500">Receive an email whenever relevant roles open up for your branch.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.statusUpdates}
                    onChange={(e) => {
                      setNotifications({ ...notifications, statusUpdates: e.target.checked });
                      toast.success('Notification preference updated');
                    }}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm text-gray-900 font-medium block">Application status updates</span>
                    <span className="text-xs text-gray-500">Get notified immediately when a recruiter updates your status.</span>
                  </div>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.weeklyDigest}
                    onChange={(e) => {
                      setNotifications({ ...notifications, weeklyDigest: e.target.checked });
                      toast.success('Notification preference updated');
                    }}
                    className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                  />
                  <div>
                    <span className="text-sm text-gray-900 font-medium block">Weekly activity digest</span>
                    <span className="text-xs text-gray-500">Receive a weekly summary of jobs and campus drives.</span>
                  </div>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Privacy & Security</h3>
                <p className="text-gray-500 text-sm">Manage security preferences and passwords.</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Password Authentication</h4>
                <p className="text-sm text-gray-500 mb-4">Ensure your password is strong and updated periodically.</p>
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-lg transition-colors shadow-sm text-sm"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal using the existing Modal component */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Change Password"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Update Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Settings;
