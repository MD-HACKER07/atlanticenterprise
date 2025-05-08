import React from 'react';

// This component just helps us debug which imports might be failing
const Debug: React.FC = () => {
  return (
    <div className="fixed bottom-0 right-0 p-4 bg-yellow-100 text-xs z-50">
      <h3 className="font-bold mb-1">Import Status:</h3>
      <ul>
        <li>React: {typeof React !== 'undefined' ? '✅' : '❌'}</li>
        <li>React.Component: {typeof React.Component !== 'undefined' ? '✅' : '❌'}</li>
        <li>React.useState: {typeof React.useState === 'function' ? '✅' : '❌'}</li>
      </ul>
    </div>
  );
};

export default Debug; 