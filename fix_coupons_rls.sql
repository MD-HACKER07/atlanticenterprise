-- Fix Row-Level Security (RLS) policies for the coupons table

-- First, check if RLS is enabled for the coupons table and enable it if not
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_tables 
        WHERE tablename = 'coupons' AND rowsecurity = true
    ) THEN
        -- Enable row level security
        ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON coupons;
DROP POLICY IF EXISTS "Allow read access to authenticated users" ON coupons;
DROP POLICY IF EXISTS "Allow insert to authenticated users" ON coupons;
DROP POLICY IF EXISTS "Allow update to authenticated users" ON coupons;
DROP POLICY IF EXISTS "Allow delete to authenticated users" ON coupons;

-- Create policy to allow full access to authenticated users
CREATE POLICY "Allow full access to authenticated users" 
ON coupons
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow read access for active coupons to all users (for validation)
CREATE POLICY "Allow read access for active coupons"
ON coupons
FOR SELECT
USING (active = true);

-- Create policy to allow system service account access
CREATE POLICY "Allow service role access" 
ON coupons
USING (auth.jwt() ->> 'role' = 'service_role')
WITH CHECK (auth.jwt() ->> 'role' = 'service_role');

-- Create policy to allow anon users to validate coupons by code
CREATE POLICY "Allow anon users to validate coupons"
ON coupons
FOR SELECT
USING (auth.role() = 'anon' AND active = true);

-- Create a policy to allow users to search for valid coupons
CREATE POLICY "Allow users to search for valid coupons"
ON coupons 
FOR SELECT
USING (
    auth.role() = 'anon' AND 
    active = true AND 
    current_date <= expiry_date::date AND
    (current_uses < max_uses OR max_uses = 0)
);

-- Create a bypass RLS function for service role use
CREATE OR REPLACE FUNCTION bypass_rls() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN current_setting('role', FALSE)::TEXT = 'service_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a view for accessing coupons without RLS for admin purposes
CREATE OR REPLACE VIEW admin_coupons AS
SELECT * FROM coupons
WHERE bypass_rls();

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON coupons TO authenticated;
GRANT SELECT ON coupons TO anon;
GRANT SELECT ON admin_coupons TO authenticated;

-- Make sure the trigger function can bypass RLS
ALTER FUNCTION increment_coupon_usage() SECURITY DEFINER;
ALTER FUNCTION increment_coupon_usage_by_code(coupon_code TEXT) SECURITY DEFINER; 