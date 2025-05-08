-- Schema for Internship Application Management System
-- This file contains all the necessary SQL to set up the database in Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create internships table
CREATE TABLE IF NOT EXISTS internships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    duration TEXT NOT NULL,
    stipend TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[] NOT NULL,
    responsibilities TEXT[] NOT NULL,
    application_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location TEXT NOT NULL,
    remote BOOLEAN NOT NULL DEFAULT FALSE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    payment_required BOOLEAN NOT NULL DEFAULT FALSE,
    application_fee INTEGER,
    accepts_coupon BOOLEAN DEFAULT FALSE,
    terms_and_conditions TEXT[],
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT application_fee_check CHECK (
        (payment_required = FALSE) OR 
        (payment_required = TRUE AND application_fee IS NOT NULL AND application_fee > 0)
    )
);

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    discount_percent INTEGER NOT NULL,
    max_uses INTEGER NOT NULL,
    current_uses INTEGER NOT NULL DEFAULT 0,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    internship_id UUID REFERENCES internships(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT discount_percent_check CHECK (discount_percent > 0 AND discount_percent <= 100),
    CONSTRAINT max_uses_check CHECK (max_uses > 0),
    CONSTRAINT current_uses_check CHECK (current_uses >= 0 AND current_uses <= max_uses)
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    internship_id UUID NOT NULL REFERENCES internships(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    education TEXT NOT NULL,
    skills TEXT[] NOT NULL DEFAULT '{}',
    experience TEXT,
    message TEXT,
    resume_url TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT,
    payment_id TEXT,
    coupon_code TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT status_check CHECK (status IN ('pending', 'approved', 'rejected')),
    CONSTRAINT payment_status_check CHECK (payment_status IN ('unpaid', 'paid', 'waived') OR payment_status IS NULL)
);

-- Create user profiles table for storing extended user information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create system_settings table for storing configurations
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    setting_key TEXT NOT NULL UNIQUE,
    setting_value TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert the secret access code
INSERT INTO system_settings (setting_key, setting_value, description)
VALUES ('admin_access_code', 'AT420', 'Secret code required to access the admin login page')
ON CONFLICT (setting_key) 
DO UPDATE SET setting_value = EXCLUDED.setting_value, updated_at = NOW();

-- Create indexes for better performance
CREATE INDEX idx_internships_created_at ON internships(created_at DESC);
CREATE INDEX idx_internships_application_deadline ON internships(application_deadline);
CREATE INDEX idx_internships_department ON internships(department);
CREATE INDEX idx_internships_location ON internships(location);
CREATE INDEX idx_internships_payment_required ON internships(payment_required);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(active);
CREATE INDEX idx_coupons_expiry_date ON coupons(expiry_date);
CREATE INDEX idx_coupons_internship_id ON coupons(internship_id);

CREATE INDEX idx_applications_internship_id ON applications(internship_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at DESC);
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_payment_status ON applications(payment_status);

CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_email ON profiles(email);

-- Security policies (Row Level Security)
-- Enable RLS on all tables
ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
-- Internships: Everyone can read, only admins can write
CREATE POLICY "Allow public read access to internships" 
    ON internships FOR SELECT 
    USING (true);

CREATE POLICY "Allow admin write access to internships" 
    ON internships FOR ALL 
    USING (auth.role() = 'authenticated' AND (
        SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin');

-- Coupons: Only admins can manage, but application system needs to validate
CREATE POLICY "Allow admin access to coupons" 
    ON coupons FOR ALL 
    USING (auth.role() = 'authenticated' AND (
        SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin');

CREATE POLICY "Allow public read access to active coupons" 
    ON coupons FOR SELECT 
    USING (active = true AND expiry_date > NOW() AND current_uses < max_uses);

-- Applications: Users can create and view their own, admins can see all
CREATE POLICY "Allow users to create applications" 
    ON applications FOR INSERT 
    WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Allow users to view their own applications" 
    ON applications FOR SELECT 
    USING (email = auth.email());

CREATE POLICY "Allow admin access to all applications" 
    ON applications FOR ALL 
    USING (auth.role() = 'authenticated' AND (
        SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin');

-- Profiles: Users can view their own profile, admins can see all
CREATE POLICY "Allow users to view own profile" 
    ON profiles FOR SELECT 
    USING (id = auth.uid());

CREATE POLICY "Allow users to update own profile" 
    ON profiles FOR UPDATE 
    USING (id = auth.uid());

CREATE POLICY "Allow admin access to all profiles" 
    ON profiles FOR ALL 
    USING (auth.role() = 'authenticated' AND (
        SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin');

-- Allow public read access to specific settings
CREATE POLICY "Allow public read access to specific settings" 
    ON system_settings FOR SELECT 
    USING (setting_key IN ('admin_access_code'));

-- Allow admin write access to all settings
CREATE POLICY "Allow admin write access to system settings" 
    ON system_settings FOR ALL 
    USING (auth.role() = 'authenticated' AND (
        SELECT role FROM profiles WHERE id = auth.uid()
    ) = 'admin');

-- Functions for managing coupons
CREATE OR REPLACE FUNCTION validate_coupon(
    coupon_code TEXT,
    internship_id UUID
) RETURNS TABLE (
    valid BOOLEAN, 
    discount_percent INTEGER,
    error_message TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        CASE 
            WHEN c.id IS NULL THEN FALSE
            WHEN c.active = FALSE THEN FALSE
            WHEN c.expiry_date <= NOW() THEN FALSE
            WHEN c.current_uses >= c.max_uses THEN FALSE
            WHEN c.internship_id IS NOT NULL AND c.internship_id != internship_id THEN FALSE
            ELSE TRUE
        END AS valid,
        CASE 
            WHEN c.id IS NULL THEN 0
            WHEN c.active = FALSE THEN 0
            WHEN c.expiry_date <= NOW() THEN 0
            WHEN c.current_uses >= c.max_uses THEN 0
            WHEN c.internship_id IS NOT NULL AND c.internship_id != internship_id THEN 0
            ELSE c.discount_percent
        END AS discount_percent,
        CASE 
            WHEN c.id IS NULL THEN 'Invalid coupon code'
            WHEN c.active = FALSE THEN 'Coupon is not active'
            WHEN c.expiry_date <= NOW() THEN 'Coupon has expired'
            WHEN c.current_uses >= c.max_uses THEN 'Coupon has reached maximum usage limit'
            WHEN c.internship_id IS NOT NULL AND c.internship_id != internship_id THEN 'Coupon not valid for this internship'
            ELSE 'Valid'
        END AS error_message
    FROM coupons c
    WHERE c.code = coupon_code
    LIMIT 1;
    
    -- If no rows returned, coupon doesn't exist
    IF NOT FOUND THEN
        RETURN QUERY SELECT FALSE, 0, 'Invalid coupon code';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to apply coupon (increment usage counter)
CREATE OR REPLACE FUNCTION apply_coupon(
    coupon_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    updated_rows INTEGER;
BEGIN
    UPDATE coupons
    SET current_uses = current_uses + 1
    WHERE code = coupon_code
    AND active = TRUE
    AND expiry_date > NOW()
    AND current_uses < max_uses
    RETURNING 1 INTO updated_rows;
    
    RETURN COALESCE(updated_rows, 0) > 0;
END;
$$ LANGUAGE plpgsql;

-- Function to handle user registration with profile creation
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
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

-- Trigger to automatically create a profile when a new user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to verify admin access code
CREATE OR REPLACE FUNCTION verify_admin_access_code(
    input_code TEXT
) RETURNS BOOLEAN AS $$
DECLARE
    stored_code TEXT;
BEGIN
    SELECT setting_value INTO stored_code
    FROM system_settings
    WHERE setting_key = 'admin_access_code';
    
    RETURN input_code = stored_code;
END;
$$ LANGUAGE plpgsql;

-- Sample admin user creation and data for testing
-- IMPORTANT: This will be used to create the admin user with the specified credentials
-- when this script is run. Please update the credentials according to your needs.

-- Create admin user: atlanticenterprise8@gmail.com with password AT420
-- NOTE: In Supabase, you cannot directly insert into auth.users table through SQL
-- You must create users through the Auth API or Supabase dashboard
-- The following commented block is for reference only
/*
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Check if the admin email already exists in auth.users
  SELECT id INTO admin_user_id FROM auth.users WHERE email = 'atlanticenterprise8@gmail.com' LIMIT 1;
  
  -- If admin doesn't exist, create it
  IF admin_user_id IS NULL THEN
    -- Insert admin user into auth.users
    -- Note: In Supabase, you'd normally use the authentication API to create users
    -- This direct insert is for demonstration purposes only
    INSERT INTO auth.users (
      email,
      raw_user_meta_data,
      created_at,
      email_confirmed_at
    ) VALUES (
      'atlanticenterprise8@gmail.com',
      jsonb_build_object('name', 'Admin User'),
      NOW(),
      NOW()
    ) RETURNING id INTO admin_user_id;
    
    -- If using this script on a real Supabase instance, you would instead:
    -- 1. Create the user through Supabase Auth API or dashboard
    -- 2. Then manually assign the admin role through profiles table update
    
    -- Set the user's password (note: this won't work directly in Supabase)
    -- In a real scenario, you would set the password through the Auth API
    -- UPDATE auth.users SET encrypted_password = crypt('AT420', gen_salt('bf')) WHERE id = admin_user_id;
    
    -- Insert admin profile (will be triggered automatically in Supabase)
    INSERT INTO profiles (id, email, name, role)
    VALUES (admin_user_id, 'atlanticenterprise8@gmail.com', 'Admin User', 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
  END IF;
END $$;
*/

-- INSTRUCTIONS FOR CREATING ADMIN USER:
-- 1. Use the Supabase dashboard or auth API to create a user with email: atlanticenterprise8@gmail.com and password: AT420
-- 2. The trigger handle_new_user() will automatically assign this user the admin role
-- 3. Alternatively, you can manually update the user's role after creation:
--    UPDATE profiles SET role = 'admin' WHERE email = 'atlanticenterprise8@gmail.com';

-- IMPORTANT NOTE:
-- When using this with an actual Supabase project:
-- 1. The auth.users table is managed by Supabase and you cannot directly insert into it.
-- 2. Instead, create the admin user through the Supabase dashboard or API.
-- 3. Then update the user's role in the profiles table if needed.
-- 4. The trigger will automatically assign admin role to specific emails for future signups.

-- Sample data for testing (commented out by default)
/*
-- Sample internships
INSERT INTO internships (
    title, department, duration, stipend, description, 
    requirements, responsibilities, application_deadline, 
    start_date, location, remote, featured, 
    payment_required, application_fee, accepts_coupon
) VALUES 
(
    'Frontend Developer Intern', 'Engineering', '3 months', '₹10,000/month',
    'Join our team to work on exciting web projects using React and TypeScript.',
    ARRAY['Knowledge of HTML, CSS, and JavaScript', 'Familiarity with React or similar frameworks', 'Understanding of responsive design'],
    ARRAY['Develop and maintain UI components', 'Collaborate with backend developers', 'Optimize applications for performance'],
    NOW() + INTERVAL '30 days', NOW() + INTERVAL '45 days', 'Bangalore', TRUE, TRUE, 
    TRUE, 500, TRUE
),
(
    'UI/UX Design Intern', 'Design', '6 months', '₹12,000/month',
    'Help us create beautiful and intuitive user experiences for our products.',
    ARRAY['Proficiency in Figma or Adobe XD', 'Understanding of design principles', 'Basic knowledge of HTML/CSS'],
    ARRAY['Create wireframes and prototypes', 'Conduct user research', 'Collaborate with development team'],
    NOW() + INTERVAL '20 days', NOW() + INTERVAL '40 days', 'Mumbai', FALSE, FALSE,
    FALSE, NULL, FALSE
);

-- Sample coupons
INSERT INTO coupons (
    code, discount_percent, max_uses, expiry_date, active, internship_id
) VALUES
(
    'WELCOME25', 25, 100, NOW() + INTERVAL '90 days', TRUE, 
    (SELECT id FROM internships WHERE title = 'Frontend Developer Intern' LIMIT 1)
),
(
    'SUMMER50', 50, 50, NOW() + INTERVAL '60 days', TRUE, NULL
);
*/
