import React from 'react';
import CompanyList from '../components/CompanyList';

const CompanyProfile = () => {
  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <CompanyList />
      </div>
    </div>
  );
};

export default CompanyProfile;
