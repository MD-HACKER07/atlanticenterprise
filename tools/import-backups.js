import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createClient } from '@supabase/supabase-js';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to backup file
const BACKUP_FILE_PATH = path.join(__dirname, '..', 'application_backups.json');

// Supabase configuration
const SUPABASE_URL = 'https://cblvrevilzovvcwpjzee.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI';

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function importBackups() {
  console.log('Starting import of backed-up applications...');
  
  // Check if backup file exists
  if (!fs.existsSync(BACKUP_FILE_PATH)) {
    console.error(`Backup file not found at ${BACKUP_FILE_PATH}`);
    return;
  }
  
  try {
    // Read backup file
    const fileContent = fs.readFileSync(BACKUP_FILE_PATH, 'utf8');
    const backupData = JSON.parse(fileContent);
    
    if (!Array.isArray(backupData) || backupData.length === 0) {
      console.log('No applications found in backup file.');
      return;
    }
    
    console.log(`Found ${backupData.length} applications in backup file.`);
    
    // Import each application
    let successCount = 0;
    let failCount = 0;
    
    for (const backup of backupData) {
      try {
        const appData = backup.applicationData;
        console.log(`Importing application ${backup.id} from ${appData.name} (${appData.email})`);
        
        // Ensure skills field is an array
        if (!Array.isArray(appData.skills)) {
          appData.skills = appData.skills || [];
        }
        
        // Try using the new RPC function that takes a JSON object
        const { data, error } = await supabase.rpc('insert_application_bypass_rls', {
          application_data: appData
        });
        
        if (error) {
          console.error(`Failed to import via JSON RPC: ${error.message}`);
          
          // Try the parameter-based RPC function as fallback
          const { data: rpcData, error: rpcError } = await supabase.rpc('submit_application_bypass_rls', {
            p_internship_id: appData.internship_id,
            p_name: appData.name,
            p_email: appData.email,
            p_phone: appData.phone,
            p_education: appData.education,
            p_college: appData.college || null,
            p_city: appData.city || null,
            p_skills: Array.isArray(appData.skills) ? appData.skills : [],
            p_experience: appData.experience || null,
            p_message: appData.message || null,
            p_resume_url: appData.resume_url || null,
            p_resume_file_name: appData.resume_file_name || null,
            p_linkedin_profile: appData.linkedin_profile || null,
            p_github_profile: appData.github_profile || null,
            p_portfolio_url: appData.portfolio_url || null,
            p_hear_about_us: appData.hear_about_us || null,
            p_status: appData.status || 'pending',
            p_payment_status: appData.payment_status || 'unpaid',
            p_payment_id: appData.payment_id || null,
            p_payment_amount: appData.payment_amount || null,
            p_coupon_code: appData.coupon_code || null,
            p_discount_amount: appData.discount_amount || 0,
            p_original_amount: appData.original_amount || null
          });
          
          if (rpcError) {
            console.error(`Failed to import via parameter RPC: ${rpcError.message}`);
            
            // Last resort: direct table insert
            const { data: insertData, error: insertError } = await supabase
              .from('applications')
              .insert([{
                ...appData,
                skills: Array.isArray(appData.skills) ? appData.skills : [],
                applied_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              }]);
            
            if (insertError) {
              console.error(`Failed to import via direct insert: ${insertError.message}`);
              failCount++;
            } else {
              console.log(`Successfully imported via direct insert`);
              successCount++;
            }
          } else {
            console.log(`Successfully imported via parameter RPC`);
            successCount++;
          }
        } else {
          console.log(`Successfully imported via JSON RPC`);
          successCount++;
        }
      } catch (err) {
        console.error(`Error processing backup ${backup.id}:`, err);
        failCount++;
      }
    }
    
    console.log('\nImport Summary:');
    console.log(`Total applications: ${backupData.length}`);
    console.log(`Successfully imported: ${successCount}`);
    console.log(`Failed to import: ${failCount}`);
    
    // Rename the backup file if all imports were successful
    if (successCount === backupData.length) {
      const newPath = `${BACKUP_FILE_PATH}.imported.${Date.now()}.json`;
      fs.renameSync(BACKUP_FILE_PATH, newPath);
      console.log(`All applications imported successfully! Backup file renamed to ${path.basename(newPath)}`);
    } else if (successCount > 0) {
      // Create a new backup file with only the failed imports
      const failedBackups = backupData.filter((_, index) => index >= successCount);
      fs.writeFileSync(`${BACKUP_FILE_PATH}.remaining.json`, JSON.stringify(failedBackups, null, 2));
      console.log(`Remaining failed applications saved to ${path.basename(BACKUP_FILE_PATH)}.remaining.json`);
    }
  } catch (error) {
    console.error('Error reading or processing backup file:', error);
  }
}

// Run the import function
importBackups().catch(console.error); 