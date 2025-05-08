import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Internship } from '../types';
import { supabase } from '../lib/supabase';
import { X, Plus, AlertCircle, FileText } from 'lucide-react';

interface CreateInternshipFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  internshipToEdit?: Internship | null;
}

const CreateInternshipForm: React.FC<CreateInternshipFormProps> = ({ 
  onSuccess, 
  onCancel,
  internshipToEdit 
}) => {
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [responsibilities, setResponsibilities] = useState<string[]>(['']);
  const [termsAndConditions, setTermsAndConditions] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [paymentRequired, setPaymentRequired] = useState(internshipToEdit?.paymentRequired || false);
  const [acceptsCoupon, setAcceptsCoupon] = useState(internshipToEdit?.acceptsCoupon || false);
  
  // Set default values for dates
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultAppDeadline = tomorrow.toISOString().split('T')[0];
  
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  const defaultStartDate = nextMonth.toISOString().split('T')[0];
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      ...internshipToEdit,
      // Set default dates for new internships
      applicationDeadline: internshipToEdit?.applicationDeadline || defaultAppDeadline,
      startDate: internshipToEdit?.startDate || defaultStartDate,
    }
  });

  // Initialize form with existing data if editing
  useEffect(() => {
    if (internshipToEdit) {
      Object.entries(internshipToEdit).forEach(([key, value]) => {
        setValue(key as any, value);
      });
      
      if (internshipToEdit.requirements && internshipToEdit.requirements.length > 0) {
        setRequirements(internshipToEdit.requirements);
      }
      
      if (internshipToEdit.responsibilities && internshipToEdit.responsibilities.length > 0) {
        setResponsibilities(internshipToEdit.responsibilities);
      }
      
      if (internshipToEdit.termsAndConditions && internshipToEdit.termsAndConditions.length > 0) {
        setTermsAndConditions(internshipToEdit.termsAndConditions);
      }
    }
  }, [internshipToEdit, setValue]);

  const handleAddRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const handleAddResponsibility = () => {
    setResponsibilities([...responsibilities, '']);
  };

  const handleAddTerms = () => {
    setTermsAndConditions([...termsAndConditions, '']);
  };

  const handleRequirementChange = (index: number, value: string) => {
    const updatedRequirements = [...requirements];
    updatedRequirements[index] = value;
    setRequirements(updatedRequirements);
  };

  const handleResponsibilityChange = (index: number, value: string) => {
    const updatedResponsibilities = [...responsibilities];
    updatedResponsibilities[index] = value;
    setResponsibilities(updatedResponsibilities);
  };

  const handleTermsChange = (index: number, value: string) => {
    const updatedTerms = [...termsAndConditions];
    updatedTerms[index] = value;
    setTermsAndConditions(updatedTerms);
  };

  const handleRemoveRequirement = (index: number) => {
    if (requirements.length > 1) {
      const filtered = requirements.filter((_, i) => i !== index);
      setRequirements(filtered);
    }
  };

  const handleRemoveResponsibility = (index: number) => {
    if (responsibilities.length > 1) {
      const filtered = responsibilities.filter((_, i) => i !== index);
      setResponsibilities(filtered);
    }
  };

  const handleRemoveTerms = (index: number) => {
    if (termsAndConditions.length > 1) {
      const filtered = termsAndConditions.filter((_, i) => i !== index);
      setTermsAndConditions(filtered);
    }
  };

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    setFormError(null);
    
    try {
      // Check if Supabase is configured properly
      const { data: connTest, error: connError } = await supabase.from('internships').select('count', { count: 'exact', head: true });
      
      if (connError) {
        console.error('Database connection error:', connError);
        setFormError(`Database connection error: ${connError.message}. Please check your configuration.`);
        return;
      }
      
      // Filter out empty items
      const filteredRequirements = requirements.filter(item => item.trim() !== '');
      const filteredResponsibilities = responsibilities.filter(item => item.trim() !== '');
      const filteredTerms = termsAndConditions.filter(item => item.trim() !== '');
      
      if (filteredRequirements.length === 0) {
        setFormError('Please add at least one requirement');
        return;
      }
      
      if (filteredResponsibilities.length === 0) {
        setFormError('Please add at least one responsibility');
        return;
      }
      
      const internshipData: Partial<Internship> = {
        title: data.title,
        department: data.department,
        duration: data.duration,
        description: data.description,
        requirements: filteredRequirements,
        responsibilities: filteredResponsibilities,
        applicationDeadline: data.applicationDeadline,
        startDate: data.startDate,
        location: data.location,
        remote: data.remote === 'true',
        featured: data.featured === 'true',
        paymentRequired: paymentRequired,
        applicationFee: paymentRequired ? Number(data.applicationFee) : 0,
        acceptsCoupon: paymentRequired && acceptsCoupon,
        termsAndConditions: filteredTerms,
        stipend: '0',
        createdAt: new Date().toISOString(),
      };

      // Validate that required dates are present
      if (!data.applicationDeadline) {
        setFormError('Application deadline is required');
        return;
      }
      
      if (!data.startDate) {
        setFormError('Start date is required');
        return;
      }
      
      // Ensure dates are in proper ISO format
      try {
        // Format dates properly in ISO format
        const applicationDeadlineDate = new Date(data.applicationDeadline);
        const startDateDate = new Date(data.startDate);
        
        // Validate dates are valid
        if (isNaN(applicationDeadlineDate.getTime())) {
          setFormError('Invalid application deadline date format');
          return;
        }
        
        if (isNaN(startDateDate.getTime())) {
          setFormError('Invalid start date format');
          return;
        }
        
        // Update with properly formatted ISO dates
        internshipData.applicationDeadline = applicationDeadlineDate.toISOString().split('T')[0];
        internshipData.startDate = startDateDate.toISOString().split('T')[0];
      } catch (error) {
        console.error('Date validation error:', error);
        setFormError('Error validating dates. Please check date formats.');
        return;
      }

      console.log('Attempting to save internship with data:', internshipData);
      
      let result;
      
      try {
        if (internshipToEdit?.id) {
          // Update existing internship
          result = await supabase
            .from('internships')
            .update(internshipData)
            .eq('id', internshipToEdit.id)
            .select();
        } else {
          // Insert new internship
          result = await supabase
            .from('internships')
            .insert([internshipData])
            .select();
        }
      } catch (innerError: any) {
        console.error('Database operation error:', innerError);
        setFormError(`Database operation failed: ${innerError.message}`);
        return;
      }

      if (!result) {
        setFormError('No response from database. Please try again.');
        return;
      }

      const { data: resultData, error } = result;

      if (error) {
        console.error('Error saving internship:', error);
        const errorMessage = error.details 
          ? `Failed to save internship: ${error.message} (${error.details})`
          : `Failed to save internship: ${error.message}`;
        setFormError(errorMessage);
      } else if (!resultData || resultData.length === 0) {
        console.error('No data returned from save operation');
        setFormError('Failed to save internship. No data returned from server.');
      } else {
        console.log('Internship saved successfully:', resultData);
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error in form submission:', error);
      setFormError(error.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {internshipToEdit ? 'Edit Internship' : 'Create New Internship'}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Internship Title*
            </label>
            <input
              id="title"
              type="text"
              {...register('title', { required: 'Title is required' })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department*
            </label>
            <input
              id="department"
              type="text"
              {...register('department', { required: 'Department is required' })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
              Duration*
            </label>
            <input
              id="duration"
              type="text"
              placeholder="e.g., 3 months"
              {...register('duration', { required: 'Duration is required' })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration.message as string}</p>}
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="paymentRequired" className="text-sm font-medium text-gray-700">
                Requires Application Fee
              </label>
              <div className="relative inline-block w-10 mr-2 align-middle select-none">
                <input
                  type="checkbox"
                  id="paymentRequired"
                  checked={paymentRequired}
                  onChange={() => setPaymentRequired(!paymentRequired)}
                  className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                />
                <label
                  htmlFor="paymentRequired"
                  className={`block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer ${
                    paymentRequired ? 'bg-blue-500' : ''
                  }`}
                ></label>
              </div>
            </div>
            
            {paymentRequired && (
              <div className="mt-3">
                <label htmlFor="applicationFee" className="block text-sm font-medium text-gray-700 mb-1">
                  Application Fee Amount (₹)*
                </label>
                <input
                  id="applicationFee"
                  type="number"
                  placeholder="e.g., 500"
                  {...register('applicationFee', { 
                    required: paymentRequired ? 'Fee amount is required' : false,
                    min: { value: 1, message: 'Fee must be greater than 0' }
                  })}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.applicationFee && (
                  <p className="mt-1 text-sm text-red-600">{errors.applicationFee.message as string}</p>
                )}
                
                <div className="mt-3 flex items-center">
                  <input
                    type="checkbox"
                    id="acceptsCoupon"
                    checked={acceptsCoupon}
                    onChange={() => setAcceptsCoupon(!acceptsCoupon)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptsCoupon" className="ml-2 block text-sm text-gray-700">
                    Allow coupon discounts
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description*
          </label>
          <textarea
            id="description"
            rows={4}
            {...register('description', { required: 'Description is required' })}
            className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message as string}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location*
            </label>
            <input
              id="location"
              type="text"
              {...register('location', { required: 'Location is required' })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location.message as string}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remote Option
            </label>
            <select
              {...register('remote')}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="false">On-site Only</option>
              <option value="true">Remote Available</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="applicationDeadline" className="block text-sm font-medium text-gray-700 mb-1">
              Application Deadline*
            </label>
            <input
              id="applicationDeadline"
              type="date"
              {...register('applicationDeadline', { 
                required: 'Application deadline is required',
                validate: (value) => !!value || 'Valid application deadline is required'
              })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.applicationDeadline && <p className="mt-1 text-sm text-red-600">{errors.applicationDeadline.message as string}</p>}
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date*
            </label>
            <input
              id="startDate"
              type="date"
              {...register('startDate', { 
                required: 'Start date is required',
                validate: (value) => !!value || 'Valid start date is required'
              })}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.startDate && <p className="mt-1 text-sm text-red-600">{errors.startDate.message as string}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Featured Internship
            </label>
            <select
              {...register('featured')}
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Requirements*
          </label>
          {requirements.map((req, index) => (
            <div key={`req-${index}`} className="flex items-center mb-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a requirement"
              />
              <button
                type="button"
                onClick={() => handleRemoveRequirement(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={requirements.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRequirement}
            className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Requirement
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsibilities*
          </label>
          {responsibilities.map((resp, index) => (
            <div key={`resp-${index}`} className="flex items-center mb-2">
              <input
                type="text"
                value={resp}
                onChange={(e) => handleResponsibilityChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter a responsibility"
              />
              <button
                type="button"
                onClick={() => handleRemoveResponsibility(index)}
                className="ml-2 text-red-600 hover:text-red-800"
                disabled={responsibilities.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddResponsibility}
            className="mt-2 flex items-center text-blue-600 hover:text-blue-800"
          >
            <Plus size={16} className="mr-1" /> Add Responsibility
          </button>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start mb-2">
            <FileText size={20} className="text-blue-600 mr-2 mt-1" />
            <h3 className="text-md font-medium text-blue-800">Terms and Conditions</h3>
          </div>
          
          <p className="text-sm text-blue-700 mb-4">
            Add terms and conditions that applicants must agree to before applying. These will be displayed prominently during the application process.
          </p>
          
          {termsAndConditions.map((term, index) => (
            <div key={`term-${index}`} className="flex items-center mb-2">
              <input
                type="text"
                value={term}
                onChange={(e) => handleTermsChange(index, e.target.value)}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Term ${index + 1}, e.g., "All applications are subject to review and approval"`}
              />
              <button
                type="button"
                onClick={() => handleRemoveTerms(index)}
                className="ml-2 text-gray-400 hover:text-red-500"
                disabled={termsAndConditions.length <= 1}
              >
                <X size={20} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTerms}
            className="text-blue-600 hover:text-blue-800 mt-2 inline-flex items-center text-sm font-medium"
          >
            <Plus size={16} className="mr-1" /> Add Term
          </button>
        </div>

        {formError && (
          <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <div>{formError}</div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Internship'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInternshipForm; 