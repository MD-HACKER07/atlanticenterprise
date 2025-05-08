import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Supabase configuration from environment variables
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY;

async function createBucket() {
  try {
    console.log('Checking existing buckets...');
    
    // First check if bucket exists
    const listResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });
    
    if (!listResponse.ok) {
      console.error('Failed to list buckets:', await listResponse.text());
      return;
    }
    
    const buckets = await listResponse.json();
    console.log('Existing buckets:', buckets.map(b => b.name).join(', '));
    
    const resumesBucketExists = buckets.some(bucket => bucket.name === 'resumes');
    
    if (resumesBucketExists) {
      console.log('Resumes bucket already exists!');
      return;
    }
    
    console.log('Creating resumes bucket...');
    
    // Create the bucket
    const createResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        name: 'resumes',
        public: true,
        file_size_limit: 5242880 // 5MB in bytes
      })
    });
    
    if (!createResponse.ok) {
      console.error('Failed to create bucket:', await createResponse.text());
      return;
    }
    
    console.log('Resumes bucket created successfully!');
    
    // Create public policy for the bucket
    console.log('Setting up public access policy...');
    
    const policyResponse = await fetch(`${SUPABASE_URL}/storage/v1/bucket/resumes/policy`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`
      },
      body: JSON.stringify({
        name: 'public-access',
        definition: {
          object_owner: 'authenticated',
          action: '*'
        }
      })
    });
    
    if (!policyResponse.ok) {
      console.error('Failed to set bucket policy:', await policyResponse.text());
      return;
    }
    
    console.log('Bucket policy set successfully!');
    
  } catch (error) {
    console.error('Error creating bucket:', error);
  }
}

createBucket().catch(console.error); 