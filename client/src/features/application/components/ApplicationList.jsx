import React, { useEffect, useState } from 'react';
import { useApplicationStore } from '../../../store/applicationStore';
import ApplicationCard from './ApplicationCard';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';

const ApplicationList = () => {
  const { applications, fetchMyApplications, withdrawApplication, loading, error } = useApplicationStore();
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const handleWithdraw = async (applicationId) => {
    const result = await withdrawApplication(applicationId);
    if (result.success) {
      // Optional success toast
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return !['REJECTED', 'WITHDRAWN'].includes(app.status);
    return app.status === filter;
  });

  if (loading && applications.length === 0) {
    return <div className="flex justify-center py-12"><LoadingSpinner /></div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['ALL', 'ACTIVE', 'APPLIED', 'SCREENING', 'SHORTLISTED', 'INTERVIEW', 'SELECTED', 'REJECTED', 'WITHDRAWN'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500">No applications found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard 
              key={application._id} 
              application={application} 
              onWithdraw={handleWithdraw}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ApplicationList;
