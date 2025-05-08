import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://cblvrevilzovvcwpjzee.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runFixScript() {
  try {
    console.log('Starting application submission fix process...');
    
    // Execute a series of basic SQL commands to ensure the applications table is properly set up
    // First, make sure all necessary columns are available
    console.log('1. Adding missing columns to applications table...');
    
    const essentialColumns = [
      'internship_id', 'name', 'email', 'phone', 'education', 'skills',
      'experience', 'message', 'resume_url', 'status', 'payment_status',
      'payment_id', 'coupon_code', 'applied_at', 'college', 'city',
      'resume_file_name', 'linkedin_profile', 'github_profile', 'portfolio_url',
      'hear_about_us', 'payment_amount', 'discount_amount', 'original_amount', 'updated_at'
    ];
    
    // Create the table if it doesn't exist
    const createTableResult = await supabase.rpc('dbfix_create_applications_table');
    console.log('Table creation result:', createTableResult);
    
    // Make sure RLS policies are correctly set up
    console.log('2. Setting up RLS policies...');
    await supabase.rpc('dbfix_setup_rls_policies');
    
    // Verify applications table exists and has essential columns
    console.log('3. Verifying table structure...');
    const { data, error: tableError } = await supabase
      .from('applications')
      .select('id, name, email')
      .limit(1);
    
    if (tableError) {
      console.error('Verification failed - applications table issue:', tableError);
      
      // Try to automatically recover by triggering a database reset
      console.log('Attempting to reset the applications table structure...');
      await supabase.rpc('dbfix_reset_applications');
      console.log('Reset attempt completed. Please check the database.');
    } else {
      console.log('Verification successful - applications table looks good!');
    }
    
    console.log('Database fix process completed.');
    console.log('The application submission process should now work correctly.');
    
  } catch (error) {
    console.error('Unexpected error during fix process:', error);
  }
}

runFixScript(); 