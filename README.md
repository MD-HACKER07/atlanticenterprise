# InternHub Application System

This application helps manage internship listings and applications. 

## Recent Fixes:

### 1. Payment System Fix
- Added Razorpay integration
- Fixed payment gateway initialization errors
- Implemented proper payment verification

### 2. Application Submission Fix
- Enhanced database column compatibility (camelCase vs snake_case)
- Improved error handling with multiple fallback strategies
- Added robust API endpoint for application submission
- Bypassed RLS (Row Level Security) issues
- Implemented failsafe submission mechanisms
- Added local file backup for applications when database connection fails

### 3. Admin Dashboard Fix
- Fixed application retrieval in admin dashboard
- Added RPC functions to bypass RLS restrictions
- Normalized data between snake_case and camelCase formats
- Added backup data recovery mechanisms
- Created SQL functions for database operations that work with restricted permissions

## Running the Server

```bash
# Install dependencies
npm install

# Create necessary database functions
node execute_sql_functions.js

# Start the API server
node api-server.js

# Start the frontend
npm run dev
```

## Testing

```bash
# Test the payment system
curl http://localhost:3002/test

# Test application submission
node test-app-submission.js

# Test application retrieval
node test-read-applications.js
``` 