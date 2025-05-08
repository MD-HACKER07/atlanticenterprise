-- Minimal storage bucket creation 
-- This script only creates the resumes bucket without any policies

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- Disable RLS on objects table to allow all operations
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

SELECT 'Storage bucket created with minimal approach - WARNING: NO SECURITY POLICIES' as result; 