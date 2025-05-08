# Database Functions for InternHub

This directory contains SQL functions needed for the InternHub application to work properly.

## RPC Functions

### get_applications_for_admin()

This function retrieves all applications for admin users, bypassing Row Level Security policies.

#### Installation Instructions

1. Log in to your Supabase dashboard
2. Go to the SQL Editor section
3. Create a new query
4. Copy and paste the contents of `rpc_functions.sql` into the editor
5. Run the query

The function will be created and will be available to call from your application.

## Fixing Admin Dashboard Blank Page

If your admin dashboard shows a blank page or fails to load applications, make sure:

1. The `get_applications_for_admin()` function is properly installed in your Supabase project
2. Your user account has the `is_admin` flag set to true in the auth.users table
3. You're logged in with admin credentials

## Troubleshooting Row Level Security Issues

If you're getting "Row Level Security policy violation" errors:

1. Make sure the RPC function is installed
2. Check that your application is using the RPC function to fetch data instead of direct table access
3. Verify your user has admin privileges by running this query in SQL Editor:

```sql
SELECT is_admin FROM auth.users WHERE email = 'your-admin-email@example.com';
```

If it returns `false` or `null`, update it with:

```sql
UPDATE auth.users SET is_admin = true WHERE email = 'your-admin-email@example.com';
```

4. Ensure your application is using the correct Supabase API key (anon or service_role key) 