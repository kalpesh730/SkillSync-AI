import React from 'react';

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
