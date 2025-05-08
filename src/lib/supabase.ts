import { createClient } from '@supabase/supabase-js';

// Using environment variables if available, with fallbacks for direct development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cblvrevilzovvcwpjzee.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Function to check if Supabase connection is valid
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('internships').select('count', { count: 'exact', head: true });
    return !error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

// Function to ensure the resumes bucket exists
export const ensureResumesBucketExists = async () => {
  try {
    // Check if bucket exists
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return false;
    }
    
    const resumesBucketExists = buckets?.some(bucket => bucket.name === 'resumes');
    
    if (!resumesBucketExists) {
      console.log('Resumes bucket does not exist, creating it...');
      const { error: createError } = await supabase.storage.createBucket('resumes', {
        public: true, 
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        fileSizeLimit: 5242880 // 5MB
      });
      
      if (createError) {
        console.error('Error creating resumes bucket:', createError);
        return false;
      }
      
      console.log('Resumes bucket created successfully');
    }
    
    return true;
  } catch (err) {
    console.error('Error ensuring resumes bucket exists:', err);
    return false;
  }
}; 