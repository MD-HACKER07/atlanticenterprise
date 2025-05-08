-- Fix the coupons table schema by adding a createdAt column if it doesn't exist
DO $$ 
BEGIN
    -- Check if the createdAt column exists (snake_case)
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'created_at'
    ) THEN
        -- Add the created_at column
        ALTER TABLE coupons 
        ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Check if the column exists as createdAt (camelCase)
    -- Note: PostgreSQL converts identifiers to lowercase unless quoted
    -- so we need to check for the exact quoted column name
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'createdat'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = '"createdAt"'
    ) THEN
        -- Add the createdAt column
        BEGIN
            ALTER TABLE coupons 
            ADD COLUMN "createdAt" TIMESTAMPTZ DEFAULT NOW();
        EXCEPTION 
            WHEN duplicate_column OR invalid_column_definition THEN
                -- If it fails with duplicate column, it probably already exists with some casing variation
                RAISE NOTICE 'createdAt column appears to already exist with different casing, skipping';
        END;
    END IF;
    
    -- Check if currentUses column exists (snake_case)
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'current_uses'
    ) THEN
        -- Add the current_uses column
        ALTER TABLE coupons 
        ADD COLUMN current_uses INTEGER DEFAULT 0;
    END IF;
    
    -- Check if the column exists as currentUses (camelCase)
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = 'currentuses'
    ) AND NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'coupons' AND column_name = '"currentUses"'
    ) THEN
        -- Add the currentUses column
        BEGIN
            ALTER TABLE coupons 
            ADD COLUMN "currentUses" INTEGER DEFAULT 0;
        EXCEPTION 
            WHEN duplicate_column OR invalid_column_definition THEN
                -- If it fails with duplicate column, it probably already exists with some casing variation
                RAISE NOTICE 'currentUses column appears to already exist with different casing, skipping';
        END;
    END IF;
END $$;

-- Update any coupons without a creation date
UPDATE coupons
SET created_at = NOW()
WHERE created_at IS NULL;

BEGIN;
    -- Try updating createdAt if it exists
    DO $$
    BEGIN
        UPDATE coupons
        SET "createdAt" = NOW()
        WHERE "createdAt" IS NULL;
    EXCEPTION
        WHEN undefined_column THEN
            -- Do nothing if column doesn't exist
            RAISE NOTICE 'column "createdAt" does not exist, skipping update';
    END $$;
COMMIT;

-- Initialize current uses if null
UPDATE coupons
SET current_uses = 0
WHERE current_uses IS NULL;

BEGIN;
    -- Try updating currentUses if it exists
    DO $$
    BEGIN
        UPDATE coupons
        SET "currentUses" = 0
        WHERE "currentUses" IS NULL;
    EXCEPTION
        WHEN undefined_column THEN
            -- Do nothing if column doesn't exist
            RAISE NOTICE 'column "currentUses" does not exist, skipping update';
    END $$;
COMMIT;

-- Make sure other columns have proper constraints and defaults
BEGIN;
    DO $$
    BEGIN
        ALTER TABLE coupons
        ALTER COLUMN discount_percent SET DEFAULT 10,
        ALTER COLUMN max_uses SET DEFAULT 10,
        ALTER COLUMN current_uses SET DEFAULT 0,
        ALTER COLUMN active SET DEFAULT true;
    EXCEPTION
        WHEN undefined_column THEN
            -- Some columns might not exist, try individual alterations
            RAISE NOTICE 'Error setting defaults for multiple columns at once, trying individually';
    END $$;

    -- Try each alteration individually
    DO $$
    BEGIN
        ALTER TABLE coupons ALTER COLUMN discount_percent SET DEFAULT 10;
    EXCEPTION
        WHEN undefined_column THEN RAISE NOTICE 'column discount_percent does not exist';
    END $$;

    DO $$
    BEGIN
        ALTER TABLE coupons ALTER COLUMN max_uses SET DEFAULT 10;
    EXCEPTION
        WHEN undefined_column THEN RAISE NOTICE 'column max_uses does not exist';
    END $$;

    DO $$
    BEGIN
        ALTER TABLE coupons ALTER COLUMN current_uses SET DEFAULT 0;
    EXCEPTION
        WHEN undefined_column THEN RAISE NOTICE 'column current_uses does not exist';
    END $$;

    DO $$
    BEGIN
        ALTER TABLE coupons ALTER COLUMN active SET DEFAULT true;
    EXCEPTION
        WHEN undefined_column THEN RAISE NOTICE 'column active does not exist';
    END $$;
COMMIT;

-- Try to alter the camelCase column if it exists
BEGIN;
    DO $$ 
    BEGIN
        ALTER TABLE coupons
        ALTER COLUMN "currentUses" SET DEFAULT 0;
    EXCEPTION
        WHEN undefined_column THEN
            -- Do nothing if column doesn't exist
            RAISE NOTICE 'column "currentUses" does not exist, skipping default setting';
    END $$;
COMMIT;

-- Make sure expiry_date has a default of 30 days from now
BEGIN;
    DO $$
    BEGIN
        ALTER TABLE coupons
        ALTER COLUMN expiry_date SET DEFAULT (NOW() + INTERVAL '30 days');
    EXCEPTION
        WHEN undefined_column THEN
            RAISE NOTICE 'column expiry_date does not exist, skipping default setting';
    END $$;
COMMIT;

-- Create function to increment coupon usage when applied
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.coupon_code IS NOT NULL THEN
    BEGIN
        -- Try with snake_case first
        UPDATE coupons
        SET current_uses = current_uses + 1
        WHERE code = NEW.coupon_code;
    EXCEPTION WHEN undefined_column THEN
        BEGIN
            -- If that fails, try with camelCase
            UPDATE coupons
            SET "currentUses" = "currentUses" + 1
            WHERE code = NEW.coupon_code;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to update coupon usage count: %', SQLERRM;
        END;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Check if applications table exists before creating trigger
DO $$ 
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'applications'
    ) THEN
        -- Add trigger to update coupon usage when an application with a coupon is created
        DROP TRIGGER IF EXISTS update_coupon_usage_trigger ON applications;
        CREATE TRIGGER update_coupon_usage_trigger
        AFTER INSERT ON applications
        FOR EACH ROW
        WHEN (NEW.coupon_code IS NOT NULL)
        EXECUTE FUNCTION increment_coupon_usage();
    ELSE
        RAISE NOTICE 'Table applications does not exist, skipping trigger creation';
    END IF;
END $$;

-- Create a stored procedure to increment coupon usage by code
CREATE OR REPLACE FUNCTION increment_coupon_usage_by_code(coupon_code TEXT)
RETURNS VOID AS $$
BEGIN
    BEGIN
        -- Try with snake_case first
        UPDATE coupons
        SET current_uses = current_uses + 1
        WHERE code = coupon_code;
    EXCEPTION WHEN undefined_column THEN
        BEGIN
            -- If that fails, try with camelCase
            UPDATE coupons
            SET "currentUses" = "currentUses" + 1
            WHERE code = coupon_code;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Failed to increment coupon usage: %', SQLERRM;
        END;
    END;
END;
$$ LANGUAGE plpgsql;

-- Create a generic counter increment function
CREATE OR REPLACE FUNCTION increment_counter(row_count INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN row_count + 1;
END;
$$ LANGUAGE plpgsql; 