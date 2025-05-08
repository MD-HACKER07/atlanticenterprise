-- Fix storage buckets and permissions
-- Run this in the Supabase SQL Editor

-- Create or check for resumes bucket
DO $$
DECLARE
  bucket_exists boolean;
BEGIN
  -- Check if the bucket exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'resumes'
  ) INTO bucket_exists;
  
  -- Create the bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types, owner)
    VALUES (
      'resumes',
      'resumes',
      true,
      false,
      5242880, -- 5MB
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      NULL
    );
  
    RAISE NOTICE 'Created resumes bucket';
  ELSE
    -- Update the existing bucket to ensure it's public and has the right settings
    UPDATE storage.buckets
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    WHERE name = 'resumes';
    
    RAISE NOTICE 'Updated resumes bucket settings';
  END IF;
END $$;

-- Set RLS policies for the storage.objects table instead of using storage.policies

-- First enable row level security on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$
BEGIN
    -- Try to drop existing policies - will fail silently if they don't exist
    BEGIN
        DROP POLICY IF EXISTS "Anyone can read resumes" ON storage.objects;
        RAISE NOTICE 'Dropped existing read policy';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Read policy did not exist';
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can upload to resumes" ON storage.objects;
        RAISE NOTICE 'Dropped existing upload policy';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Upload policy did not exist';
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can update their own resumes" ON storage.objects;
        RAISE NOTICE 'Dropped existing update policy';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Update policy did not exist';
    END;
    
    BEGIN
        DROP POLICY IF EXISTS "Authenticated users can delete their own resumes" ON storage.objects;
        RAISE NOTICE 'Dropped existing delete policy';
    EXCEPTION WHEN OTHERS THEN
        RAISE NOTICE 'Delete policy did not exist';
    END;
END $$;

-- Allow public read access to all objects in the resumes bucket
CREATE POLICY "Anyone can read resumes" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'resumes');

-- Allow authenticated users to upload to resumes bucket
CREATE POLICY "Authenticated users can upload to resumes" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their own objects
CREATE POLICY "Authenticated users can update their own resumes" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated' AND owner = auth.uid())
  WITH CHECK (bucket_id = 'resumes' AND auth.role() = 'authenticated' AND owner = auth.uid());

-- Allow authenticated users to delete their own objects
CREATE POLICY "Authenticated users can delete their own resumes" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'resumes' AND auth.role() = 'authenticated' AND owner = auth.uid());

-- Return a success message
SELECT 'Storage resumes bucket and policies successfully configured' as result; 