import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkApplications() {
  try {
    console.log('Checking applications in the database...');
    
    // Try to fetch applications
    console.log('Fetching applications...');
    
    // 1. Try direct fetch
    const { data: apps, error: appsError } = await supabase
      .from('applications')
      .select('*')
      .limit(10);
      
    if (appsError) {
      console.error('Failed to fetch applications:', appsError);
    } else {
      console.log(`Found ${apps.length} applications:`);
      apps.forEach((app, index) => {
        console.log(`${index + 1}. ${app.name} (${app.email}) - Status: ${app.status}`);
      });
    }
    
    // 2. Try using a special view if direct access is restricted
    const { data: appsView, error: viewError } = await supabase
      .rpc('get_applications_for_admin');
      
    if (viewError) {
      console.log('View function not available:', viewError.message);
    } else if (appsView && appsView.length > 0) {
      console.log(`Found ${appsView.length} applications via view function:`);
      appsView.forEach((app, index) => {
        console.log(`${index + 1}. ${app.name} (${app.email}) - Status: ${app.status}`);
      });
    }
  } catch (error) {
    console.error('Error checking applications:', error);
  }
}

// Run the test
checkApplications(); 