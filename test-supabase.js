const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testSupabaseConnection() {
  console.log('Testing Supabase connection...');
  
  // Supabase connection details from environment variables
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
  
  // Create client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
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
testSupabaseConnection(); 