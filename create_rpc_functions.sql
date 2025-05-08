-- Create RPC function to insert application data bypassing RLS
CREATE OR REPLACE FUNCTION insert_application_bypass_rls(application_data JSONB)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Insert the application data
  INSERT INTO applications (
    internship_id,
    name,
    email,
    phone,
    education,
    college,
    city,
    skills,
    experience,
    message,
    resume_url,
    resume_file_name,
    linkedin_profile,
    github_profile,
    portfolio_url,
    hear_about_us,
    status,
    payment_status,
    payment_id,
    payment_amount,
    coupon_code,
    discount_amount,
    original_amount,
    applied_at
  ) VALUES (
    (application_data->>'internship_id')::UUID,
    application_data->>'name',
    application_data->>'email',
    application_data->>'phone',
    application_data->>'education',
    application_data->>'college',
    application_data->>'city',
    COALESCE((application_data->>'skills')::VARCHAR[], '{}'),
    application_data->>'experience',
    application_data->>'message',
    application_data->>'resume_url',
    application_data->>'resume_file_name',
    application_data->>'linkedin_profile',
    application_data->>'github_profile',
    application_data->>'portfolio_url',
    application_data->>'hear_about_us',
    COALESCE(application_data->>'status', 'pending'),
    application_data->>'payment_status',
    application_data->>'payment_id',
    NULLIF(application_data->>'payment_amount', '')::NUMERIC,
    application_data->>'coupon_code',
    NULLIF(application_data->>'discount_amount', '')::NUMERIC,
    NULLIF(application_data->>'original_amount', '')::NUMERIC,
    COALESCE(NULLIF(application_data->>'applied_at', '')::TIMESTAMPTZ, NOW())
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add permission for anonymous users to call this function
GRANT EXECUTE ON FUNCTION insert_application_bypass_rls TO PUBLIC;

-- Create an alternative simpler function that accepts all parameters separately
CREATE OR REPLACE FUNCTION insert_application_direct(
  p_internship_id UUID,
  p_name VARCHAR,
  p_email VARCHAR,
  p_phone VARCHAR,
  p_education VARCHAR,
  p_status VARCHAR DEFAULT 'pending'
) RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Insert the application data with minimal required fields
  INSERT INTO applications (
    internship_id,
    name,
    email,
    phone,
    education,
    status,
    applied_at
  ) VALUES (
    p_internship_id,
    p_name,
    p_email,
    p_phone,
    p_education,
    p_status,
    NOW()
  ) RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add permission for anonymous users to call this function
GRANT EXECUTE ON FUNCTION insert_application_direct TO PUBLIC;

-- Create RPC function to get applications for admin view
CREATE OR REPLACE FUNCTION get_applications_for_admin()
RETURNS SETOF applications AS $$
BEGIN
  RETURN QUERY SELECT * FROM applications ORDER BY applied_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add permission for anonymous users to call this function
GRANT EXECUTE ON FUNCTION get_applications_for_admin TO PUBLIC; 