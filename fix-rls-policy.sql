-- Script to fix the infinite recursion in the Row Level Security policy for profiles table

-- Drop the problematic policies
DROP POLICY IF EXISTS "Allow admin access to all profiles" ON profiles;
DROP POLICY IF EXISTS "Allow admin access to all applications" ON applications;
DROP POLICY IF EXISTS "Allow admin write access to internships" ON internships;
DROP POLICY IF EXISTS "Allow admin access to coupons" ON coupons;
DROP POLICY IF EXISTS "Allow admin write access to system settings" ON system_settings;

-- Define a helper function to check admin status without recursion
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

-- Recreate the profiles policy without recursive call
CREATE POLICY "Allow admin access to all profiles" 
    ON profiles FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- Fix the applications policy
CREATE POLICY "Allow admin access to all applications" 
    ON applications FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- Fix the internships policy
CREATE POLICY "Allow admin write access to internships" 
    ON internships FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- Fix the coupons policy
CREATE POLICY "Allow admin access to coupons" 
    ON coupons FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- Fix the system settings policy
CREATE POLICY "Allow admin write access to system settings" 
    ON system_settings FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- Temporary public access policy for system_settings to allow authentication to work during the fix
-- You can remove this after verifying the fix works if you want tighter security
CREATE POLICY IF NOT EXISTS "Temporary public access to system_settings" 
    ON system_settings FOR SELECT 
    USING (true); 