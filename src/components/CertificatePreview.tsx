import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Award } from 'lucide-react';
import { InternshipApplication } from '../types';
import { generateInternshipCertificate } from '../utils/certificateGenerator';
import { format } from 'date-fns';

interface CertificatePreviewProps {
  application: InternshipApplication;
  internshipTitle: string;
  onClose: () => void;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({
  application,
  internshipTitle,
  onClose
}) => {
  const [startDate, setStartDate] = useState(format(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState('30 Days');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [endDate, setEndDate] = useState('');
  
  useEffect(() => {
    // Calculate end date based on start date and duration
    const durationNumber = parseInt(duration.split(' ')[0]);
    const durationUnit = duration.split(' ')[1].toLowerCase();
    
    let endDateObj = new Date(startDate);
    if (durationUnit.includes('day')) {
      endDateObj.setDate(endDateObj.getDate() + durationNumber);
    } else if (durationUnit.includes('month')) {
      endDateObj.setMonth(endDateObj.getMonth() + durationNumber);
    }
    
    setEndDate(format(endDateObj, 'MMMM d, yyyy'));
  }, [startDate, duration]);
  
  // Preload images - updated paths to match generator
  useEffect(() => {
    const imagePaths = {
      logo: '/images/logo.png',
      ceoSign: '/images/CEO-Sign.png',
      trainingHeadSign: '/images/T-Head-Sign.png',
      stamp: '/images/Stump.png',
      msme: '/images/msme-logo.png'
    };
    
    Object.entries(imagePaths).forEach(([key, path]) => {
      const img = new Image();
      img.onload = () => {
        console.log(`Image loaded successfully: ${path}`);
      };
      img.onerror = () => {
        console.warn(`Failed to load image: ${path}`);
      };
      img.src = path;
    });
  }, []);
  
  const handleGenerateCertificate = async () => {
    setError(null);
    setIsGenerating(true);
    try {
      const success = await generateInternshipCertificate(
        application,
        internshipTitle,
        startDate,
        duration
      );
      
      if (success) {
        alert('Certificate generated successfully!');
        onClose();
      } else {
        setError('Failed to generate certificate. Please try again.');
      }
    } catch (err: any) {
      console.error('Error generating certificate:', err);
      setError(err.message || 'An error occurred while generating the certificate');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const certificateId = `AE-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${new Date().getFullYear()}`;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Award className="mr-2 text-blue-500" />
              Generate Certificate
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="flex items-center">
                <X className="mr-2" size={18} />
                {error}
              </p>
            </div>
          )}
          
          <div className="mb-6">
            <p className="mb-2">
              You are about to generate a certificate for <strong>{application.name}</strong> for 
              completing the <strong>{internshipTitle}</strong> internship program.
            </p>
            <p className="text-gray-600">
              Please specify the internship details to include in the certificate:
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="inline-block mr-1 h-4 w-4" /> Internship Start Date
              </label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                <Clock className="inline-block mr-1 h-4 w-4" /> Internship Duration
              </label>
              <select
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="30 Days">30 Days</option>
                <option value="45 Days">45 Days</option>
                <option value="60 Days">60 Days</option>
                <option value="90 Days">90 Days</option>
                <option value="6 Months">6 Months</option>
              </select>
            </div>
          </div>
          
          <div className="mt-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Certificate Preview (Landscape)</h3>
            <div className="border border-gray-300 rounded-lg p-4 bg-white" style={{ aspectRatio: '1.41 / 1' }}>
              {/* Full certificate container including signatures */}
              <div className="relative">
                {/* Blue outer background - CERTIFICATE ONLY */}
                <div className="relative p-8 bg-[#4da9e0]">
                  {/* White inner background */}
                  <div className="relative flex flex-col bg-white p-6" style={{ 
                    background: 'url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuXzAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PGNpcmNsZSBjeD0iNSIgY3k9IjUiIHI9IjMiIGZpbGw9IiNmMGYwZjAiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IndoaXRlIi8+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuXzApIi8+PC9zdmc+) white',
                    minHeight: '320px'
                  }}>
                    {/* Header with logo and company name */}
                    <div className="flex justify-center items-center mb-4">
                      <img 
                        src="/images/logo.png" 
                        alt="Atlantic Enterprise Logo" 
                        className="h-9 mr-4"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                      <div className="text-2xl font-bold text-blue-500">ATLANTIC ENTERPRISE</div>
                    </div>
                    
                    {/* Certificate title */}
                    <div className="text-center mb-3">
                      <h1 className="text-xl font-bold text-gray-800 uppercase tracking-wider">CERTIFICATE OF COMPLETION</h1>
                    </div>
                    
                    {/* Certificate ID */}
                    <div className="text-center mb-3">
                      <p className="text-xs text-gray-500 italic">Certificate ID: {certificateId}</p>
                    </div>
                    
                    {/* Certificate content */}
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">This is to certify that</p>
                      
                      <p className="text-2xl font-bold text-red-600 leading-tight">{application.name}</p>
                      
                      <p className="text-sm text-gray-600">from</p>
                      
                      <p className="text-xl font-semibold text-gray-800 leading-tight">{application.college && application.college !== "Not Specified" ? application.college : "Not Specified"}</p>
                      
                      <p className="text-sm text-gray-600">has successfully completed</p>
                      
                      <p className="text-xl font-bold text-blue-600 leading-tight">{internshipTitle} Internship Program</p>
                      
                      <p className="text-sm text-gray-600">of duration {duration}</p>
                      
                      <p className="text-sm text-gray-600">
                        from {format(new Date(startDate), 'MMMM d, yyyy')} to {endDate}
                      </p>
                    </div>
                    
                    {/* Verification text */}
                    <div className="text-center text-xs text-gray-500 mt-3 mb-2 max-w-3xl mx-auto">
                      This certificate verifies that the above-named person has successfully completed the internship program
                      at Atlantic Enterprise as specified above. For verification, contact us at verification@atlanticenterprise.in 
                      or visit <strong>verify.atlanticenterprise.in</strong> and enter the Certificate ID.
                    </div>
                    
                    {/* Issue date and MSME logo */}
                    <div className="flex justify-between items-center px-6 mt-auto">
                      <span className="text-sm text-gray-500">Issued on {format(new Date(), 'MMMM d, yyyy')}</span>
                      <img 
                        src="/images/msme-logo.png" 
                        alt="MSME Logo"
                        className="h-7"
                        onError={(e) => e.currentTarget.style.display = 'none'}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Signatures section COMPLETELY OUTSIDE the certificate border */}
                <div className="flex justify-between px-20 mt-8 items-center">
                  {/* CEO Signature */}
                  <div className="text-center">
                    <img 
                      src="/images/CEO-Sign.png" 
                      alt="CEO Signature" 
                      className="h-10 mx-auto"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-20 h-10 mx-auto flex items-end justify-center">
                            <span class="italic text-gray-600">Signature</span>
                          </div>`;
                        }
                      }}
                    />
                    <p className="text-xs font-semibold">Chief Executive</p>
                    <p className="text-xs font-semibold">Officer</p>
                  </div>
                  
                  {/* Company Stamp */}
                  <div className="text-center">
                    <img 
                      src="/images/Stump.png"
                      alt="Company Stamp" 
                      className="h-12 w-12 mx-auto"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-14 h-14 border-2 border-blue-500 rounded-full mx-auto flex items-center justify-center">
                            <span class="text-blue-500 font-bold text-xs">AE</span>
                          </div>`;
                        }
                      }}
                    />
                  </div>
                  
                  {/* Training Head Signature */}
                  <div className="text-center">
                    <img 
                      src="/images/T-Head-Sign.png" 
                      alt="Training Head Signature" 
                      className="h-10 mx-auto"
                      onError={(e) => {
                        const parent = e.currentTarget.parentElement;
                        if (parent) {
                          parent.innerHTML = `<div class="w-20 h-10 mx-auto flex items-end justify-center">
                            <span class="italic text-gray-600">Signature</span>
                          </div>`;
                        }
                      }}
                    />
                    <p className="text-xs font-semibold">Training</p>
                    <p className="text-xs font-semibold">Head</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            
            <button
              onClick={handleGenerateCertificate}
              disabled={isGenerating}
              className="px-4 py-2 border border-transparent bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <Award className="mr-2" size={16} />
                  Generate Certificate
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePreview; 