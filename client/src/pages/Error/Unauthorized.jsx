import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { ShieldAlert } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="text-center flex flex-col items-center">
        <ShieldAlert className="w-24 h-24 text-yellow-500 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900">401 Unauthorized</h1>
        <p className="mt-4 text-gray-500 max-w-md">You need to be logged in to access this page. Please authenticate and try again.</p>
        <div className="mt-8">
          <Link to="/login">
            <Button variant="primary">Go to Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
