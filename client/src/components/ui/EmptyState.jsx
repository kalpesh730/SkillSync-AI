import React from 'react';
import { FolderOpen } from 'lucide-react';

const EmptyState = ({ title = 'No Data', description = 'There is nothing to show here.', icon, action }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <div className="bg-gray-100 p-3 rounded-full mb-4">
        {icon || <FolderOpen className="w-8 h-8 text-gray-400" />}
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-4">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
