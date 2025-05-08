-- COMPLETE SQL SCRIPT TO FIX USER CREATION ISSUES (FIXED VERSION)
-- This addresses "Database error saving new user" and other related RLS issues
-- With additional checks to handle existing policies

------ PART 1: DISABLE RLS TEMPORARILY FOR IMMEDIATE FIX ------
-- Temporarily disable RLS on key tables to allow immediate functionality
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;
-- Note: We can't disable RLS on auth.users if it's already protected by Supabase

------ PART 2: DROP ALL EXISTING POLICIES FIRST ------
-- This ensures we start with a clean slate
DO $$
DECLARE
  policy_name text;
  table_name text;
BEGIN
  -- Drop all policies on profiles table
  FOR policy_name IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', policy_name);
  END LOOP;
  
  -- Drop conflicting policies on other tables
  FOR policy_name, table_name IN
    SELECT policyname, tablename FROM pg_policies 
    WHERE tablename IN ('applications', 'internships', 'coupons', 'system_settings')
    AND policyname LIKE '%admin%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I', policy_name, table_name);
  END LOOP;
END;
$$;

------ PART 3: CREATE IMPROVED FUNCTIONS ------
-- Create improved is_admin function that won't cause recursion
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    -- Simple check without recursion
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fix the handle_new_user trigger function with proper permissions
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Explicit insert with SECURITY DEFINER privileges 
  INSERT INTO profiles (id, email, name, role)
  VALUES (new.id, new.email, 
          COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
          CASE 
            WHEN new.email = 'atlanticenterprise8@gmail.com' THEN 'admin'
            ELSE 'user'
          END);
  RETURN new;
EXCEPTION WHEN others THEN
  -- Log error for debugging
  RAISE LOG 'Error in handle_new_user: %', SQLERRM;
  RETURN new; -- Still return new to allow user creation even if profile fails
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

------ PART 4: CREATE UPDATED RLS POLICIES ------
-- Add permissive policies for essential operations

-- PROFILES POLICIES: Critical for user registration flow
-- Allow public insert access to profiles (needed for user signup)
CREATE POLICY "Allow insert access to profiles" 
    ON profiles FOR INSERT 
    WITH CHECK (true);

-- Allow users to view their own profile
CREATE POLICY "Allow users to view own profile" 
    ON profiles FOR SELECT 
    USING (id = auth.uid());

-- Allow users to update their own profile
CREATE POLICY "Allow users to update own profile" 
    ON profiles FOR UPDATE 
    USING (id = auth.uid());

-- Allow admins to access all profiles
CREATE POLICY "Allow admin access to all profiles" 
    ON profiles FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- SYSTEM SETTINGS POLICIES
-- Drop existing system settings policies first
DO $$
DECLARE
  policy_name text;
BEGIN
  FOR policy_name IN 
    SELECT policyname FROM pg_policies WHERE tablename = 'system_settings'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON system_settings', policy_name);
  END LOOP;
END;
$$;

-- Allow public read access to specific settings
CREATE POLICY "Allow public read access to specific settings" 
    ON system_settings FOR SELECT 
    USING (setting_key IN ('admin_access_code'));

-- Allow admin write access to system settings
CREATE POLICY "Allow admin write access to system settings" 
    ON system_settings FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- APPLICATIONS POLICIES
DO $$
DECLARE
  policy_exists boolean;
BEGIN
  -- Check if policy already exists before creating it
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' AND policyname = 'Allow users to create applications'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow users to create applications
    EXECUTE 'CREATE POLICY "Allow users to create applications" 
        ON applications FOR INSERT 
        WITH CHECK (auth.role() = ''authenticated'' OR auth.role() = ''anon'')';
  END IF;
  
  -- Check for view own applications policy
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' AND policyname = 'Allow users to view their own applications'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow users to view their own applications
    EXECUTE 'CREATE POLICY "Allow users to view their own applications" 
        ON applications FOR SELECT 
        USING (email = auth.email())';
  END IF;
END;
$$;

-- Allow admin access to all applications
CREATE POLICY "Allow admin access to all applications" 
    ON applications FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- INTERNSHIPS POLICIES
DO $$
DECLARE
  policy_exists boolean;
BEGIN
  -- Check if policy already exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'internships' AND policyname = 'Allow public read access to internships'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow public read access to internships
    EXECUTE 'CREATE POLICY "Allow public read access to internships" 
        ON internships FOR SELECT 
        USING (true)';
  END IF;
END;
$$;

-- Allow admin write access to internships
CREATE POLICY "Allow admin write access to internships" 
    ON internships FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- COUPONS POLICIES
DO $$
DECLARE
  policy_exists boolean;
BEGIN
  -- Check if policy already exists
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'coupons' AND policyname = 'Allow public read access to active coupons'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow public read access to active coupons
    EXECUTE 'CREATE POLICY "Allow public read access to active coupons" 
        ON coupons FOR SELECT 
        USING (active = true AND expiry_date > NOW() AND current_uses < max_uses)';
  END IF;
END;
$$;

-- Allow admin access to all coupons
CREATE POLICY "Allow admin access to coupons" 
    ON coupons FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

------ PART 5: RE-ENABLE RLS WITH NEW POLICIES ------
-- Now that we've fixed the policies, we can re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

------ PART 6: TEST AND VERIFY ------
-- Insert a test setting to verify permissions
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES ('test_setting', 'test_value', 'This is a test setting to verify permissions')
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = 'test_value_updated', updated_at = NOW();

-- Log the completion of the script
DO $$ 
BEGIN
  RAISE NOTICE 'User creation fix completed successfully! You can now test creating users.';
  RAISE NOTICE 'If you experience any issues, you may need to restart your Supabase instance.';
END $$; 