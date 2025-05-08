-- Create certificate_verifications table for storing certificate information
CREATE TABLE IF NOT EXISTS certificate_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_id VARCHAR NOT NULL UNIQUE,
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    student_name VARCHAR NOT NULL,
    college VARCHAR NOT NULL,
    internship_title VARCHAR NOT NULL,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    duration VARCHAR NOT NULL,
    issued_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_valid BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create index on certificate_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_certificate_verifications_certificate_id ON certificate_verifications(certificate_id);

-- Create index on application_id
CREATE INDEX IF NOT EXISTS idx_certificate_verifications_application_id ON certificate_verifications(application_id);

-- Create index on student_name for name-based searches
CREATE INDEX IF NOT EXISTS idx_certificate_verifications_student_name ON certificate_verifications(student_name);

-- Enable Row Level Security
ALTER TABLE certificate_verifications ENABLE ROW LEVEL SECURITY;

-- Policy for everyone to view certificate verifications (for verification page)
CREATE POLICY certificate_verifications_select_policy ON certificate_verifications
  FOR SELECT
  USING (true);

-- Policy for authenticated users (admins) to insert certificate verifications
CREATE POLICY certificate_verifications_insert_policy ON certificate_verifications
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Policy for authenticated users (admins) to update certificate verifications
CREATE POLICY certificate_verifications_update_policy ON certificate_verifications
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_certificate_verifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column
CREATE TRIGGER certificate_verifications_updated_at_trigger
BEFORE UPDATE ON certificate_verifications
FOR EACH ROW
EXECUTE FUNCTION update_certificate_verifications_updated_at();

-- Documentation
COMMENT ON TABLE certificate_verifications IS 'Stores information about issued certificates for verification purposes';
COMMENT ON COLUMN certificate_verifications.certificate_id IS 'Unique certificate ID used for verification';
COMMENT ON COLUMN certificate_verifications.application_id IS 'Reference to the internship application';
COMMENT ON COLUMN certificate_verifications.student_name IS 'Name of the student who received the certificate';
COMMENT ON COLUMN certificate_verifications.college IS 'College/University of the student';
COMMENT ON COLUMN certificate_verifications.internship_title IS 'Title of the internship completed';
COMMENT ON COLUMN certificate_verifications.start_date IS 'Start date of the internship';
COMMENT ON COLUMN certificate_verifications.end_date IS 'End date of the internship';
COMMENT ON COLUMN certificate_verifications.duration IS 'Duration of the internship (e.g., "30 Days", "3 Months")';
COMMENT ON COLUMN certificate_verifications.issued_date IS 'Date when the certificate was issued';
COMMENT ON COLUMN certificate_verifications.is_valid IS 'Flag indicating if the certificate is valid'; 