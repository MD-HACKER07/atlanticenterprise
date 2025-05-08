import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

interface SecureLoginRouteProps {
  children: React.ReactNode;
}

const SecureLoginRoute: React.FC<SecureLoginRouteProps> = ({ children }) => {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  
  useEffect(() => {
    // Check if the user has verified with the secret code
    const accessVerified = sessionStorage.getItem('accessVerified') === 'true';
    setIsVerified(accessVerified);
  }, []);
  
  // Show loading state while checking verification
  if (isVerified === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  // If not verified, redirect to verification page
  if (!isVerified) {
    return <Navigate to="/verify-access" replace />;
  }
  
  // If verified, show the login page
  return <>{children}</>;
};

export default SecureLoginRoute; 