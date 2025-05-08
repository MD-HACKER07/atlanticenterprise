# User Creation Fix for InternHub

## Issue
You're encountering the error "Failed to create user: Database error creating new user" when trying to create users in Supabase. This is related to the same Row Level Security (RLS) issues we identified earlier.

## How to Fix

1. Log in to your Supabase dashboard at [https://app.supabase.com/project/cblvrevilzovvcwpjzee](https://app.supabase.com/project/cblvrevilzovvcwpjzee)

2. Navigate to the SQL Editor

3. Copy and paste the following SQL code and run it:

```sql
-- SQL script to fix user creation in Supabase

-- 1. Create a temporary bypass for the profiles table RLS
CREATE POLICY IF NOT EXISTS "Temporary public insert access to profiles" 
    ON profiles FOR INSERT 
    WITH CHECK (true);

-- 2. Fix the handle_new_user trigger function to avoid permission issues
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  -- Add security definer and explicit permissions bypass
  INSERT INTO profiles (id, email, name, role)
  VALUES (new.id, new.email, 
          COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)), 
          CASE 
            WHEN new.email = 'atlanticenterprise8@gmail.com' THEN 'admin'
            ELSE 'user'
          END);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Apply the is_admin function we created in the previous fix
-- This function checks admin status without causing recursion
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

-- 4. Update or recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Add public access policy for the profiles table specifically for new users
-- This allows the trigger to create the initial profile even with RLS enabled
CREATE POLICY IF NOT EXISTS "Allow public insert access to profiles" 
    ON profiles FOR INSERT 
    WITH CHECK (true);

-- Make sure other policies are properly updated too (from our previous fix)
DROP POLICY IF EXISTS "Allow admin access to all profiles" ON profiles;
CREATE POLICY "Allow admin access to all profiles" 
    ON profiles FOR ALL 
    USING (auth.role() = 'authenticated' AND is_admin());

-- 6. Make sure public read access to own profile works
CREATE POLICY IF NOT EXISTS "Allow users to view own profile" 
    ON profiles FOR SELECT 
    USING (id = auth.uid());

CREATE POLICY IF NOT EXISTS "Allow users to update own profile" 
    ON profiles FOR UPDATE 
    USING (id = auth.uid());

-- 7. Temporarily disable RLS on profiles table for testing user creation
-- IMPORTANT: Re-enable this after successful testing!
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
```

4. Test creating a user in the Supabase Authentication dashboard

5. If user creation works, you should re-enable RLS on the profiles table:
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

## What This Fix Does

The issue is that the database's Row Level Security (RLS) is preventing the user creation process from adding the necessary profile record. This happens because:

1. When a new user is created in Supabase, a trigger called `on_auth_user_created` runs automatically
2. This trigger tries to insert a record into the `profiles` table  
3. But RLS policies are blocking this insert due to permission issues and circular references

Our fix:
1. Adds appropriate RLS policies to allow initial profile creation
2. Updates the trigger function with proper permissions (SECURITY DEFINER)
3. Temporarily disables RLS for testing 
4. Creates proper policies for normal operation once RLS is re-enabled

## Additional Notes

- The SECURITY DEFINER option allows the function to run with the privileges of the user who created it (typically the database owner), bypassing RLS
- The temporary RLS disable is just for testing - make sure to re-enable it once confirmed working
- This fix is compatible with the earlier RLS fixes for infinite recursion

## Credentials

- Supabase Project URL: https://cblvrevilzovvcwpjzee.supabase.co
- Admin Access Code: AT420
- Database Password: Mdabu321@ 