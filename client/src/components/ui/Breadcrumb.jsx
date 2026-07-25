import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex mb-4" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <div>
            <Link to="/" className="text-gray-400 hover:text-gray-500">
              <Home className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <ChevronRight className="flex-shrink-0 h-5 w-5 text-gray-400" aria-hidden="true" />
              {item.href ? (
                <Link
                  to={item.href}
                  className="ml-2 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {item.name}
                </Link>
              ) : (
                <span className="ml-2 text-sm font-medium text-gray-900" aria-current="page">
                  {item.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
