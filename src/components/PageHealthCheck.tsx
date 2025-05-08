import React, { useEffect, useState } from 'react';

const PageHealthCheck: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    // Log to console for debugging
    console.log('PageHealthCheck component mounted successfully');
    
    return () => {
      setMounted(false);
      console.log('PageHealthCheck component unmounted');
    };
  }, []);
  
  return (
    <div className="fixed bottom-0 right-0 bg-green-500 text-white text-xs px-2 py-1 m-2 rounded-md z-50" style={{opacity: 0.7}}>
      {mounted ? 'Page Loaded ✓' : 'Loading...'}
    </div>
  );
};

export default PageHealthCheck; 