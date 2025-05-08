-- Fix Applications Table
-- This script ensures the applications table has all needed columns and sets up syncing between camelCase and snake_case fields

-- First, make sure the applications table exists
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

-- Add all the columns that might be missing but are used in the application form
DO $$ 
BEGIN
    -- Add missing columns in snake_case if they don't exist
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'college') THEN
        ALTER TABLE applications ADD COLUMN college VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'city') THEN
        ALTER TABLE applications ADD COLUMN city VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'resume_file_name') THEN
        ALTER TABLE applications ADD COLUMN resume_file_name VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'linkedin_profile') THEN
        ALTER TABLE applications ADD COLUMN linkedin_profile VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'github_profile') THEN
        ALTER TABLE applications ADD COLUMN github_profile VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'portfolio_url') THEN
        ALTER TABLE applications ADD COLUMN portfolio_url VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'hear_about_us') THEN
        ALTER TABLE applications ADD COLUMN hear_about_us VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'payment_amount') THEN
        ALTER TABLE applications ADD COLUMN payment_amount NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'discount_amount') THEN
        ALTER TABLE applications ADD COLUMN discount_amount NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'original_amount') THEN
        ALTER TABLE applications ADD COLUMN original_amount NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'updated_at') THEN
        ALTER TABLE applications ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add camelCase versions of the columns for compatibility
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'internshipid') THEN
        ALTER TABLE applications ADD COLUMN "internshipId" UUID;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'resumeurl') THEN
        ALTER TABLE applications ADD COLUMN "resumeUrl" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'resumefilename') THEN
        ALTER TABLE applications ADD COLUMN "resumeFileName" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'linkedinprofile') THEN
        ALTER TABLE applications ADD COLUMN "linkedInProfile" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'githubprofile') THEN
        ALTER TABLE applications ADD COLUMN "githubProfile" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'portfoliourl') THEN
        ALTER TABLE applications ADD COLUMN "portfolioUrl" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'hearaboutus') THEN
        ALTER TABLE applications ADD COLUMN "hearAboutUs" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'paymentstatus') THEN
        ALTER TABLE applications ADD COLUMN "paymentStatus" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'paymentid') THEN
        ALTER TABLE applications ADD COLUMN "paymentId" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'paymentamount') THEN
        ALTER TABLE applications ADD COLUMN "paymentAmount" NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'couponcode') THEN
        ALTER TABLE applications ADD COLUMN "couponCode" VARCHAR;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'discountamount') THEN
        ALTER TABLE applications ADD COLUMN "discountAmount" NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'originalamount') THEN
        ALTER TABLE applications ADD COLUMN "originalAmount" NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'appliedat') THEN
        ALTER TABLE applications ADD COLUMN "appliedAt" TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'applications' AND column_name = 'updatedat') THEN
        ALTER TABLE applications ADD COLUMN "updatedAt" TIMESTAMPTZ DEFAULT NOW();
    END IF;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column already exists, skipping';
END $$;

-- Create trigger function to keep snake_case and camelCase columns in sync
CREATE OR REPLACE FUNCTION sync_application_columns()
RETURNS TRIGGER AS $$
BEGIN
    -- Sync from snake_case to camelCase
    BEGIN
        NEW."internshipId" = NEW.internship_id;
        NEW."resumeUrl" = NEW.resume_url;
        NEW."resumeFileName" = NEW.resume_file_name;
        NEW."linkedInProfile" = NEW.linkedin_profile;
        NEW."githubProfile" = NEW.github_profile;
        NEW."portfolioUrl" = NEW.portfolio_url;
        NEW."hearAboutUs" = NEW.hear_about_us;
        NEW."paymentStatus" = NEW.payment_status;
        NEW."paymentId" = NEW.payment_id;
        NEW."paymentAmount" = NEW.payment_amount;
        NEW."couponCode" = NEW.coupon_code;
        NEW."discountAmount" = NEW.discount_amount;
        NEW."originalAmount" = NEW.original_amount;
        NEW."appliedAt" = NEW.applied_at;
        NEW."updatedAt" = NEW.updated_at;
    EXCEPTION WHEN undefined_column THEN
        NULL;
    END;
    
    -- Sync from camelCase to snake_case
    BEGIN
        NEW.internship_id = NEW."internshipId";
        NEW.resume_url = NEW."resumeUrl";
        NEW.resume_file_name = NEW."resumeFileName";
        NEW.linkedin_profile = NEW."linkedInProfile";
        NEW.github_profile = NEW."githubProfile";
        NEW.portfolio_url = NEW."portfolioUrl";
        NEW.hear_about_us = NEW."hearAboutUs";
        NEW.payment_status = NEW."paymentStatus";
        NEW.payment_id = NEW."paymentId";
        NEW.payment_amount = NEW."paymentAmount";
        NEW.coupon_code = NEW."couponCode";
        NEW.discount_amount = NEW."discountAmount";
        NEW.original_amount = NEW."originalAmount";
        NEW.applied_at = NEW."appliedAt";
        NEW.updated_at = NEW."updatedAt";
    EXCEPTION WHEN undefined_column THEN
        NULL;
    END;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add sync trigger to applications table
DROP TRIGGER IF EXISTS sync_application_columns_trigger ON applications;
CREATE TRIGGER sync_application_columns_trigger
BEFORE INSERT OR UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION sync_application_columns();

-- Fix any constraint issues
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_internship_id_fkey;

-- Allow anonymous users to write to applications table
DO $$
DECLARE
  policy_exists boolean;
BEGIN
  -- Check if policy already exists before creating it
  SELECT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'applications' AND policyname = 'Allow anyone to create applications'
  ) INTO policy_exists;
  
  IF NOT policy_exists THEN
    -- Allow anyone to insert applications
    EXECUTE 'CREATE POLICY "Allow anyone to create applications" 
        ON applications FOR INSERT 
        WITH CHECK (true)';
  END IF;
END;
$$;

-- Enable RLS on applications table
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Make sure public is granted access to the applications table
GRANT ALL ON applications TO public; 