-- Create required tables if they don't exist

-- Create coupons table if it doesn't exist
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR NOT NULL UNIQUE,
    discount_percent INTEGER NOT NULL DEFAULT 10,
    max_uses INTEGER NOT NULL DEFAULT 10,
    current_uses INTEGER NOT NULL DEFAULT 0,
    expiry_date TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    active BOOLEAN NOT NULL DEFAULT true,
    internship_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create applications table if it doesn't exist
CREATE TABLE IF NOT EXISTS applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    internship_id UUID NOT NULL,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone VARCHAR NOT NULL,
    education VARCHAR NOT NULL,
    college VARCHAR,
    city VARCHAR,
    message TEXT,
    skills VARCHAR[] DEFAULT '{}',
    resume_url VARCHAR,
    resume_file_name VARCHAR,
    linkedin_profile VARCHAR,
    github_profile VARCHAR,
    portfolio_url VARCHAR,
    hear_about_us VARCHAR,
    status VARCHAR NOT NULL DEFAULT 'pending',
    payment_status VARCHAR,
    payment_id VARCHAR,
    payment_amount NUMERIC,
    coupon_code VARCHAR,
    discount_amount NUMERIC,
    original_amount NUMERIC,
    applied_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add camelCase columns for compatibility
DO $$ 
BEGIN
    -- Add camelCase columns to coupons if not exists
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'createdat'
    ) THEN
        ALTER TABLE coupons ADD COLUMN "createdAt" TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'currentuses'
    ) THEN
        ALTER TABLE coupons ADD COLUMN "currentUses" INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'maxuses'
    ) THEN
        ALTER TABLE coupons ADD COLUMN "maxUses" INTEGER DEFAULT 10;
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'expirydate'
    ) THEN
        ALTER TABLE coupons ADD COLUMN "expiryDate" TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days');
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'internshipid'
    ) THEN
        ALTER TABLE coupons ADD COLUMN "internshipId" UUID;
    END IF;
    
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'discountpercent'
    ) THEN
        ALTER TABLE coupons ADD COLUMN "discountPercent" INTEGER DEFAULT 10;
    END IF;
EXCEPTION
    WHEN duplicate_column THEN
        RAISE NOTICE 'Column already exists, skipping';
END $$;

-- Create synchronization triggers to keep snake_case and camelCase columns in sync
CREATE OR REPLACE FUNCTION sync_coupon_columns()
RETURNS TRIGGER AS $$
DECLARE
    column_exists BOOLEAN;
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Sync from snake_case to camelCase if columns exist
        BEGIN
            IF NEW.discount_percent IS NOT NULL THEN
                NEW."discountPercent" = NEW.discount_percent;
            END IF;
            
            IF NEW.max_uses IS NOT NULL THEN
                NEW."maxUses" = NEW.max_uses;
            END IF;
            
            IF NEW.current_uses IS NOT NULL THEN
                NEW."currentUses" = NEW.current_uses;
            END IF;
            
            IF NEW.expiry_date IS NOT NULL THEN
                NEW."expiryDate" = NEW.expiry_date;
            END IF;
            
            IF NEW.internship_id IS NOT NULL THEN
                NEW."internshipId" = NEW.internship_id;
            END IF;
            
            IF NEW.created_at IS NOT NULL THEN
                NEW."createdAt" = NEW.created_at;
            END IF;
        EXCEPTION WHEN undefined_column THEN
            -- Ignore if any of the camelCase columns don't exist
            NULL;
        END;
        
        -- Sync from camelCase to snake_case if columns exist
        BEGIN
            IF NEW."discountPercent" IS NOT NULL THEN
                NEW.discount_percent = NEW."discountPercent";
            END IF;
            
            IF NEW."maxUses" IS NOT NULL THEN
                NEW.max_uses = NEW."maxUses";
            END IF;
            
            IF NEW."currentUses" IS NOT NULL THEN
                NEW.current_uses = NEW."currentUses";
            END IF;
            
            IF NEW."expiryDate" IS NOT NULL THEN
                NEW.expiry_date = NEW."expiryDate";
            END IF;
            
            IF NEW."internshipId" IS NOT NULL THEN
                NEW.internship_id = NEW."internshipId";
            END IF;
            
            IF NEW."createdAt" IS NOT NULL THEN
                NEW.created_at = NEW."createdAt";
            END IF;
        EXCEPTION WHEN undefined_column THEN
            -- Ignore if any of the snake_case columns don't exist
            NULL;
        END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add sync trigger to coupons table
DROP TRIGGER IF EXISTS sync_coupon_columns_trigger ON coupons;
CREATE TRIGGER sync_coupon_columns_trigger
BEFORE INSERT OR UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION sync_coupon_columns();

-- Create RPC function to increment coupon usage by code
CREATE OR REPLACE FUNCTION increment_coupon_usage_by_code(coupon_code TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE coupons 
    SET 
        current_uses = COALESCE(current_uses, 0) + 1,
        "currentUses" = COALESCE("currentUses", 0) + 1
    WHERE 
        code = UPPER(coupon_code);
END;
$$ LANGUAGE plpgsql; 