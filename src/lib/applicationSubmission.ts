import { supabase } from './supabase';

/**
 * Submits an application to the database with fallback strategies
 * 
 * @param applicationData The application data to submit
 * @returns The ID of the submitted application
 */
export const submitApplicationToDatabase = async (applicationData: Record<string, any>): Promise<string> => {
  console.log('Submitting application data:', applicationData);
  
  try {
    // First attempt: Try with the full application data
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select('id')
      .single();
      
    if (!error) {
      console.log('Application submitted successfully on first attempt:', data);
      return data.id;
    }
    
    console.error('First attempt failed with error:', error);
    
    // Second attempt: Try with only snake_case field names
    const snakeCaseData = filterToSnakeCaseOnly(applicationData);
    console.log('Attempting with snake_case only:', snakeCaseData);
    
    const { data: secondData, error: secondError } = await supabase
      .from('applications')
      .insert([snakeCaseData])
      .select('id')
      .single();
      
    if (!secondError) {
      console.log('Application submitted successfully on second attempt (snake_case only):', secondData);
      return secondData.id;
    }
    
    console.error('Second attempt failed with error:', secondError);
    
    // Third attempt: Use the server API endpoint as fallback
    console.log('Attempting with API endpoint fallback');
    
    const apiResponse = await fetch('/api/submit-application', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(applicationData),
    });
    
    if (!apiResponse.ok) {
      const errorData = await apiResponse.json();
      throw new Error(`API submission failed: ${errorData.message || 'Unknown error'}`);
    }
    
    const apiResult = await apiResponse.json();
    
    if (apiResult.success && apiResult.applicationId) {
      console.log('Application submitted successfully using API fallback:', apiResult);
      return apiResult.applicationId;
    }
    
    // Fourth attempt: Try with essential fields only
    const essentialData = {
      internship_id: applicationData.internship_id,
      name: applicationData.name,
      email: applicationData.email,
      phone: applicationData.phone,
      education: applicationData.education,
      status: 'pending',
      payment_status: applicationData.payment_status,
      payment_id: applicationData.payment_id
    };
    
    console.log('Attempting with essential fields only:', essentialData);
    
    const { data: finalData, error: finalError } = await supabase
      .from('applications')
      .insert([essentialData])
      .select('id')
      .single();
      
    if (!finalError) {
      console.log('Application submitted successfully on final attempt (essential fields):', finalData);
      return finalData.id;
    }
    
    console.error('All attempts failed. Final error:', finalError);
    throw new Error(`Failed to submit application after multiple attempts: ${finalError.message}`);
    
  } catch (error) {
    console.error('Unexpected error during application submission:', error);
    throw error;
  }
};

/**
 * Filters an object to only include snake_case key names
 */
const filterToSnakeCaseOnly = (data: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => /^[a-z]+(_[a-z]+)*$/.test(key))
  );
};

/**
 * Filters an object to only include camelCase key names
 */
const filterToCamelCaseOnly = (data: Record<string, any>): Record<string, any> => {
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => /^[a-z]+([A-Z][a-z]*)*$/.test(key))
  );
}; 