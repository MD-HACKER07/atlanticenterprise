import { supabase } from '../lib/supabase';
import { InternshipApplication } from '../types';

interface CertificateVerification {
  id: string;
  certificate_id: string;
  application_id: string;
  student_name: string;
  college: string;
  internship_title: string;
  start_date: string;
  end_date: string;
  duration: string;
  issued_date: string;
  is_valid: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Generates a unique certificate ID in format AE-XXXX-YYYY where 
 * XXXX is a random number and YYYY is the current year
 */
export const generateCertificateId = (): string => {
  const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number between 1000-9999
  const year = new Date().getFullYear();
  return `AE-${randomNum}-${year}`;
};

/**
 * Stores certificate information in the database for verification
 */
export const storeCertificateVerification = async (
  application: InternshipApplication,
  internshipTitle: string,
  startDate: string,
  duration: string
): Promise<string | null> => {
  try {
    // Calculate end date based on start date and duration
    const startDateObj = new Date(startDate);
    const durationNumber = parseInt(duration.split(' ')[0]);
    const durationUnit = duration.split(' ')[1].toLowerCase();
    
    let endDateObj = new Date(startDateObj);
    if (durationUnit.includes('day')) {
      endDateObj.setDate(endDateObj.getDate() + durationNumber);
    } else if (durationUnit.includes('month')) {
      endDateObj.setMonth(endDateObj.getMonth() + durationNumber);
    }
    
    // Generate a unique certificate ID
    const certificateId = generateCertificateId();
    
    // Insert the certificate verification record
    const { data, error } = await supabase
      .from('certificate_verifications')
      .insert({
        certificate_id: certificateId,
        application_id: application.id,
        student_name: application.name,
        college: application.college || 'Not specified',
        internship_title: internshipTitle,
        start_date: startDateObj.toISOString(),
        end_date: endDateObj.toISOString(),
        duration,
        is_valid: true
      })
      .single();
    
    if (error) {
      console.error('Error storing certificate verification:', error);
      return null;
    }
    
    return certificateId;
  } catch (error) {
    console.error('Error in storeCertificateVerification:', error);
    return null;
  }
};

/**
 * Verify a certificate by its ID
 */
export const verifyCertificate = async (certificateId: string): Promise<CertificateVerification | null> => {
  try {
    const { data, error } = await supabase
      .from('certificate_verifications')
      .select('*')
      .eq('certificate_id', certificateId)
      .single();
    
    if (error || !data) {
      console.error('Error verifying certificate:', error);
      return null;
    }
    
    return data as CertificateVerification;
  } catch (error) {
    console.error('Error in verifyCertificate:', error);
    return null;
  }
};

/**
 * Get all certificates for a specific student by name (for admin use)
 */
export const getCertificatesByStudent = async (studentName: string): Promise<CertificateVerification[]> => {
  try {
    const { data, error } = await supabase
      .from('certificate_verifications')
      .select('*')
      .ilike('student_name', `%${studentName}%`)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching certificates by student:', error);
      return [];
    }
    
    return data as CertificateVerification[];
  } catch (error) {
    console.error('Error in getCertificatesByStudent:', error);
    return [];
  }
};

/**
 * Revoke a certificate (mark as invalid) by ID
 */
export const revokeCertificate = async (certificateId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('certificate_verifications')
      .update({ is_valid: false })
      .eq('certificate_id', certificateId);
    
    if (error) {
      console.error('Error revoking certificate:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in revokeCertificate:', error);
    return false;
  }
}; 