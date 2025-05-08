import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AlertCircle, CheckCircle, Tag, FileText, File, Image, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { prepareDataWithColumnNameFormats } from '../lib/databaseUtils';
import { incrementCouponUsage, validateCoupon } from '../lib/couponUtils';
import { submitApplicationToDatabase } from '../lib/applicationSubmission';
import { ApplicationForm, Internship } from '../types';
import RazorpayPayment from './RazorpayPayment';
import { verifyPayment } from '../utils/paymentUtils';

interface InternshipApplicationFormProps {
  internship: Internship;
  onClose: () => void;
  onApplicationSubmitted: (applicationId: string) => void;
}

const InternshipApplicationForm: React.FC<InternshipApplicationFormProps> = ({
  internship,
  onClose,
  onApplicationSubmitted
}) => {
  type FormStep = 'form' | 'payment' | 'success' | 'error';
  const [step, setStep] = useState<FormStep>('form');
  const [formData, setFormData] = useState<Partial<ApplicationForm>>({});
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);
  const [fileUploadError, setFileUploadError] = useState<string | null>(null);
  const [agreesToTerms, setAgreesToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  
  // Calculate the final amount after discount
  const finalAmount = couponApplied 
    ? Math.max(0, (internship.applicationFee || 0) - couponDiscount) 
    : (internship.applicationFee || 0);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ApplicationForm>();

  const getFileIcon = (fileType: string | undefined): JSX.Element => {
    if (!fileType) return <File className="text-gray-500" />;
    
    if (fileType.includes('pdf')) {
      return <FileText className="text-red-500" />;
    } else if (fileType.includes('image') || fileType.includes('jpg') || fileType.includes('jpeg') || fileType.includes('png')) {
      return <Image className="text-blue-500" />;
    } else if (fileType.includes('word') || fileType.includes('doc')) {
      return <FileText className="text-blue-700" />;
    } else {
      return <File className="text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUploadError(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (file.size > maxSize) {
        setFileUploadError(`File size (${formatFileSize(file.size)}) exceeds 5MB limit. Please upload a smaller file.`);
        return;
      }
      
      const allowedTypes = [
        'application/pdf', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ];
      
      // Check file extension as a fallback
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const allowedExtensions = ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'];
      
      if (!allowedTypes.includes(file.type) && 
          !(fileExt && allowedExtensions.includes(fileExt))) {
        setFileUploadError(`Invalid file format: ${file.type || fileExt || 'unknown'}. Please upload a PDF, DOC, DOCX, JPG, JPEG, or PNG file.`);
        return;
      }
      
      setResumeFile(file);
      
      // Create preview for images and PDFs
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        // For PDFs, we can't show a preview directly, but we can set a placeholder
        setResumePreview('pdf');
      } else {
        // For other types like DOC/DOCX, we can't show a preview
        setResumePreview(null);
      }
      
      setSubmissionError(null);
    } else {
      setResumeFile(null);
      setResumePreview(null);
    }
  };

  const clearResumeFile = () => {
    setResumeFile(null);
    setResumePreview(null);
    setFileUploadError(null);
  };

  const handleFormSubmit = async (data: ApplicationForm) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Save the form data for the payment step
      setFormData({
        ...data,
        internshipId: internship.id
      });

      if (internship.paymentRequired) {
        setStep('payment');
      } else {
        // If no payment required, submit application directly
        await submitApplication(null);
      }
    } catch (error) {
      console.error('Error in form submission:', error);
      setSubmissionError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentId: string, orderId: string, signature: string) => {
    // Verify the payment with the server
    const verificationResult = await verifyPayment(paymentId, orderId, signature);
    
    if (verificationResult.success) {
      // If verification is successful, proceed with application submission
      await submitApplication(paymentId);
    } else {
      // If verification fails, show an error
      console.error('Payment verification failed:', verificationResult.error);
      setPaymentError(`Payment verification failed: ${verificationResult.error}`);
    }
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    setPaymentError(typeof error === 'string' ? error : 'Payment failed. Please try again.');
  };

  // Add coupon validation function
  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    
    if (!internship.acceptsCoupon) {
      setCouponError('This internship does not accept coupons');
      return;
    }
    
    setValidatingCoupon(true);
    setCouponError(null);
    
    try {
      // Use the new validateCoupon utility
      const result = await validateCoupon(couponCode);
      
      if (!result.valid) {
        setCouponError(result.error || 'Invalid coupon code');
        setCouponApplied(false);
        return;
      }
      
      // Calculate discount amount based on percentage
      const discountPercent = result.discountPercent || 0;
      const discountAmount = Math.round((internship.applicationFee || 0) * (discountPercent / 100));
      
      // Apply the coupon - immediately reduce fee
      setCouponDiscount(discountAmount);
      setCouponApplied(true);
      setAppliedCouponCode(couponCode.toUpperCase());
      setCouponError(null);
      
      // If successful, try to increment the usage count
      try {
        await incrementCouponUsage(couponCode.toUpperCase());
      } catch (usageError) {
        console.error('Failed to increment coupon usage:', usageError);
        // Don't fail the whole operation if this part fails
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Failed to validate coupon. Please try again.');
      setCouponApplied(false);
    } finally {
      setValidatingCoupon(false);
    }
  };

  // Function for onClick handler
  const handleCouponButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    handleValidateCoupon();
  };

  // Reset coupon
  const resetCoupon = () => {
    setCouponCode('');
    setCouponApplied(false);
    setCouponDiscount(0);
    setCouponError(null);
    setAppliedCouponCode(null);
  };

  const submitApplication = async (paymentId: string | null) => {
    setIsSubmitting(true);
    setSubmissionError(null);
    
    try {
      // Upload resume if provided
      let resumeUrl = null;
      let resumeFileName = null;
      
      if (resumeFile) {
        try {
          const fileExt = resumeFile.name.split('.').pop();
          resumeFileName = resumeFile.name;
          const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
          const filePath = `resumes/${fileName}`;
          
          console.log(`Uploading resume: ${resumeFileName} (${formatFileSize(resumeFile.size)})`);
          
          const { error: uploadError, data } = await supabase.storage
            .from('resumes')
            .upload(filePath, resumeFile);
            
          if (uploadError) {
            console.error('Resume upload error:', uploadError);
            // Continue without resume if upload fails
            console.log('Continuing application submission without resume');
          } else {
            console.log('Resume uploaded successfully:', filePath);
            
            // Get public URL for the file
            const { data: urlData } = await supabase.storage
              .from('resumes')
              .getPublicUrl(filePath);
              
            resumeUrl = urlData?.publicUrl || filePath;
            
            // Log URL for debugging
            console.log('Resume URL resolved to:', resumeUrl);
            
            // Double check that we have a valid URL
            if (!resumeUrl || resumeUrl === 'null' || resumeUrl === 'undefined') {
              console.error('Resume URL is invalid after upload:', resumeUrl);
              // Fallback to storage path if public URL fails
              resumeUrl = filePath;
              console.log('Using storage path as fallback:', resumeUrl);
            }
          }
        } catch (uploadErr) {
          console.error('Resume upload exception:', uploadErr);
          // Continue without resume
        }
      }
      
      // Create the application record in snake_case format which is more reliable
      const applicationData = {
        internship_id: internship.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        college: formData.college || '',
        city: formData.city || '',
        message: formData.coverLetter || '',
        skills: formData.skills || [],
        resume_url: resumeUrl,
        resume_file_name: resumeFileName,
        linkedin_profile: formData.linkedInProfile || '',
        github_profile: formData.githubProfile || '',
        portfolio_url: formData.portfolioUrl || '',
        hear_about_us: formData.hearAboutUs || '',
        status: 'pending',
        payment_status: internship.paymentRequired ? (paymentId ? 'paid' : 'unpaid') : 'waived',
        payment_id: paymentId || null,
        payment_amount: finalAmount,
        coupon_code: appliedCouponCode,
        discount_amount: couponDiscount,
        original_amount: internship.applicationFee,
        applied_at: new Date().toISOString()
      };
      
      // First try our direct API endpoint for reliability
      try {
        const apiResponse = await fetch('/api/submit-application', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(applicationData),
        });
        
        if (apiResponse.ok) {
          const result = await apiResponse.json();
          if (result.success && result.applicationId) {
            console.log('Application submitted via API endpoint:', result);
            setStep('success');
            onApplicationSubmitted(result.applicationId);
            return;
          }
        }
        
        // If API endpoint fails, fall back to the utility
        console.log('API endpoint submission failed, trying utility function...');
      } catch (apiError) {
        console.error('API endpoint error:', apiError);
        // Continue to fallback
      }
      
      // Use our utility function as fallback
      const applicationId = await submitApplicationToDatabase(applicationData);
      
      // If the coupon was successfully applied, increment usage in the coupons table
      if (couponApplied && appliedCouponCode) {
        try {
          // Use the utility function to increment coupon usage
          await incrementCouponUsage(appliedCouponCode);
        } catch (couponError) {
          // Log but don't fail the application if coupon update fails
          console.error('Failed to update coupon usage:', couponError);
        }
      }
      
      setStep('success');
      onApplicationSubmitted(applicationId);
      
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmissionError(error instanceof Error ? error.message : 'Failed to submit application. Please try again.');
      setStep('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              {step === 'form' && 'Apply for Internship'}
              {step === 'payment' && 'Complete Payment'}
              {step === 'success' && 'Application Submitted'}
              {step === 'error' && 'Submission Error'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {step === 'form' && (
            <>
              <p className="text-gray-600 mb-6">
                Complete this form to apply for the {internship.title} internship.
                {internship.paymentRequired && (
                  <span className="block mt-2 text-sm text-purple-800 bg-purple-50 p-2 rounded-md">
                    <Tag size={16} className="inline mr-1" /> 
                    This internship requires an application fee of ₹{internship.applicationFee || 0}.
                  </span>
                )}
              </p>
              
              <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    id="name"
                    type="text"
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your name"
                    {...register('name', { required: 'Name is required' })}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    id="email"
                    type="email"
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your email"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number*
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Your phone number"
                    {...register('phone', { 
                      required: 'Phone number is required',
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: 'Please enter a valid 10-digit phone number'
                      }
                    })}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
                      Highest Education*
                    </label>
                    <select
                      id="education"
                      className={`block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.education ? 'border-red-300' : 'border-gray-300'
                      }`}
                      {...register('education', { required: 'Education is required' })}
                    >
                      <option value="">Select Education Level</option>
                      <option value="High School">High School</option>
                      <option value="Diploma">Diploma</option>
                      <option value="Bachelor's">Bachelor's Degree</option>
                      <option value="Master's">Master's Degree</option>
                      <option value="Ph.D.">Ph.D.</option>
                    </select>
                    {errors.education && (
                      <p className="mt-1 text-sm text-red-600">{errors.education.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                      College/University
                    </label>
                    <input
                      id="college"
                      type="text"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Your college/university"
                      {...register('college')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your city"
                    {...register('city')}
                  />
                </div>
                
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Resume/CV*
                  </label>
                  
                  {!resumeFile ? (
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <svg 
                          className="mx-auto h-12 w-12 text-gray-400" 
                          stroke="currentColor" 
                          fill="none" 
                          viewBox="0 0 48 48" 
                          aria-hidden="true"
                        >
                          <path 
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label 
                            htmlFor="resume" 
                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                          >
                            <span>Upload a file</span>
                            <input 
                              id="resume" 
                              name="resume" 
                              type="file" 
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                              onChange={handleFileChange}
                              className="sr-only"
                              required
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, JPEG, PNG up to 5MB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center p-4 border border-gray-300 rounded-md bg-gray-50">
                      <div className="flex-shrink-0 mr-4">
                        {getFileIcon(resumeFile.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resumeFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(resumeFile.size)}
                        </p>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <button
                          type="button"
                          onClick={clearResumeFile}
                          className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {resumePreview && resumePreview !== 'pdf' && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-md">
                      <img 
                        src={resumePreview} 
                        alt="Resume preview" 
                        className="mx-auto max-h-40 object-contain" 
                      />
                    </div>
                  )}
                  
                  {resumePreview === 'pdf' && (
                    <div className="mt-2 p-2 border border-gray-300 rounded-md bg-gray-50 text-center py-4">
                      <FileText size={40} className="mx-auto text-red-500" />
                      <p className="text-sm text-gray-700 mt-2">PDF document preview</p>
                    </div>
                  )}
                  
                  {fileUploadError && (
                    <p className="mt-1 text-sm text-red-600">
                      {fileUploadError}
                    </p>
                  )}
                  
                  <p className="mt-1 text-xs text-gray-500">
                    Accepted file formats: PDF, DOC, DOCX, JPG, JPEG, PNG (Max size: 5MB)
                  </p>
                </div>
                
                <div>
                  <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Letter/Message
                  </label>
                  <textarea
                    id="coverLetter"
                    rows={4}
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Why are you interested in this internship?"
                    {...register('coverLetter')}
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="linkedInProfile" className="block text-sm font-medium text-gray-700 mb-1">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedInProfile"
                      type="url"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://linkedin.com/in/yourusername"
                      {...register('linkedInProfile')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="githubProfile" className="block text-sm font-medium text-gray-700 mb-1">
                      GitHub Profile
                    </label>
                    <input
                      id="githubProfile"
                      type="url"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://github.com/yourusername"
                      {...register('githubProfile')}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="portfolioUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Portfolio URL
                  </label>
                  <input
                    id="portfolioUrl"
                    type="url"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://yourportfolio.com"
                    {...register('portfolioUrl')}
                  />
                </div>
                
                <div>
                  <label htmlFor="hearAboutUs" className="block text-sm font-medium text-gray-700 mb-1">
                    How did you hear about us?
                  </label>
                  <select
                    id="hearAboutUs"
                    className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    {...register('hearAboutUs')}
                  >
                    <option value="">Select an option</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Twitter">Twitter</option>
                    <option value="College">College/University</option>
                    <option value="Friend">Friend or Referral</option>
                    <option value="Search">Search Engine</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                {internship.termsAndConditions && internship.termsAndConditions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms and Conditions*
                    </label>
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 mb-3 text-sm text-gray-700 max-h-40 overflow-y-auto">
                      <ul className="list-disc pl-5 space-y-1">
                        {internship.termsAndConditions.map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-start">
                      <input
                        id="terms"
                        type="checkbox"
                        checked={agreesToTerms}
                        onChange={(e) => setAgreesToTerms(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                        required
                      />
                      <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                        I agree to the terms and conditions
                      </label>
                    </div>
                  </div>
                )}
                
                {internship.paymentRequired && internship.acceptsCoupon && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Have a coupon code?
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.trim())}
                        placeholder="Enter coupon code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={couponApplied}
                      />
                      {!couponApplied ? (
                        <button
                          type="button"
                          onClick={handleCouponButtonClick}
                          disabled={validatingCoupon || !couponCode.trim()}
                          className={`px-4 py-2 border rounded-md shadow-sm text-sm font-medium ${
                            validatingCoupon || !couponCode.trim() 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                              : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                          }`}
                        >
                          {validatingCoupon ? 'Validating...' : 'Apply'}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={resetCoupon}
                          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    
                    {couponError && (
                      <p className="mt-1 text-sm text-red-600">{couponError}</p>
                    )}
                    
                    {couponApplied && (
                      <div className="mt-2 text-sm text-green-600 bg-green-50 p-2 rounded-md">
                        <CheckCircle size={16} className="inline mr-1" />
                        Coupon applied! {couponDiscount} off the application fee.
                      </div>
                    )}
                  </div>
                )}
                
                {submissionError && (
                  <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-700 text-sm">
                    <AlertCircle size={16} className="inline mr-1" />
                    {submissionError}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting || (internship.termsAndConditions && internship.termsAndConditions.length > 0 && !agreesToTerms)}
                    className={`w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white transition-colors ${
                      isSubmitting || (internship.termsAndConditions && internship.termsAndConditions.length > 0 && !agreesToTerms)
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : internship.paymentRequired ? (
                      'Continue to Payment'
                    ) : (
                      'Submit Application'
                    )}
                  </button>
                  <p className="mt-3 text-center text-xs text-gray-500">
                    By clicking submit, you acknowledge that your information will be processed according to our privacy policy.
                  </p>
                </div>
              </form>
            </>
          )}
          
          {step === 'payment' && (
            <div className="space-y-6">
              <p className="text-gray-600 mb-4">
                Please complete the payment to submit your application for the {internship.title} internship.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
                <h3 className="font-medium text-gray-900 mb-2">Application Summary</h3>
                <ul className="space-y-2 text-sm">
                  <li><span className="font-medium">Name:</span> {formData.name}</li>
                  <li><span className="font-medium">Email:</span> {formData.email}</li>
                  <li><span className="font-medium">Internship:</span> {internship.title}</li>
                  <li><span className="font-medium">Original Fee:</span> ₹{internship.applicationFee}</li>
                  
                  {couponApplied && (
                    <>
                      <li className="text-green-600">
                        <span className="font-medium">Coupon Discount:</span> -₹{couponDiscount} 
                        <span className="text-xs ml-1">({appliedCouponCode})</span>
                      </li>
                      <li className="font-medium text-lg">
                        <span className="font-medium">Final Amount:</span> ₹{finalAmount}
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              {paymentError && (
                <div className="bg-red-50 border border-red-200 p-3 rounded-md text-red-700 text-sm mb-4">
                  <AlertCircle size={16} className="inline mr-1" />
                  {paymentError}
                </div>
              )}
              
              <RazorpayPayment
                amount={finalAmount}
                name={formData.name || ''}
                description={`Application fee for ${internship.title} internship`}
                email={formData.email || ''}
                phone={formData.phone || ''}
                onSuccess={handlePaymentSuccess}
                onFailure={handlePaymentFailure}
                notes={{
                  internshipId: internship.id,
                  applicantName: formData.name || '',
                  applicantEmail: formData.email || ''
                }}
              />
              
              <button
                onClick={() => setStep('form')}
                className="w-full mt-3 inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                type="button"
              >
                Back to Form
              </button>
            </div>
          )}
          
          {step === 'success' && (
            <div className="text-center py-4 space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">Application Submitted Successfully!</h3>
                <p className="text-gray-600">
                  Thank you for applying to the {internship.title} internship.
                  {internship.paymentRequired && ' Your payment was successful.'}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                We will review your application and contact you soon.
                Please check your email for confirmation details.
              </p>
              <button
                onClick={onClose}
                className="mt-6 inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                type="button"
              >
                Done
              </button>
            </div>
          )}
          
          {step === 'error' && (
            <div className="text-center py-4 space-y-4">
              <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900 mb-1">Application Submission Failed</h3>
                <p className="text-gray-600">
                  {submissionError || 'Failed to submit application. Please try again.'}
                </p>
              </div>
              <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-3 rounded-md">
                <p>This may be due to one of the following reasons:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Temporary network connectivity issues</li>
                  <li>Database connectivity problems</li>
                  <li>Server processing errors</li>
                </ul>
                <p className="mt-2">Please try the following:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Check your internet connection</li>
                  <li>Try submitting the application again</li>
                  <li>If the problem persists, contact support</li>
                </ul>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => setStep('form')}
                  className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700"
                  type="button"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="block w-full mt-2 text-blue-600 hover:text-blue-800"
                  type="button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InternshipApplicationForm; 