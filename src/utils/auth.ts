import { supabase, createServiceRoleClient } from '../lib/supabase';

/**
 * Check if a user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const { data } = await supabase.auth.getSession();
  return data?.session !== null;
};

/**
 * Check if the current user has admin privileges
 * @returns {Promise<boolean>} True if user is an admin
 */
export const isAdmin = async (): Promise<boolean> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) return false;
  
  // Check if user has admin role in profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  if (error || !data) return false;
  
  return data.role === 'admin';
};

/**
 * Verify the admin access code
 * @param {string} code - The access code to verify
 * @returns {Promise<boolean>} True if code is valid
 */
export const verifyAdminAccessCode = async (code: string): Promise<boolean> => {
  if (!code || code.trim() === '') {
    console.error('Empty access code provided');
    return false;
  }

  try {
    // First attempt: Using Supabase RPC function to verify the code
    const { data, error } = await supabase.rpc('verify_admin_access_code', { 
      input_code: code.trim() 
    });
    
    if (error) {
      console.error('Admin code verification error with RPC:', error);
      
      // Fallback: Try direct table query if RPC fails
      const { data: settingsData, error: settingsError } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'admin_access_code')
        .single();
      
      if (settingsError) {
        console.error('Admin code verification error with direct query:', settingsError);
        throw new Error('Failed to verify admin code: database error');
      }
      
      // Check if provided code matches the one in database
      return settingsData?.setting_value === code.trim();
    }
    
    return data === true;
  } catch (error) {
    console.error('Error verifying admin access code:', error);
    throw error; // Re-throw to allow component to handle it
  }
}; 