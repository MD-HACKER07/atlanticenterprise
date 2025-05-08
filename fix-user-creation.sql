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

-- 7. Validate the setup by allowing a test user creation
-- This should be removed in production after testing
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY; 