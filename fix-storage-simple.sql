-- Simple storage bucket creation and policy setup
-- This script uses a simpler approach with fewer commands

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE 
SET public = true;

-- Make sure RLS is enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Simple approach: replace all policies with new ones
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
DROP POLICY IF EXISTS "Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Owner Full Access" ON storage.objects;

-- Create policies with simpler names
CREATE POLICY "Public Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'resumes');

CREATE POLICY "Auth Insert" ON storage.objects 
FOR INSERT WITH CHECK (
  bucket_id = 'resumes' AND 
  auth.role() = 'authenticated'
);

CREATE POLICY "Owner Full Access" ON storage.objects 
USING (
  bucket_id = 'resumes' AND 
  auth.role() = 'authenticated' AND 
  owner = auth.uid()
);

-- Enable bucket default permissions
UPDATE storage.buckets 
SET public = true, 
    file_size_limit = 5242880
WHERE id = 'resumes';

SELECT 'Storage bucket and policies successfully configured with simple approach' as result; 