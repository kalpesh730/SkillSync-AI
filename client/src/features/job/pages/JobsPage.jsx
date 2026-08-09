import React from 'react';
import JobList from '../components/JobList';
import { useAuthStore } from '../../../store/authStore';

const JobsPage = () => {
  const { user } = useAuthStore();
  
  // A recruiter will manage their own company's jobs.
  const isRecruiter = ['COLLEGE_ADMIN', 'PLACEMENT_OFFICER', 'COMPANY_HR', 'RECRUITER'].includes(user?.role);
  
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <JobList companyId={isRecruiter ? user?.companyId : undefined} />
      </div>
    </div>
  );
};

export default JobsPage;
