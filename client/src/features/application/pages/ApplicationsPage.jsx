import React from 'react';
import ApplicationList from '../components/ApplicationList';
import { useAuthStore } from '../../../store/authStore';
import { FileText } from 'lucide-react';

const ApplicationsPage = () => {
  const { user } = useAuthStore();

  if (user?.role !== 'STUDENT') {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center max-w-lg mx-auto mt-12">
        <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Applications Management</h2>
        <p className="text-gray-600 mb-6">
          To review applicants and update hiring pipelines, select <strong>View Applicants</strong> on any posted job.
        </p>
        <a
          href="/jobs"
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Go to Jobs Management
        </a>
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
