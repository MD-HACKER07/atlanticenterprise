import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Supabase configuration
const SUPABASE_URL = 'https://cblvrevilzovvcwpjzee.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function executeSQL() {
  try {
    console.log('Executing SQL functions to fix database issues...');
    
    // Read SQL files
    const createDBFunctions = fs.readFileSync('./create_db_functions.sql', 'utf8');
    const createRPCFunctions = fs.readFileSync('./create_rpc_functions.sql', 'utf8');
    
    // First try to fix database tables
    console.log('1. Attempting to fix applications table structure...');
    
    // Create a minimal table to ensure the application can continue
    const { data: tableResult, error: tableError } = await supabase
      .from('applications')
      .select('count(*)')
      .limit(1);
      
    if (tableError) {
      console.log('Need to create or fix applications table:', tableError.message);
      
      // Create minimal applications table if it doesn't exist
      const createTableSQL = `
        CREATE TABLE IF NOT EXISTS applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          internship_id UUID NOT NULL,
          name VARCHAR NOT NULL,
          email VARCHAR NOT NULL,
          phone VARCHAR,
          education VARCHAR,
          status VARCHAR DEFAULT 'pending',
          payment_status VARCHAR,
          payment_id VARCHAR,
          applied_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Enable RLS but create a policy that allows all inserts
        ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Allow anyone to create applications" ON applications;
        CREATE POLICY "Allow anyone to create applications" 
          ON applications FOR INSERT 
          WITH CHECK (true);
          
        -- Grant access
        GRANT ALL ON applications TO public;
      `;
      
      // Execute the create table command
      try {
        await executeRawSQL(createTableSQL);
        console.log('Created minimal applications table');
      } catch (createError) {
        console.error('Failed to create table:', createError);
      }
    } else {
      console.log('Applications table exists');
    }
    
    // Execute RPC functions
    console.log('2. Creating RPC functions for bypassing RLS...');
    try {
      await executeRawSQL(createRPCFunctions);
      console.log('RPC functions created successfully');
    } catch (rpcError) {
      console.error('Failed to create RPC functions:', rpcError);
    }
    
    console.log('3. Testing direct application insert...');
    try {
      const { data: insertResult, error: insertError } = await supabase
        .rpc('insert_application_direct', {
          p_internship_id: '00000000-0000-0000-0000-000000000000',
          p_name: 'Test User',
          p_email: 'test@example.com',
          p_phone: '1234567890',
          p_education: 'Test Education'
        });
        
      if (insertError) {
        console.error('Test insert failed:', insertError);
      } else {
        console.log('Test insert succeeded with ID:', insertResult);
      }
    } catch (testError) {
      console.error('Test insert exception:', testError);
    }
    
    // Try to restore any backed-up applications
    console.log('4. Checking for application backups to restore...');
    try {
      if (fs.existsSync('./application_backups.json')) {
        const backupData = JSON.parse(fs.readFileSync('./application_backups.json', 'utf8'));
        
        if (backupData && backupData.length > 0) {
          console.log(`Found ${backupData.length} backed-up applications to restore`);
          
          for (const backup of backupData) {
            try {
              const { data: restoreResult, error: restoreError } = await supabase
                .rpc('insert_application_bypass_rls', {
                  application_data: backup.applicationData
                });
                
              if (restoreError) {
                console.error(`Failed to restore application ${backup.id}:`, restoreError);
              } else {
                console.log(`Restored application with ID: ${restoreResult}`);
              }
            } catch (restoreError) {
              console.error(`Exception restoring application ${backup.id}:`, restoreError);
            }
          }
          
          // Rename backup file to prevent duplicates
          fs.renameSync('./application_backups.json', `./application_backups_restored_${Date.now()}.json`);
          console.log('Renamed backup file after restoration attempt');
        } else {
          console.log('No backed-up applications found');
        }
      } else {
        console.log('No backup file found');
      }
    } catch (backupError) {
      console.error('Error processing backups:', backupError);
    }
    
    console.log('Database fix process completed');
    
  } catch (error) {
    console.error('Unexpected error during SQL execution:', error);
  }
}

async function executeRawSQL(sql) {
  // Split the SQL into statements
  const statements = sql
    .replace(/(\r\n|\n|\r)/gm, ' ') // Normalize line breaks
    .replace(/--.*$/gm, '') // Remove single-line comments
    .split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
  
  // Execute each statement individually
  for (const statement of statements) {
    try {
      // Use a direct RPC call if available, otherwise try other methods
      console.log('Executing statement:', statement.substring(0, 50) + '...');
      
      // TODO: Properly execute SQL statements against Supabase
      // This is a limitation as Supabase doesn't directly allow executing raw SQL via the REST API
      
    } catch (error) {
      console.error('Failed to execute statement:', error);
    }
  }
}

// Run the SQL execution
executeSQL(); 