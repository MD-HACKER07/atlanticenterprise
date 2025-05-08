// This file contains the admin client with service role credentials
// It's used for operations that need to bypass Row Level Security (RLS)

import { createClient } from '@supabase/supabase-js';

// Supabase URL and service role key should be set in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

// Create the admin client with service role key if available
export const adminSupabase = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// Note: This client has full admin privileges, so use it carefully
// and only for specific operations that require bypassing RLS

// Function to check if admin client is available
export const hasAdminAccess = (): boolean => {
  return !!adminSupabase;
}; 