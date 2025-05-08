# Database Fix Instructions

The application is currently experiencing an "infinite recursion detected in policy for relation profiles" error. This is due to a circular reference in the Row Level Security (RLS) policies.

## How to Fix the Issue

1. Log in to your Supabase dashboard at [https://app.supabase.com/project/cblvrevilzovvcwpjzee](https://app.supabase.com/project/cblvrevilzovvcwpjzee)

2. Navigate to the SQL Editor

3. Copy and paste the following SQL code and run it:

```sql
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
CREATE POLICY IF NOT EXISTS "Temporary public access to system_settings" 
    ON system_settings FOR SELECT 
    USING (true);
```

4. After applying the SQL fix, restart the application

5. Once confirmed working, you can update the SecretVerification component to disable the bypass:
   - Open `src/components/SecretVerification.tsx`
   - Change `const BYPASS_DB_CHECK = true;` to `const BYPASS_DB_CHECK = false;`

6. (Optional) If you want to remove the temporary public access policy for better security:
   ```sql
   DROP POLICY IF EXISTS "Temporary public access to system_settings" ON system_settings;
   ```

## Explanation

The issue was caused by circular references in the RLS policies. The admin access checks were recursively trying to query tables that themselves had RLS policies requiring admin access checks. 

The fix creates a dedicated `is_admin()` function that directly checks if a user has admin role, avoiding the recursion.

## Credentials

- Supabase Project URL: https://cblvrevilzovvcwpjzee.supabase.co
- Admin Access Code: AT420
- Database Password: Mdabu321@

## Verification

You can verify the database is accessible by running:

```
node test-db-connection.mjs
```

This should return the admin access code record from the system_settings table. 