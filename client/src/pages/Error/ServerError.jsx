import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import { ServerCrash } from 'lucide-react';

const ServerError = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="text-center flex flex-col items-center">
        <ServerCrash className="w-24 h-24 text-gray-400 mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900">500 Server Error</h1>
        <p className="mt-4 text-gray-500 max-w-md">Oops! Something went wrong on our end. Please try again later.</p>
        <div className="mt-8">
          <button onClick={() => window.location.reload()}>
            <Button variant="outline" className="mr-4">Refresh Page</Button>
          </button>
          <Link to="/">
            <Button variant="primary">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServerError;
