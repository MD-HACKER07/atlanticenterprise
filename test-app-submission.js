import fetch from 'node-fetch';

// Test function to verify application submission
async function testApplicationSubmission() {
  try {
    console.log('Testing application submission...');
    
    // Create test data
    const testData = {
      internship_id: '00000000-0000-0000-0000-000000000000',
      name: 'Test Applicant',
      email: 'test@example.com',
      phone: '1234567890',
      education: 'Bachelor\'s',
      college: 'Test University',
      city: 'Test City',
      skills: ['JavaScript', 'React'],
      message: 'Test cover letter',
      status: 'pending',
      payment_status: 'paid',
      payment_id: 'test_payment_123',
      payment_amount: 500,
      original_amount: 500
    };
    
    // Submit application through API
    console.log('Submitting test application...');
    const response = await fetch('http://localhost:3002/api/submit-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ SUCCESS: Application submitted successfully');
      console.log(`Application ID: ${result.applicationId}`);
    } else {
      console.log('❌ ERROR: Application submission failed');
      console.log(`Error: ${result.message}`);
      if (result.error) console.log(`Details: ${result.error}`);
    }
    
  } catch (error) {
    console.error('❌ TEST FAILED with exception:', error);
  }
}

// Run the test
testApplicationSubmission(); 