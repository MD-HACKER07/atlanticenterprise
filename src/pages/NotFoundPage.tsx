import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="mb-8">
          <svg className="w-32 h-32 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <rect width="18" height="18" x="3" y="3" rx="2" strokeWidth="2" />
            <path d="M9 9h.01M15 9h.01M9 15h.01M15 15h.01M9 12h6" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h1 className="text-6xl font-bold text-gray-800 mt-4">404</h1>
          <p className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</p>
        </div>

        <p className="mb-8 text-gray-600 max-w-sm mx-auto">
          The page you're looking for doesn't exist or has been moved. 
          Don't worry, you can find plenty of other things on our homepage.
        </p>

        <Link 
          to="/" 
          className="inline-flex items-center px-6 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full transition-all duration-200 font-medium"
        >
          <Home className="w-5 h-5 mr-2" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 