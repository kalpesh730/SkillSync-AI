import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { Lock } from 'lucide-react';

const Forbidden = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="text-center flex flex-col items-center">
        <Lock className="w-24 h-24 text-red-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900">403 Forbidden</h1>
        <p className="mt-4 text-gray-500 max-w-md">You don&apos;t have permission to access this resource. Please contact your administrator if you believe this is a mistake.</p>
        <div className="mt-8">
          <Link to="/dashboard">
            <Button variant="primary">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
