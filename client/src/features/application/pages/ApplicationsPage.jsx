import React from 'react';
import ApplicationList from '../components/ApplicationList';
import { useAuthStore } from '../../../store/authStore';
import { FileText } from 'lucide-react';

const ApplicationsPage = () => {
  const { user } = useAuthStore();

  if (user?.role !== 'STUDENT') {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        You do not have permission to view this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FileText className="w-6 h-6 mr-2 text-primary-600" />
            My Applications
          </h1>
          <p className="text-gray-500 mt-1">Track the status of your job applications</p>
        </div>
      </div>

      <ApplicationList />
    </div>
  );
};

export default ApplicationsPage;
