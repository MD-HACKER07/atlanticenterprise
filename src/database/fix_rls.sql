-- Reset all policies for the applications table
-- Run this in the Supabase SQL Editor

-- First check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename = 'applications';

-- Delete all existing policies
DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON applications;
DROP POLICY IF EXISTS "Allow anyone to insert applications" ON applications;
DROP POLICY IF EXISTS "Allow only admins to update applications" ON applications;
DROP POLICY IF EXISTS "Allow only admins to delete applications" ON applications;
DROP POLICY IF EXISTS "Allow update applications" ON applications; 
DROP POLICY IF EXISTS "Allow delete applications" ON applications;
DROP POLICY IF EXISTS "Anyone can read applications" ON applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
DROP POLICY IF EXISTS "Anyone can update applications" ON applications;
DROP POLICY IF EXISTS "Anyone can delete applications" ON applications;

-- Create the most permissive policies possible
-- Create a policy that allows anyone to do anything
CREATE POLICY "public_insert_policy" 
ON applications 
FOR INSERT 
TO public 
WITH CHECK (true);

CREATE POLICY "public_select_policy" 
ON applications 
FOR SELECT 
TO public 
USING (true);

CREATE POLICY "public_update_policy" 
ON applications 
FOR UPDATE 
TO public 
USING (true) 
WITH CHECK (true);

CREATE POLICY "public_delete_policy" 
ON applications 
FOR DELETE 
TO public 
USING (true);

-- Create a bypass RPC function for applications
CREATE OR REPLACE FUNCTION submit_application_bypass_rls(
  p_internship_id UUID,
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_education TEXT,
  p_college TEXT DEFAULT NULL,
  p_city TEXT DEFAULT NULL,
  p_skills TEXT[] DEFAULT '{}',
  p_experience TEXT DEFAULT NULL,
  p_message TEXT DEFAULT NULL,
  p_resume_url TEXT DEFAULT NULL,
  p_resume_file_name TEXT DEFAULT NULL,
  p_linkedin_profile TEXT DEFAULT NULL,
  p_github_profile TEXT DEFAULT NULL,
  p_portfolio_url TEXT DEFAULT NULL,
  p_hear_about_us TEXT DEFAULT NULL,
  p_status TEXT DEFAULT 'pending',
  p_payment_status TEXT DEFAULT 'unpaid',
  p_payment_id TEXT DEFAULT NULL,
  p_payment_amount NUMERIC DEFAULT NULL,
  p_coupon_code TEXT DEFAULT NULL,
  p_discount_amount NUMERIC DEFAULT 0,
  p_original_amount NUMERIC DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO applications (
    internship_id, name, email, phone, education, college, city, 
    skills, experience, message, resume_url, resume_file_name,
    linkedin_profile, github_profile, portfolio_url, hear_about_us,
    status, payment_status, payment_id, payment_amount, coupon_code,
    discount_amount, original_amount, applied_at, updated_at
  ) VALUES (
    p_internship_id, p_name, p_email, p_phone, p_education, p_college, p_city,
    COALESCE(p_skills, '{}'), p_experience, p_message, p_resume_url, p_resume_file_name,
    p_linkedin_profile, p_github_profile, p_portfolio_url, p_hear_about_us,
    p_status, p_payment_status, p_payment_id, p_payment_amount, p_coupon_code,
    p_discount_amount, p_original_amount, NOW(), NOW()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Create a function that takes application data as a single JSON object
CREATE OR REPLACE FUNCTION insert_application_bypass_rls(application_data JSONB)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
  empty_array TEXT[] := '{}';
BEGIN
  INSERT INTO applications (
    internship_id, name, email, phone, education, college, city, 
    skills, experience, message, resume_url, resume_file_name,
    linkedin_profile, github_profile, portfolio_url, hear_about_us,
    status, payment_status, payment_id, payment_amount, coupon_code,
    discount_amount, original_amount, applied_at, updated_at
  ) VALUES (
    (application_data->>'internship_id')::UUID,
    application_data->>'name',
    application_data->>'email',
    application_data->>'phone',
    application_data->>'education',
    application_data->>'college',
    application_data->>'city',
    COALESCE((SELECT array_agg(jsonb_array_elements_text(application_data->'skills')) FROM (SELECT application_data) s WHERE application_data->'skills' IS NOT NULL AND jsonb_typeof(application_data->'skills') = 'array'), empty_array),
    application_data->>'experience',
    application_data->>'message',
    application_data->>'resume_url',
    application_data->>'resume_file_name',
    application_data->>'linkedin_profile',
    application_data->>'github_profile',
    application_data->>'portfolio_url',
    application_data->>'hear_about_us',
    COALESCE(application_data->>'status', 'pending'),
    COALESCE(application_data->>'payment_status', 'unpaid'),
    application_data->>'payment_id',
    (application_data->>'payment_amount')::NUMERIC,
    application_data->>'coupon_code',
    COALESCE((application_data->>'discount_amount')::NUMERIC, 0),
    (application_data->>'original_amount')::NUMERIC,
    COALESCE((application_data->>'applied_at')::TIMESTAMPTZ, NOW()),
    NOW()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$;

-- Grant execute permissions to everyone
GRANT EXECUTE ON FUNCTION submit_application_bypass_rls TO public;
GRANT EXECUTE ON FUNCTION insert_application_bypass_rls TO public;

-- Make sure RLS is enabled (but with permissive policies)
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Test the function with minimal parameters
SELECT submit_application_bypass_rls(
  '00000000-0000-0000-0000-000000000000'::UUID,
  'Test User',
  'test@example.com',
  '1234567890',
  'Bachelor''s Degree',
  NULL,
  NULL,
  '{}',
  NULL,
  NULL
);

-- List out all policies to verify they were created
SELECT tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'applications'; 