import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>
        <p className="text-2xl font-semibold text-gray-800 md:text-3xl mt-4">Page not found</p>
        <p className="mt-4 text-gray-500">Sorry, the page you are looking for doesn&apos;t exist or has been moved.</p>
        <div className="mt-8">
          <Link to="/">
            <Button variant="primary">Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
