import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Download, Check, X, Eye, FileText, FileOutput, Award } from 'lucide-react';
import { InternshipApplication } from '../types';
import { exportApplicationsToPDF, exportSingleApplicationToPDF } from '../utils/pdfExport';
import { generateAppointmentLetter } from '../utils/appointmentLetterGenerator';
import { generateInternshipCertificate } from '../utils/certificateGenerator';
import AppointmentLetterPreview from './AppointmentLetterPreview';
import CertificatePreview from './CertificatePreview';

interface ApplicationManagerProps {
  internshipId?: string; // Optional, if we want to filter by internship
}

const ApplicationManager: React.FC<ApplicationManagerProps> = ({ internshipId }) => {
  const [applications, setApplications] = useState<InternshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<InternshipApplication | null>(null);
  const [internships, setInternships] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [showAppointmentPreview, setShowAppointmentPreview] = useState(false);
  const [letterApplication, setLetterApplication] = useState<InternshipApplication | null>(null);
  const [showCertificatePreview, setShowCertificatePreview] = useState(false);
  const [certificateApplication, setCertificateApplication] = useState<InternshipApplication | null>(null);

  useEffect(() => {
    fetchApplications();
    fetchInternships();
  }, [internshipId, filter]);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching applications...');
      // First try using the admin RPC function
      const { data: rpcData, error: rpcError } = await supabase
        .rpc('get_applications_for_admin');
      
      if (!rpcError && rpcData) {
        console.log('Successfully fetched applications via RPC:', rpcData);
        // Filter based on criteria if needed
        let filteredData = rpcData.map((app: any) => {
          // Handle both snake_case and camelCase field names
          return {
            id: app.id || '',
            applicationId: app.id || app.application_id || '',
            internshipId: app.internship_id || app.internshipid || '',
            name: app.name || '',
            email: app.email || '',
            phone: app.phone || '',
            education: app.education || '',
            college: app.college || '',
            city: app.city || '',
            skills: app.skills || [],
            experience: app.experience || '',
            message: app.message || '',
            resumeUrl: app.resume_url || app.resumeurl || null,
            resumeFileName: app.resume_file_name || app.resumefilename || null,
            linkedInProfile: app.linkedin_profile || app.linkedinprofile || '',
            githubProfile: app.github_profile || app.githubprofile || '',
            portfolioUrl: app.portfolio_url || app.portfoliourl || '',
            status: app.status || 'pending',
            paymentStatus: app.payment_status || app.paymentstatus || 'unpaid',
            paymentId: app.payment_id || app.paymentid || '',
            paymentAmount: app.payment_amount || app.paymentamount || 0,
            couponCode: app.coupon_code || app.couponcode || '',
            discountAmount: app.discount_amount || app.discountamount || 0,
            originalAmount: app.original_amount || app.originalamount || 0,
            appliedAt: app.applied_at || app.appliedat || new Date().toISOString(),
            updatedAt: app.updated_at || app.updatedat || new Date().toISOString(),
            hearAboutUs: app.hear_about_us || app.hearaboutus || ''
          } as InternshipApplication;
        });
        
        if (internshipId) {
          filteredData = filteredData.filter((app: InternshipApplication) => 
            app.internshipId === internshipId
          );
        }
        
        if (filter !== 'all') {
          filteredData = filteredData.filter((app: InternshipApplication) => app.status === filter);
        }
        
        setApplications(filteredData || []);
        console.log('Processed applications:', filteredData.length);
        setLoading(false);
        return;
      }
      
      console.warn('RPC fetch failed, trying direct query:', rpcError);
      setError(`Failed to fetch applications via RPC: ${rpcError?.message || 'Unknown error'}`);
      
      // Fall back to the original query method
      let query = supabase.from('applications').select('*');
      
      if (internshipId) {
        query = query.eq('internship_id', internshipId);
      }

      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      const { data, error } = await query.order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        setError(`Failed to load applications: ${error.message}`);
      } else {
        console.log('Fetched applications via direct query:', data?.length || 0);
        // Map the data to ensure consistent property names
        const mappedData = (data || []).map(app => ({
          id: app.id,
          applicationId: app.id,
          internshipId: app.internship_id,
          name: app.name,
          email: app.email,
          phone: app.phone,
          education: app.education,
          college: app.college,
          city: app.city,
          skills: app.skills || [],
          experience: app.experience,
          message: app.message,
          resumeUrl: app.resume_url || null,
          resumeFileName: app.resume_file_name || null,
          linkedInProfile: app.linkedin_profile,
          githubProfile: app.github_profile,
          portfolioUrl: app.portfolio_url,
          status: app.status,
          paymentStatus: app.payment_status,
          paymentId: app.payment_id,
          paymentAmount: app.payment_amount,
          couponCode: app.coupon_code,
          discountAmount: app.discount_amount,
          originalAmount: app.original_amount,
          appliedAt: app.applied_at,
          updatedAt: app.updated_at,
          hearAboutUs: app.hear_about_us
        }));
        
        setApplications(mappedData);
        console.log('Processed applications via direct query:', mappedData.length);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError(`An unexpected error occurred: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchInternships = async () => {
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('id, title');

      if (error) {
        console.error('Error fetching internships:', error);
      } else if (data) {
        const internshipsMap: Record<string, any> = {};
        data.forEach(internship => {
          internshipsMap[internship.id] = internship;
        });
        setInternships(internshipsMap);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  const handleStatusChange = async (applicationId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application status:', error);
        alert('Failed to update application status');
      } else {
        fetchApplications();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('An unexpected error occurred');
    }
  };

  const deleteApplication = async (applicationId: string) => {
    if (!window.confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) {
        console.error('Error deleting application:', error);
        alert('Failed to delete application: ' + error.message);
      } else {
        // If currently viewing this application, close the detail view
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(null);
        }
        
        // Refresh the applications list
        fetchApplications();
        alert('Application deleted successfully');
      }
    } catch (error: any) {
      console.error('Unexpected error deleting application:', error);
      alert('An unexpected error occurred: ' + error.message);
    }
  };

  const handleViewApplication = (application: InternshipApplication) => {
    setSelectedApplication(application);
  };

  const closeApplicationView = () => {
    setSelectedApplication(null);
  };

  const filteredApplications = applications.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isValidResumeUrl = (url: string | null | undefined): boolean => {
    if (!url || url === 'null' || url === 'undefined' || url === '') {
      return false;
    }
    return true;
  };

  const handleGenerateAppointmentLetter = (application: InternshipApplication) => {
    setLetterApplication(application);
    setShowAppointmentPreview(true);
  };

  const closeAppointmentPreview = () => {
    setShowAppointmentPreview(false);
    setLetterApplication(null);
  };

  const handleGenerateCertificate = (application: InternshipApplication) => {
    setCertificateApplication(application);
    setShowCertificatePreview(true);
  };

  const closeCertificatePreview = () => {
    setShowCertificatePreview(false);
    setCertificateApplication(null);
  };

  const downloadResumeFile = async (resumeUrl: string, fileName?: string) => {
    try {
      if (!isValidResumeUrl(resumeUrl)) {
        alert('No resume file available');
        return;
      }
      
      // If the URL is already a public URL (starts with http)
      if (resumeUrl.startsWith('http')) {
        window.open(resumeUrl, '_blank');
        return;
      }
      
      // Extract bucket path from storage URL if needed
      const storagePath = resumeUrl.startsWith('resumes/') ? resumeUrl : `resumes/${resumeUrl.split('/').pop()}`;
      console.log('Attempting to download from storage path:', storagePath);
      
      // Get file extension to ensure the downloaded file has the correct extension
      const fileNameToUse = fileName || resumeUrl.split('/').pop() || 'resume';
      const fileExtension = (fileNameToUse.split('.').pop() || '').toLowerCase();
      
      // If no extension is found in the filename, try to extract it from resumeUrl
      const finalFileName = fileExtension && fileExtension.length <= 5 
        ? fileNameToUse 
        : `${fileNameToUse}.${resumeUrl.split('.').pop() || 'pdf'}`;
      
      console.log('Will save file as:', finalFileName);
      
      // First try to get a public URL and download it directly (more compatible with some systems)
      try {
        const { data: urlData } = await supabase.storage
          .from('resumes')
          .getPublicUrl(storagePath);
          
        if (urlData?.publicUrl) {
          console.log('Got public URL, initiating download:', urlData.publicUrl);
          
          // Create a temporary link and trigger the download
          const a = document.createElement('a');
          a.href = urlData.publicUrl;
          a.download = finalFileName;
          a.target = '_blank'; // This helps with certain browsers
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
          }, 100);
          
          return;
        }
      } catch (urlError) {
        console.error('Error getting public URL, falling back to direct download:', urlError);
      }
      
      // Fall back to direct download from storage
      const { data, error } = await supabase.storage
        .from('resumes')
        .download(storagePath);
      
      if (error) {
        console.error('Error downloading resume:', error);
        alert(`Failed to download resume: ${error.message}`);
        return;
      }
      
      // Create and trigger download
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = finalFileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Failed to download resume. Please try again later.');
    }
  };

  const viewResumeFile = async (resumeUrl: string) => {
    try {
      if (!isValidResumeUrl(resumeUrl)) {
        alert('No resume file available');
        return;
      }
      
      // If the URL is already a public URL (starts with http)
      if (resumeUrl.startsWith('http')) {
        window.open(resumeUrl, '_blank');
        return;
      }
      
      // Extract bucket path from storage URL if needed
      const storagePath = resumeUrl.startsWith('resumes/') ? resumeUrl : `resumes/${resumeUrl.split('/').pop()}`;
      console.log('Attempting to view from storage path:', storagePath);
      
      // Get file extension to determine how to handle the file
      const fileExtension = (resumeUrl.split('.').pop() || '').toLowerCase();
      console.log('File extension detected:', fileExtension);
      
      // First try to get a public URL (this is more reliable than download+blob)
      const { data } = await supabase.storage
        .from('resumes')
        .getPublicUrl(storagePath);
      
      if (data?.publicUrl) {
        console.log('Got public URL:', data.publicUrl);
        // For images, PDFs, and other web-viewable formats, open directly
        if (['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
          window.open(data.publicUrl, '_blank');
        } else {
          // For other formats like DOCX that might not render in browser,
          // prompt the user to download instead
          if (confirm(`This resume is in ${fileExtension.toUpperCase()} format which may not display correctly in the browser. Would you like to download it instead?`)) {
            downloadResumeFile(resumeUrl);
          } else {
            window.open(data.publicUrl, '_blank');
          }
        }
      } else {
        // Fall back to download method if public URL fails
        console.error('Could not get public URL, falling back to download');
        
        const { data: fileData, error: downloadError } = await supabase.storage
          .from('resumes')
          .download(storagePath);
        
        if (downloadError) {
          console.error('Download error:', downloadError);
          alert(`Failed to view resume: ${downloadError.message}`);
          throw downloadError;
        }
        
        const url = URL.createObjectURL(fileData);
        
        // Handle different file types
        if (['jpg', 'jpeg', 'png', 'gif', 'pdf'].includes(fileExtension)) {
          window.open(url, '_blank');
        } else {
          // For other formats, suggest downloading
          if (confirm(`This resume is in ${fileExtension.toUpperCase()} format which may not display correctly in the browser. Would you like to download it instead?`)) {
            const a = document.createElement('a');
            a.href = url;
            a.download = resumeUrl.split('/').pop() || 'resume';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          } else {
            window.open(url, '_blank');
          }
        }
        
        // Clean up blob URL after a delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
      }
    } catch (error: any) {
      console.error('Error viewing resume:', error);
      alert(`Failed to view resume: ${error.message || 'Unknown error'}`);
    }
  };

  const exportToCSV = () => {
    // Get all the unique keys from applications (for column headers)
    const headers = [
      'name', 'email', 'phone', 'education', 'status', 
      'paymentStatus', 'paymentId', 'couponCode', 'appliedAt'
    ];
    
    // Format the CSV content
    let csvContent = headers.join(',') + '\n';
    
    filteredApplications.forEach(app => {
      const row = headers.map(header => {
        const value = app[header as keyof InternshipApplication];
        // Handle cases where value might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      });
      csvContent += row.join(',') + '\n';
    });
    
    // Create download link and trigger download
    const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `applications_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const internshipTitles: Record<string, string> = {};
    Object.keys(internships).forEach(id => {
      internshipTitles[id] = internships[id].title;
    });
    exportApplicationsToPDF(filteredApplications, internshipTitles);
  };
  
  const handleExportSingleApplicationToPDF = (application: InternshipApplication) => {
    const internshipTitle = internships[application.internshipId]?.title || 'Unknown Internship';
    exportSingleApplicationToPDF(application, internshipTitle);
  };

  if (selectedApplication) {
    const internshipTitle = internships[selectedApplication.internshipId]?.title || 'Unknown Internship';
    
    return (
      <div className="relative">
        <div className="mb-6 bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-900">Application Responses</h2>
            <div className="relative inline-block text-left">
              <div>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                  onClick={exportToCSV}
                >
                  <FileText size={16} className="mr-1.5" />
                  Export to CSV
                </button>
                <button
                  type="button"
                  className="ml-2 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                  onClick={exportToPDF}
                >
                  <FileOutput size={16} className="mr-1.5" />
                  Export to PDF
                </button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
                Status:
              </label>
              <select
                id="status-filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No applications found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applicant
                  </th>
                  {!internshipId && (
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Internship
                    </th>
                  )}
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resume
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Applied On
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{application.name}</div>
                          <div className="text-sm text-gray-500">{application.email}</div>
                        </div>
                      </div>
                    </td>
                    {!internshipId && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {internships[application.internshipId]?.title || "Unknown"}
                        </div>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        application.status === 'approved' ? 'bg-green-100 text-green-800' :
                        application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isValidResumeUrl(application.resumeUrl) ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewResumeFile(application.resumeUrl!)}
                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                            title="View Resume"
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => downloadResumeFile(application.resumeUrl!, application.resumeFileName)}
                            className="inline-flex items-center text-green-600 hover:text-green-800"
                            title="Download Resume"
                          >
                            <Download size={16} className="mr-1" />
                            Download
                          </button>
                          {application.resumeFileName && (
                            <span className="text-xs text-gray-500 italic ml-1">
                              ({application.resumeFileName.split('.').pop()?.toUpperCase()})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400">No resume uploaded</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(application.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewApplication(application)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        {application.status === 'approved' && (
                          <button
                            onClick={() => handleGenerateAppointmentLetter(application)}
                            className="text-green-600 hover:text-green-900"
                            title="Generate Appointment Letter"
                          >
                            <FileOutput size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleStatusChange(application.id, 'approved')}
                          className={`text-green-600 hover:text-green-900 ${application.status === 'approved' ? '' : 'text-gray-400 hover:text-green-600'}`}
                          title="Approve"
                          disabled={application.status === 'approved'}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusChange(application.id, 'rejected')}
                          className={`text-red-600 hover:text-red-900 ${application.status === 'rejected' ? '' : 'text-gray-400 hover:text-red-600'}`}
                          title="Reject"
                          disabled={application.status === 'rejected'}
                        >
                          <X size={18} />
                        </button>
                        <button
                          onClick={() => handleExportSingleApplicationToPDF(application)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Export to PDF"
                        >
                          <FileOutput size={18} />
                        </button>
                        <button
                          onClick={() => deleteApplication(application.id)}
                          className="text-red-600 hover:text-red-900 ml-2"
                          title="Delete Application"
                        >
                          <X size={18} />
                        </button>
                        {application.status === 'approved' && (
                          <button
                            onClick={() => handleGenerateCertificate(application)}
                            className="text-green-600 hover:text-green-900"
                            title="Generate Certificate"
                          >
                            <Award className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h2 className="text-2xl font-bold mb-4">Application Details</h2>
                  <button
                    onClick={closeApplicationView}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                    <p><span className="text-gray-600">Name:</span> {selectedApplication.name}</p>
                    <p><span className="text-gray-600">Email:</span> {selectedApplication.email}</p>
                    <p><span className="text-gray-600">Phone:</span> {selectedApplication.phone}</p>
                    <p><span className="text-gray-600">Education:</span> {selectedApplication.education}</p>
                    <p><span className="text-gray-600">College:</span> {selectedApplication.college || 'Not specified'}</p>
                    <p><span className="text-gray-600">City:</span> {selectedApplication.city || 'Not specified'}</p>
                    <p>
                      <span className="text-gray-600">Status:</span>{' '}
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        selectedApplication.status === 'approved' ? 'bg-green-100 text-green-800' :
                        selectedApplication.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedApplication.status.charAt(0).toUpperCase() + selectedApplication.status.slice(1)}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Applied For:</span>{' '}
                      {internships[selectedApplication.internshipId]?.title || selectedApplication.internshipId}
                    </p>
                    <p>
                      <span className="text-gray-600">Applied On:</span>{' '}
                      {new Date(selectedApplication.appliedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p>
                      <span className="text-gray-600">Source:</span>{' '}
                      {selectedApplication.hearAboutUs || 'Not specified'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Skills & Experience</h3>
                    <p><span className="text-gray-600">Skills:</span></p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {selectedApplication.skills && selectedApplication.skills.length > 0 ? (
                        selectedApplication.skills.map((skill, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500 italic">No skills listed</span>
                      )}
                    </div>
                    <p><span className="text-gray-600">Experience:</span></p>
                    <p className="mb-4 whitespace-pre-wrap">{selectedApplication.experience || 'Not specified'}</p>
                    <p><span className="text-gray-600">Cover Letter:</span></p>
                    <p className="mb-4 whitespace-pre-wrap">{selectedApplication.message || 'No cover letter provided'}</p>
                    
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Links</h3>
                    {selectedApplication.linkedInProfile && (
                      <p>
                        <span className="text-gray-600">LinkedIn:</span>{' '}
                        <a href={selectedApplication.linkedInProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedApplication.linkedInProfile}
                        </a>
                      </p>
                    )}
                    {selectedApplication.githubProfile && (
                      <p>
                        <span className="text-gray-600">GitHub:</span>{' '}
                        <a href={selectedApplication.githubProfile} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedApplication.githubProfile}
                        </a>
                      </p>
                    )}
                    {selectedApplication.portfolioUrl && (
                      <p>
                        <span className="text-gray-600">Portfolio:</span>{' '}
                        <a href={selectedApplication.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {selectedApplication.portfolioUrl}
                        </a>
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Documents</h3>
                    {isValidResumeUrl(selectedApplication.resumeUrl) ? (
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <FileText size={18} className="text-blue-600" />
                          <span className="text-gray-700">
                            {selectedApplication.resumeFileName || 'Resume'}
                            {selectedApplication.resumeFileName && (
                              <span className="text-xs text-gray-500 italic ml-1">
                                ({selectedApplication.resumeFileName.split('.').pop()?.toUpperCase() || 'Unknown format'})
                              </span>
                            )}
                          </span>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => viewResumeFile(selectedApplication.resumeUrl!)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                          <button
                            onClick={() => downloadResumeFile(selectedApplication.resumeUrl!, selectedApplication.resumeFileName)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none"
                          >
                            <Download size={14} className="mr-1" />
                            Download
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No resume uploaded</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => handleExportSingleApplicationToPDF(selectedApplication)}
                    className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <FileOutput size={16} className="inline mr-1" />
                    Export as PDF
                  </button>
                  
                  {selectedApplication.status === 'approved' && (
                    <button
                      onClick={() => handleGenerateAppointmentLetter(selectedApplication)}
                      className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-green-700 hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <FileOutput size={16} className="inline mr-1" />
                      Generate Appointment Letter
                    </button>
                  )}
                  
                  <button
                    onClick={() => deleteApplication(selectedApplication.id)}
                    className="px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <X size={16} className="inline mr-1" />
                    Delete
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'rejected')}
                    className={`px-4 py-2 border ${
                      selectedApplication.status === 'rejected' ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:bg-red-50'
                    } rounded-md shadow-sm text-sm font-medium text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500`}
                  >
                    <X size={16} className="inline mr-1" />
                    Reject
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(selectedApplication.id, 'approved')}
                    className={`px-4 py-2 border ${
                      selectedApplication.status === 'approved' ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-white hover:bg-green-50'
                    } rounded-md shadow-sm text-sm font-medium text-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                  >
                    <Check size={16} className="inline mr-1" />
                    Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAppointmentPreview && letterApplication && (
          <AppointmentLetterPreview
            application={letterApplication}
            internshipTitle={internships[letterApplication.internshipId]?.title || 'Internship Position'}
            onClose={closeAppointmentPreview}
          />
        )}
        
        {showCertificatePreview && certificateApplication && (
          <CertificatePreview
            application={certificateApplication}
            internshipTitle={internships[certificateApplication.internshipId]?.title || 'Internship Position'}
            onClose={closeCertificatePreview}
          />
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              {error}
            </p>
            <button 
              onClick={() => { setError(null); fetchApplications(); }} 
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-900 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-500 mb-4">No applications found.</p>
        <button 
          onClick={fetchApplications}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Application Responses</h2>
          <div className="relative inline-block text-left">
            <div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                onClick={exportToCSV}
              >
                <FileText size={16} className="mr-1.5" />
                Export to CSV
              </button>
              <button
                type="button"
                className="ml-2 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
                onClick={exportToPDF}
              >
                <FileOutput size={16} className="mr-1.5" />
                Export to PDF
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by name or email..."
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <label htmlFor="status-filter" className="mr-2 text-sm font-medium text-gray-700">
              Status:
            </label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No applications found.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                </th>
                {!internshipId && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Internship
                  </th>
                )}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredApplications.map((application) => (
                <tr key={application.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{application.name}</div>
                        <div className="text-sm text-gray-500">{application.email}</div>
                      </div>
                    </div>
                  </td>
                  {!internshipId && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {internships[application.internshipId]?.title || "Unknown"}
                      </div>
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      application.status === 'approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {isValidResumeUrl(application.resumeUrl) ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewResumeFile(application.resumeUrl!)}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                          title="View Resume"
                        >
                          <Eye size={16} className="mr-1" />
                          View
                        </button>
                        <button
                          onClick={() => downloadResumeFile(application.resumeUrl!, application.resumeFileName)}
                          className="inline-flex items-center text-green-600 hover:text-green-800"
                          title="Download Resume"
                        >
                          <Download size={16} className="mr-1" />
                          Download
                        </button>
                        {application.resumeFileName && (
                          <span className="text-xs text-gray-500 italic ml-1">
                            ({application.resumeFileName.split('.').pop()?.toUpperCase()})
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">No resume uploaded</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(application.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewApplication(application)}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View
                      </button>
                      {application.status === 'approved' && (
                        <button
                          onClick={() => handleGenerateAppointmentLetter(application)}
                          className="text-green-600 hover:text-green-900"
                          title="Generate Appointment Letter"
                        >
                          <FileOutput size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusChange(application.id, 'approved')}
                        className={`text-green-600 hover:text-green-900 ${application.status === 'approved' ? '' : 'text-gray-400 hover:text-green-600'}`}
                        title="Approve"
                        disabled={application.status === 'approved'}
                      >
                        <Check size={18} />
                      </button>
                      <button
                        onClick={() => handleStatusChange(application.id, 'rejected')}
                        className={`text-red-600 hover:text-red-900 ${application.status === 'rejected' ? '' : 'text-gray-400 hover:text-red-600'}`}
                        title="Reject"
                        disabled={application.status === 'rejected'}
                      >
                        <X size={18} />
                      </button>
                      {application.resumeUrl && (
                        <button
                          onClick={() => downloadResumeFile(application.resumeUrl!, application.resumeFileName)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Download resume"
                        >
                          <Download size={18} />
                        </button>
                      )}
                      {application.status === 'approved' && (
                        <button
                          onClick={() => handleGenerateCertificate(application)}
                          className="text-green-600 hover:text-green-900"
                          title="Generate Certificate"
                        >
                          <Award className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showAppointmentPreview && letterApplication && (
        <AppointmentLetterPreview
          application={letterApplication}
          internshipTitle={internships[letterApplication.internshipId]?.title || 'Internship Position'}
          onClose={closeAppointmentPreview}
        />
      )}
      
      {showCertificatePreview && certificateApplication && (
        <CertificatePreview
          application={certificateApplication}
          internshipTitle={internships[certificateApplication.internshipId]?.title || 'Internship Position'}
          onClose={closeCertificatePreview}
        />
      )}
    </div>
  );
};

export default ApplicationManager; 