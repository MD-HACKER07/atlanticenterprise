-- Create functions to fix the applications table structure

-- Function to create applications table
CREATE OR REPLACE FUNCTION dbfix_create_applications_table()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Create table if it doesn't exist
  CREATE TABLE IF NOT EXISTS applications (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      internship_id UUID NOT NULL,
      name VARCHAR NOT NULL,
      email VARCHAR NOT NULL,
      phone VARCHAR NOT NULL,
      education VARCHAR NOT NULL,
      skills VARCHAR[] DEFAULT '{}',
      experience TEXT,
      message TEXT,
      resume_url TEXT,
      status VARCHAR NOT NULL DEFAULT 'pending',
      payment_status VARCHAR,
      payment_id VARCHAR,
      coupon_code VARCHAR,
      applied_at TIMESTAMPTZ DEFAULT NOW()
  );
  
  -- Add all needed columns if they don't exist
  BEGIN
      -- Add missing columns in snake_case if they don't exist
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'college') THEN
          ALTER TABLE applications ADD COLUMN college VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'city') THEN
          ALTER TABLE applications ADD COLUMN city VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'resume_file_name') THEN
          ALTER TABLE applications ADD COLUMN resume_file_name VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'linkedin_profile') THEN
          ALTER TABLE applications ADD COLUMN linkedin_profile VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'github_profile') THEN
          ALTER TABLE applications ADD COLUMN github_profile VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'portfolio_url') THEN
          ALTER TABLE applications ADD COLUMN portfolio_url VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'hear_about_us') THEN
          ALTER TABLE applications ADD COLUMN hear_about_us VARCHAR;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'payment_amount') THEN
          ALTER TABLE applications ADD COLUMN payment_amount NUMERIC;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'discount_amount') THEN
          ALTER TABLE applications ADD COLUMN discount_amount NUMERIC;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'original_amount') THEN
          ALTER TABLE applications ADD COLUMN original_amount NUMERIC;
      END IF;
      
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'updated_at') THEN
          ALTER TABLE applications ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
      END IF;
  EXCEPTION
      WHEN others THEN
          result := jsonb_build_object('error', SQLERRM);
          RETURN result;
  END;
  
  result := jsonb_build_object('success', true, 'message', 'Applications table structure created/updated');
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to set up RLS policies
CREATE OR REPLACE FUNCTION dbfix_setup_rls_policies()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Enable row level security
  ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
  
  -- Drop existing policy if it exists
  DROP POLICY IF EXISTS "Allow anyone to create applications" ON applications;
  
  -- Create policy for allowing insert
  CREATE POLICY "Allow anyone to create applications" 
    ON applications FOR INSERT 
    WITH CHECK (true);
    
  -- Grant public access
  GRANT ALL ON applications TO public;
  
  result := jsonb_build_object('success', true, 'message', 'RLS policies set up successfully');
  RETURN result;
EXCEPTION
  WHEN others THEN
    result := jsonb_build_object('error', SQLERRM);
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to reset applications table structure in case of issues
CREATE OR REPLACE FUNCTION dbfix_reset_applications()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Drop the constraints
  ALTER TABLE IF EXISTS applications DROP CONSTRAINT IF EXISTS applications_pkey;
  
  -- Recreate the table structure
  ALTER TABLE applications 
    ADD COLUMN IF NOT EXISTS id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ADD COLUMN IF NOT EXISTS internship_id UUID NOT NULL,
    ADD COLUMN IF NOT EXISTS name VARCHAR NOT NULL,
    ADD COLUMN IF NOT EXISTS email VARCHAR NOT NULL,
    ADD COLUMN IF NOT EXISTS phone VARCHAR NOT NULL,
    ADD COLUMN IF NOT EXISTS education VARCHAR NOT NULL,
    ADD COLUMN IF NOT EXISTS skills VARCHAR[] DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS status VARCHAR NOT NULL DEFAULT 'pending',
    ADD COLUMN IF NOT EXISTS payment_status VARCHAR,
    ADD COLUMN IF NOT EXISTS payment_id VARCHAR;
  
  result := jsonb_build_object('success', true, 'message', 'Applications table reset completed');
  RETURN result;
EXCEPTION
  WHEN others THEN
    result := jsonb_build_object('error', SQLERRM);
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 