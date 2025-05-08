import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Test Page</h1>
        <p className="text-gray-700 mb-6">
          If you can see this page, React and the basic components are working properly.
        </p>
        <p className="text-sm text-gray-500">
          React version: {React.version}
        </p>
      </div>
    </div>
  );
};

export default TestPage; 