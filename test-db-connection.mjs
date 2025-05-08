// Simple script to test database connection with password
import { createClient } from '@supabase/supabase-js';

// Supabase connection details
const supabaseUrl = 'https://cblvrevilzovvcwpjzee.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjEzMzA5OSwiZXhwIjoyMDYxNzA5MDk5fQ.PF8-u_f-Oy9BcpzWhWm3-ds2qYApBq6wUJXgojmoMRs';
const password = 'Mdabu321@';

// Create client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-db-password': password
    }
  }
});

async function testConnection() {
  try {
    console.log('Testing connection with password:', password);
    
    // Try to fetch system settings
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .limit(1);
      
    if (error) {
      console.error('Error:');
      console.error(error);
      return;
    }
    
    console.log('Connection successful!');
    console.log('Data:', data);
  } catch (err) {
    console.error('Exception:');
    console.error(err);
  }
}

testConnection(); 