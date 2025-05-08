-- RPC function to get all applications for admin users
-- This bypasses Row Level Security (RLS)
CREATE OR REPLACE FUNCTION get_applications_for_admin()
RETURNS SETOF applications
LANGUAGE plpgsql
SECURITY DEFINER -- Run with privileges of the function creator
AS $$
BEGIN
  -- Check if the user is an admin
  IF (SELECT is_admin FROM auth.users WHERE id = auth.uid()) THEN
    RETURN QUERY SELECT * FROM applications ORDER BY applied_at DESC;
  ELSE
    RAISE EXCEPTION 'Permission denied: Only admin users can access this function';
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_applications_for_admin() TO authenticated; 