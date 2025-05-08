# InternHub Tools

This directory contains utility tools for managing the InternHub application.

## Import Application Backups

The `import-backups.js` script helps recover applications that were saved to a backup file when they couldn't be inserted into the database due to RLS policy violations.

### Usage

1. Make sure the Supabase SQL scripts have been run to fix RLS policies:
   ```sql
   -- Run in Supabase SQL Editor
   -- Contents of src/database/fix_rls.sql
   ```

2. Run the import script:
   ```bash
   # Using npm
   npm run import-backups
   
   # Or directly
   node import-backups.js
   ```

The script will:
1. Look for backup files at the project root (`application_backups.json`)
2. Try to import each application using multiple strategies:
   - First using the JSON RPC function
   - Then using the parameter-based RPC function
   - Finally using direct table insert
3. Report how many were imported successfully

### Troubleshooting

If you encounter issues:

1. Check if the `submit_application_bypass_rls` function exists in Supabase
2. Verify that the RLS policies are properly configured
3. Make sure your Supabase API key is valid

## Payment Testing

You can test payments using:
```
http://localhost:3002/test
```

## How to Fix Common Issues

If applications aren't saving in the database:

1. Run the SQL fix script in Supabase:
   ```
   src/database/fix_rls.sql
   ```

2. Restart the API server
   ```
   npx kill-port 3002
   node api-server.js
   ```

3. Run this import script to recover any backed-up applications
   ```
   node tools/import-backups.js
   ``` 