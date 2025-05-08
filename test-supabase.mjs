import { createClient } from '@supabase/supabase-js';

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Supabase connection details
  const supabaseUrl = 'https://cblvrevilzovvcwpjzee.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI';
  const dbPassword = 'Mdabu321@';
  
  // Create client with database password
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      headers: {
        'x-database-password': dbPassword,
      },
    },
  });
  
  try {
    console.log('Testing connectivity to system_settings table...');
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Database connection failed:');
      console.error(error);
      return false;
    }
    
    console.log('Connection successful!');
    console.log('Data:', data);
    return true;
  } catch (err) {
    console.error('Connection test failed with exception:');
    console.error(err);
    return false;
  }
}

// Run the test
testSupabaseConnection().then(success => {
  console.log(`Test ${success ? 'PASSED' : 'FAILED'}`);
  process.exit(success ? 0 : 1);
}); 