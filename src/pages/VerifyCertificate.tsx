import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Search, Award, Calendar, User, Building, BookOpen, Clock } from 'lucide-react';
import { verifyCertificate } from '../services/certificateService';
import { format } from 'date-fns';

interface VerificationResult {
  certificate_id: string;
  student_name: string;
  college: string;
  internship_title: string;
  start_date: string;
  end_date: string;
  duration: string;
  issued_date: string;
  is_valid: boolean;
}

const VerifyCertificate: React.FC = () => {
  useEffect(() => {
    console.log('VerifyCertificate component mounted');
    // Add this to help debug the page loading issue
    document.title = 'Certificate Verification - Atlantic Enterprise';
  }, []);

  const [certificateId, setCertificateId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!certificateId.trim()) {
      setError('Please enter a certificate ID');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const verificationResult = await verifyCertificate(certificateId.trim());
      
      if (!verificationResult) {
        setError('Certificate not found. Please check the ID and try again.');
      } else {
        setResult(verificationResult as VerificationResult);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while verifying the certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (err) {
      return dateString;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Certificate Verification
          </h1>
          <p className="mt-3 text-xl text-gray-500">
            Verify the authenticity of an Atlantic Enterprise internship certificate
          </p>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <form onSubmit={handleVerify}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="certificate-id" className="block text-sm font-medium text-gray-700 mb-1">
                  Certificate ID
                </label>
                <input
                  type="text"
                  id="certificate-id"
                  placeholder="Enter Certificate ID (e.g., AE-1234-2025)"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full md:w-auto px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Verify Certificate
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
          
          {error && (
            <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <XCircle className="h-6 w-6 text-red-500 mr-3" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {result && (
            <div className="mt-8">
              <div className={`mb-6 p-4 flex items-center ${result.is_valid ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}`}>
                {result.is_valid ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500 mr-3" />
                )}
                <div>
                  <h3 className={`text-lg font-medium ${result.is_valid ? 'text-green-800' : 'text-red-800'}`}>
                    {result.is_valid ? 'Valid Certificate' : 'Invalid Certificate'}
                  </h3>
                  <p className={`text-sm ${result.is_valid ? 'text-green-700' : 'text-red-700'}`}>
                    {result.is_valid 
                      ? 'This certificate has been verified as authentic and has been issued by Atlantic Enterprise.' 
                      : 'This certificate has been marked as invalid or has been revoked.'}
                  </p>
                </div>
              </div>
              
              <div className="overflow-hidden bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Award className="mr-2 text-blue-500" />
                    Certificate Details
                  </h3>
                </div>
                
                <div className="px-6 py-4">
                  <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Award className="mr-1 h-4 w-4 text-gray-400" />
                        Certificate ID
                      </dt>
                      <dd className="mt-1 text-base font-semibold text-gray-900">{result.certificate_id}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        Issue Date
                      </dt>
                      <dd className="mt-1 text-base text-gray-900">{formatDate(result.issued_date)}</dd>
                    </div>
                    
                    <div className="md:col-span-2">
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="mr-1 h-4 w-4 text-gray-400" />
                        Student Name
                      </dt>
                      <dd className="mt-1 text-base font-semibold text-gray-900">{result.student_name}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Building className="mr-1 h-4 w-4 text-gray-400" />
                        College
                      </dt>
                      <dd className="mt-1 text-base text-gray-900">{result.college && result.college !== "Not Specified" ? result.college : "Not Specified"}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <BookOpen className="mr-1 h-4 w-4 text-gray-400" />
                        Internship Title
                      </dt>
                      <dd className="mt-1 text-base text-gray-900">{result.internship_title}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        Start Date
                      </dt>
                      <dd className="mt-1 text-base text-gray-900">{formatDate(result.start_date)}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-gray-400" />
                        End Date
                      </dt>
                      <dd className="mt-1 text-base text-gray-900">{formatDate(result.end_date)}</dd>
                    </div>
                    
                    <div>
                      <dt className="text-sm font-medium text-gray-500 flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-gray-400" />
                        Duration
                      </dt>
                      <dd className="mt-1 text-base text-gray-900">{result.duration}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-blue-50 p-4 rounded-lg">
            <h4 className="text-base font-medium text-blue-800 mb-2">How to verify a certificate</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-blue-700">
              <li>Enter the Certificate ID exactly as it appears on the certificate (format: AE-XXXX-YYYY)</li>
              <li>Click the "Verify Certificate" button</li>
              <li>The verification result will display with all certificate details</li>
              <li>If you're still unsure, contact us at verification@atlanticenterprise.in</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate; 