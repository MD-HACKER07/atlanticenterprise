import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Internship } from '../types';
import { CalendarDays, MapPin, Clock, Tag, FileText, CheckCircle, AlertCircle, Home } from 'lucide-react';
import InternshipApplicationForm from '../components/InternshipApplicationForm';
import SEO from '../components/SEO';
import BackButton from '../components/BackButton';

const InternshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [internship, setInternship] = useState<Internship | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [applicationId, setApplicationId] = useState<string | null>(null);

  useEffect(() => {
    const fetchInternship = async () => {
      setLoading(true);
      try {
        if (!id) {
          throw new Error('Internship ID is required');
        }

        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching internship:', error);
          setError('Failed to load internship details');
          return;
        }

        if (!data) {
          setError('Internship not found');
          return;
        }

        setInternship(data);
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchInternship();
  }, [id]);

  // Format date for display
  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  // Check if deadline has passed
  const isDeadlinePassed = internship 
    ? new Date(internship.applicationDeadline) < new Date() 
    : false;

  // Handle apply button click
  const handleApply = () => {
    setApplyModalOpen(true);
  };

  // Handle application submission
  const handleApplicationSubmitted = (appId: string) => {
    setApplicationId(appId);
    setApplicationSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      {internship && (
        <SEO 
          title={`${internship.title} | Internship in ${internship.location}`}
          description={`Apply for ${internship.title} internship at Atlantic Enterprise in ${internship.location}. ${internship.description.substring(0, 150)}...`}
          keywords={[
            "internship in Pune", 
            `${internship.department} internship`, 
            `${internship.title} internship`, 
            "atlanticenterprise internship", 
            `internship in ${internship.location}`, 
            "best internship",
            "apply for internship"
          ]}
          canonicalUrl={`https://atlanticenterprise.in/internships/${id}`}
        />
      )}
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <BackButton to="/internships" label="Back to Internships" />
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 px-3 py-1.5 border border-blue-200 rounded-full hover:bg-blue-50 transition-colors"
          >
            <Home size={16} />
            <span className="text-sm font-medium">Home</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
                <button 
                  onClick={() => navigate('/internships')}
                  className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Return to internships
                </button>
              </div>
            </div>
          </div>
        ) : internship ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">{internship.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-gray-600 text-sm sm:text-base">
                    <span className="inline-flex items-center">
                      <MapPin size={16} className="mr-1 text-gray-500" /> 
                      {internship.location} {internship.remote && '(Remote Available)'}
                    </span>
                    <span className="inline-flex items-center">
                      <Clock size={16} className="mr-1 text-gray-500" /> 
                      {internship.duration}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
                  <span className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full">
                    {internship.department}
                  </span>
                  {internship.remote && (
                    <span className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full">
                      Remote Available
                    </span>
                  )}
                  {internship.featured && (
                    <span className="bg-yellow-100 text-yellow-800 text-xs sm:text-sm font-medium px-2.5 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  {isDeadlinePassed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-red-100 text-red-800">
                      <AlertCircle size={14} className="mr-1" /> Closed
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs sm:text-sm font-medium bg-green-100 text-green-800">
                      <CheckCircle size={14} className="mr-1" /> Open
                    </span>
                  )}
                </div>
              </div>
              
              {/* Deadline & Fee Info */}
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-6 sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Application Deadline</h3>
                  <p className={`text-sm sm:text-base font-semibold ${isDeadlinePassed ? 'text-red-600' : 'text-gray-900'}`}>
                    {formatDate(internship.applicationDeadline)}
                    {isDeadlinePassed && ' (Expired)'}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Start Date</h3>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {formatDate(internship.startDate)}
                  </p>
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-1">Application Fee</h3>
                  <p className="text-sm sm:text-base font-semibold text-gray-900">
                    {internship.paymentRequired 
                      ? `₹${internship.applicationFee || 0}`
                      : 'Free Application'
                    }
                  </p>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">About the Internship</h2>
                <div className="prose text-gray-700 max-w-none">
                  <p>{internship.description}</p>
                </div>
              </div>
              
              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Requirements</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {internship.requirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>
              
              {/* Responsibilities */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-3">Responsibilities</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {internship.responsibilities.map((responsibility, index) => (
                    <li key={index}>{responsibility}</li>
                  ))}
                </ul>
              </div>
              
              {/* Terms and Conditions section */}
              {internship.termsAndConditions && internship.termsAndConditions.length > 0 && (
                <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start mb-2">
                    <FileText size={20} className="text-blue-600 mr-2 mt-1" />
                    <h2 className="text-xl font-bold text-gray-900">Terms and Conditions</h2>
                  </div>
                  <ul className="list-disc pl-5 space-y-2 text-gray-700">
                    {internship.termsAndConditions.map((term, index) => (
                      <li key={index}>{term}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Application section */}
              <div className="mt-10 pt-6 border-t border-gray-200">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">Ready to Apply?</h3>
                    <p className="text-gray-600">
                      Application deadline: {formatDate(internship.applicationDeadline)}
                    </p>
                    {internship.paymentRequired && (
                      <p className="text-sm text-purple-800 mt-1">
                        <Tag size={16} className="inline mr-1" /> 
                        Application fee: ₹{internship.applicationFee || 0}
                      </p>
                    )}
                  </div>
                  {applicationSubmitted ? (
                    <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 text-green-800 flex items-center">
                      <CheckCircle size={18} className="mr-2" />
                      Application submitted successfully!
                    </div>
                  ) : (
                    <button
                      onClick={handleApply}
                      disabled={isDeadlinePassed}
                      className={`${
                        isDeadlinePassed 
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      } px-6 py-3 text-white font-medium rounded-lg shadow-md transition-colors flex items-center`}
                    >
                      {isDeadlinePassed ? 'Applications Closed' : 'Apply Now'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            Internship not found
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {applyModalOpen && internship && (
        <InternshipApplicationForm 
          internship={internship}
          onClose={() => setApplyModalOpen(false)}
          onApplicationSubmitted={handleApplicationSubmitted}
        />
      )}
    </div>
  );
};

export default InternshipDetailPage;