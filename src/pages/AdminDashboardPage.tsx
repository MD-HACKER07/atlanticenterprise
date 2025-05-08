import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import AdminDashboard from './AdminDashboard';

const AdminDashboardPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update fetchApplications function to use the RPC function
  const fetchApplications = async () => {
    setIsLoading(true);
    
    try {
      // First try using our admin RPC function
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_applications_for_admin');
        
      if (!rpcError && rpcData) {
        setApplications(rpcData);
        return;
      }
      
      console.error('RPC fetch failed, trying direct query:', rpcError);
      
      // Fall back to direct query if RPC fails
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching applications:', error);
        setError('Failed to load applications. Please try again.');
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  return <AdminDashboard />;
};

export default AdminDashboardPage; 