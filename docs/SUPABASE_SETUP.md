# Supabase Configuration for InternHub

This document provides information about the Supabase setup for the InternHub application.

## Connection Details

The application is connected to a Supabase project with the following credentials:

- **Supabase URL**: `https://cblvrevilzovvcwpjzee.supabase.co`
- **Anon Public Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI`
- **Service Role Secret**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEzMzA5OSwiZXhwIjoyMDYxNzA5MDk5fQ.PF8-u_f-Oy9BcpzWhWm3-ds2qYApBq6wUJXgojmoMRs`
- **JWT Secret**: `77SDdJ9QlFQFG8bViyJKmcqEy8y/vVYmQIsmmETnHu/j0A6A0DvuPcp5WUb8qao59ylkr5AweI4SwSRvDZw4JQ==`

⚠️ **IMPORTANT**: These credentials should be kept secure and not be exposed in client-side code or public repositories. The credentials in this file are for documentation purposes only.

## Environment Variables

For proper configuration, create a `.env` file in the root of the project with the following variables:

```
# Supabase Configuration
VITE_SUPABASE_URL=https://cblvrevilzovvcwpjzee.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI

# Service Role Key - IMPORTANT: This should never be exposed to the client
# This should only be used in secure server environments
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEzMzA5OSwiZXhwIjoyMDYxNzA5MDk5fQ.PF8-u_f-Oy9BcpzWhWm3-ds2qYApBq6wUJXgojmoMRs

# JWT Secret
JWT_SECRET=77SDdJ9QlFQFG8bViyJKmcqEy8y/vVYmQIsmmETnHu/j0A6A0DvuPcp5WUb8qao59ylkr5AweI4SwSRvDZw4JQ==
```

## Database Schema

The database schema follows the structure defined in the `supabase_schema.sql` file, which includes tables for:

- Internships
- Applications
- User profiles
- Coupons
- System settings

## Authentication

The project uses Supabase Authentication with Row Level Security (RLS) policies to control access to data. The admin access code required to access the admin portal is `AT420`.

## Security Considerations

1. The anon key is safe to use in client-side code as it only allows access according to RLS policies.
2. The service role key bypasses RLS policies and should ONLY be used in secure server environments.
3. JWT verification should be performed server-side only.

## Project Structure

- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/jwt.ts` - JWT utilities for token handling
- `src/utils/auth.ts` - Authentication utilities 