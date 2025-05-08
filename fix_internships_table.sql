-- Fix the stipend column to accept string values
ALTER TABLE internships 
ALTER COLUMN stipend TYPE VARCHAR;

-- Add a default value for any null application_deadline values
UPDATE internships 
SET application_deadline = CURRENT_DATE + INTERVAL '30 days'
WHERE application_deadline IS NULL;

-- Add not-null constraint with appropriate default value
ALTER TABLE internships 
ALTER COLUMN application_deadline SET NOT NULL,
ALTER COLUMN application_deadline SET DEFAULT CURRENT_DATE + INTERVAL '30 days';

-- Make sure start_date is also properly set
ALTER TABLE internships 
ALTER COLUMN start_date SET DEFAULT CURRENT_DATE + INTERVAL '60 days';

-- Set any null stipend values to '0'
UPDATE internships
SET stipend = '0'
WHERE stipend IS NULL; 