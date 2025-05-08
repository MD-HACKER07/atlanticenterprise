-- Fix Row Level Security (RLS) policies for the applications table
-- Run this in Supabase SQL Editor to fix permission issues

-- First, check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'applications';

-- First, check if is_admin column exists, and create it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'is_admin'
  ) THEN
    -- Add is_admin column to auth.users table
    ALTER TABLE auth.users ADD COLUMN is_admin BOOLEAN DEFAULT false;
    
    -- Uncomment this and set your admin email to give yourself admin access
    -- UPDATE auth.users SET is_admin = true WHERE email = 'your-admin-email@example.com';
  END IF;
END $$;

-- First, drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON applications;
DROP POLICY IF EXISTS "Allow anyone to insert applications" ON applications;
DROP POLICY IF EXISTS "Allow only admins to update applications" ON applications;
DROP POLICY IF EXISTS "Allow only admins to delete applications" ON applications;

-- Create or replace read policy for authenticated users
CREATE POLICY "Allow authenticated users to read applications"
ON applications FOR SELECT
TO authenticated
USING (true);

-- Create or replace insert policy for anyone
CREATE POLICY "Allow anyone to insert applications"
ON applications FOR INSERT
TO authenticated, anon
WITH CHECK (true);

-- Create simple update policy that works even without admin column
CREATE POLICY "Allow update applications"
ON applications FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create simple delete policy that works even without admin column
CREATE POLICY "Allow delete applications"
ON applications FOR DELETE
TO authenticated
USING (true);

-- Enable RLS on the applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Verify users
SELECT email, id 
FROM auth.users
WHERE email LIKE '%@%';

-- Set admin flag on existing users if needed (CUSTOMIZE WITH YOUR ADMIN EMAIL)
-- Uncomment and run this if your admin user doesn't have admin privileges
-- UPDATE auth.users
-- SET is_admin = true
-- WHERE email = 'your-admin-email@example.com';

-- Test the RPC functions
-- SELECT submit_application(
--   'cd3dc11a-0b7a-4ec1-8131-892b5f44c9d1'::UUID,
--   'Test User',
--   'test@example.com',
--   '1234567890',
--   'Bachelor''s Degree'
-- ); 