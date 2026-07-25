import React from 'react';

const LoadingSkeleton = ({ className = '', type = 'text' }) => {
  const types = {
    text: 'h-4 w-3/4 mb-2',
    title: 'h-6 w-1/2 mb-4',
    avatar: 'h-12 w-12 rounded-full',
    card: 'h-32 w-full rounded-md',
  };

  return (
    <div className={`animate-pulse bg-gray-200 rounded ${types[type]} ${className}`}></div>
  );
};

export default LoadingSkeleton;
