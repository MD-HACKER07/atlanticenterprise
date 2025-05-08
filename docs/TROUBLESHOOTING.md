# InternHub Troubleshooting Guide

## Common Issues and Solutions

### 1. "Failed to initialize payment. Please try again"

This error occurs when the Razorpay payment gateway fails to create an order.

#### Solution

1. Check the server logs for specific errors.

2. Make sure the Razorpay API keys are correct in `api-server.js`:
   ```javascript
   // Initialize Razorpay
   const razorpay = new Razorpay({
     key_id: 'rzp_test_rg235BX8eobmVD',  // Verify this key
     key_secret: 'ymVrxQJNwAFG7p8ubXeGN0Fy'  // Verify this key
   });
   ```

3. Try with smaller payment amounts for testing (e.g., ₹1-100).

4. Check if the API server is running:
   ```bash
   # Windows
   .\restart-api.bat
   
   # Or directly
   node api-server.js
   ```

5. Verify the payment integration on the test page:
   ```
   http://localhost:3002/test
   ```

### 2. Applications Not Saving in Database

If users see "Application Submitted Successfully" but the applications aren't appearing in the admin dashboard or database, this is likely due to Row Level Security (RLS) policy violations.

#### Quick Fix

1. Run the comprehensive RLS fix script in Supabase SQL Editor:
   ```sql
   -- Run the contents of src/database/fix_rls.sql
   ```

2. Restart the API server:
   ```bash
   # Windows
   .\restart-api.bat
   ```

3. Import any backed-up applications:
   ```bash
   cd tools
   node import-backups.js
   ```

### 3. "null value violates not-null constraint" for Skills Column

If you see an error like:
```
ERROR: 23502: null value in column "skills" of relation "applications" violates not-null constraint
```

#### Solution

1. Make sure your `fix_rls.sql` uses a default empty array for the skills field:
   ```sql
   p_skills TEXT[] DEFAULT '{}',
   
   -- And uses COALESCE
   COALESCE(p_skills, '{}')
   ```

2. For the API, ensure skills is always an array:
   ```javascript
   skills: Array.isArray(applicationData.skills) ? applicationData.skills : []
   ```

### 4. "Row Level Security Policy Violation" Errors

This error occurs when inserting data into tables with RLS enabled but the policies are too restrictive.

#### Solution

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Run the contents of `src/database/fix_rls.sql`
4. Restart the API server

### 5. Setting Up Admin Privileges

To make a user an admin:

```sql
-- Run in Supabase SQL Editor (replace with actual email)
UPDATE auth.users SET is_admin = true WHERE email = 'your-admin-email@example.com';
```

### 6. Complete Reset of RLS Policies

If you're still having issues with RLS policies, perform a complete reset:

```sql
-- Drop all policies
DROP POLICY IF EXISTS "Allow authenticated users to read applications" ON applications;
DROP POLICY IF EXISTS "Allow anyone to insert applications" ON applications;
DROP POLICY IF EXISTS "Allow only admins to update applications" ON applications;
DROP POLICY IF EXISTS "Allow only admins to delete applications" ON applications;
DROP POLICY IF EXISTS "Allow update applications" ON applications;
DROP POLICY IF EXISTS "Allow delete applications" ON applications;
DROP POLICY IF EXISTS "Anyone can read applications" ON applications;
DROP POLICY IF EXISTS "Anyone can insert applications" ON applications;
DROP POLICY IF EXISTS "Anyone can update applications" ON applications;
DROP POLICY IF EXISTS "Anyone can delete applications" ON applications;
DROP POLICY IF EXISTS "public_insert_policy" ON applications;
DROP POLICY IF EXISTS "public_select_policy" ON applications;
DROP POLICY IF EXISTS "public_update_policy" ON applications;
DROP POLICY IF EXISTS "public_delete_policy" ON applications;

-- Create simple, permissive policy
CREATE POLICY "Allow everything" ON applications
FOR ALL
TO public
USING (true)
WITH CHECK (true);
```

### 7. Testing Your Connection

To test if your connection to Supabase is working properly:

```
http://localhost:3002/api/test-db
```

## Preventive Measures

To prevent these issues in the future:

1. Always use the RPC functions for database operations 
2. Regularly check and update RLS policies
3. Monitor the application_backups.json file for failed submissions
4. Test with small payment amounts before live transactions

## Need Further Help?

If you continue experiencing issues:

1. Check the server logs for specific error messages
2. Verify all SQL functions were created properly in Supabase
3. Make sure the API server is running at http://localhost:3002
4. Test the Razorpay integration at http://localhost:3002/test 