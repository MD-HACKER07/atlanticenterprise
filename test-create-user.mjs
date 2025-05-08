// Test script for creating a user in Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase connection details from environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const dbPassword = process.env.DB_PASSWORD;

// Create a Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-db-password': dbPassword
    }
  }
});

// Test email and password for the new user
const testEmail = `test-user-${Date.now()}@example.com`;
const testPassword = 'password123';

async function createTestUser() {
  try {
    console.log(`Attempting to create test user: ${testEmail}`);
    
    // Use the admin API to create a user
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: testPassword,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        name: 'Test User',
        source: 'api test'
      }
    });
    
    if (error) {
      console.error('Error creating user:');
      console.error(error);
      return false;
    }
    
    console.log('User created successfully!');
    console.log('User data:', data);
    
    // Check if the profile was also created
    console.log('\nChecking if profile was created:');
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testEmail);
      
    if (profileError) {
      console.error('Error fetching profile:');
      console.error(profileError);
      return false;
    }
    
    if (profileData && profileData.length > 0) {
      console.log('Profile created successfully!');
      console.log('Profile data:', profileData[0]);
      return true;
    } else {
      console.error('Profile not created for the user.');
      return false;
    }
  } catch (err) {
    console.error('Exception during user creation test:');
    console.error(err);
    return false;
  }
}

// Run the test
createTestUser().then(success => {
  console.log(`\nTest ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}); 