-- Create settings table for application configuration
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default promotion settings
INSERT INTO settings (key, value) 
VALUES (
    'promotion', 
    '{
        "enabled": true,
        "message": "HURRY UP! Limited-time offer available.",
        "deadline": "2023-12-31T23:59:59.999Z",
        "ctaText": "Apply Now",
        "ctaLink": "/internships"
    }'
) ON CONFLICT (key) DO NOTHING;

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to call the function
CREATE TRIGGER update_settings_updated_at
BEFORE UPDATE ON settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create index on settings key for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Documentation of the settings table structure
COMMENT ON TABLE settings IS 'Stores application-wide configuration settings';
COMMENT ON COLUMN settings.key IS 'Unique identifier for the setting (e.g., "promotion")';
COMMENT ON COLUMN settings.value IS 'JSON value containing the setting configuration';
COMMENT ON COLUMN settings.created_at IS 'Timestamp when the setting was first created';
COMMENT ON COLUMN settings.updated_at IS 'Timestamp when the setting was last updated'; 