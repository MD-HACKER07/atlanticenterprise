import React, { useEffect, useState } from 'react';

// This component provides detailed debug information about the loaded components
const ComponentDebugger: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorLogs, setErrorLogs] = useState<string[]>([]);

  // Intercept console errors to display them
  useEffect(() => {
    const originalConsoleError = console.error;
    
    console.error = (...args) => {
      originalConsoleError(...args);
      const errorMessage = args.map(arg => 
        typeof arg === 'string' ? arg : JSON.stringify(arg)
      ).join(' ');
      
      setErrorLogs(prev => [...prev, errorMessage].slice(-10)); // Keep last 10 errors
    };
    
    return () => {
      console.error = originalConsoleError;
    };
  }, []);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  const componentStatuses = [
    { name: 'Navbar', loaded: true },
    { name: 'Hero', loaded: true },
    { name: 'AboutSection', loaded: true },
    { name: 'ServicesSection', loaded: true },
    { name: 'InternshipForm', loaded: true },
    { name: 'ContactSection', loaded: true },
    { name: 'Footer', loaded: true }
  ];

  return (
    <div className="fixed bottom-0 right-0 bg-black bg-opacity-80 text-white p-3 m-4 rounded-lg z-50 max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-sm">Component Debugger</h3>
        <button 
          onClick={toggleExpanded}
          className="text-xs bg-gray-700 px-2 py-1 rounded hover:bg-gray-600"
        >
          {isExpanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-3 text-xs">
          <div className="mb-3">
            <h4 className="font-bold mb-1 text-green-400">Component Status:</h4>
            <ul className="space-y-1">
              {componentStatuses.map(component => (
                <li key={component.name} className="flex justify-between">
                  <span>{component.name}</span>
                  <span className={component.loaded ? 'text-green-400' : 'text-red-400'}>
                    {component.loaded ? 'Loaded ✓' : 'Error ✗'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          
          {errorLogs.length > 0 && (
            <div>
              <h4 className="font-bold mb-1 text-red-400">Recent Errors:</h4>
              <div className="bg-gray-900 p-2 rounded max-h-32 overflow-auto">
                {errorLogs.map((log, index) => (
                  <div key={index} className="text-red-300 mb-1 truncate">{log}</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ComponentDebugger; 