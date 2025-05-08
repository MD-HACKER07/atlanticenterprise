import React, { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { InternshipApplication } from '../types';
import { format } from 'date-fns';
import { generateAppointmentLetter } from '../utils/appointmentLetterGenerator';

interface AppointmentLetterPreviewProps {
  application: InternshipApplication;
  internshipTitle: string;
  onClose: () => void;
}

const AppointmentLetterPreview: React.FC<AppointmentLetterPreviewProps> = ({
  application,
  internshipTitle,
  onClose
}) => {
  const [startDate, setStartDate] = useState(format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [duration, setDuration] = useState('30 Days');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Define image paths
  const logoPath = '/public/images/logo.png';
  const ceoSignPath = '/public/images/CEO-Sign.png';
  const stampPath = '/public/images/Stump.png';
  const trainingHeadSignPath = '/public/images/T-Head-Sign.png';
  const msmePath = '/public/images/msme-logo.png';
  
  const handleGenerateAppointmentLetter = async () => {
    setIsGenerating(true);
    try {
      const success = await generateAppointmentLetter(
        application,
        internshipTitle,
        startDate,
        duration
      );
      
      if (success) {
        alert('Appointment letter generated successfully!');
        onClose();
      } else {
        alert('Failed to generate appointment letter. Please try again.');
      }
    } catch (error) {
      console.error('Error generating appointment letter:', error);
      alert('An error occurred while generating the appointment letter');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold mb-4">Generate Appointment Letter</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="mb-2">
              You are about to generate an appointment letter for <strong>{application.name}</strong> for 
              the <strong>{internshipTitle}</strong> position.
            </p>
            <p className="text-gray-600">
              Please specify the internship details to include in the appointment letter:
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
            <h3 className="text-lg font-medium text-gray-900 mb-3">Appointment Letter Preview</h3>
            <div className="border border-gray-300 rounded-lg p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <img src={logoPath} alt="Atlantic Enterprise Logo" className="h-12 w-auto mr-3" />
                  <div>
                    <h1 className="text-lg font-bold text-gray-800">ATLANTIC ENTERPRISE</h1>
                    <p className="text-xs text-gray-500">Pune, Maharashtra</p>
                  </div>
                </div>
                <img src={msmePath} alt="MSME Logo" className="h-10 w-auto" />
              </div>
              
              <div className="border-t border-b border-gray-200 my-4 py-1"></div>
              
              <div className="text-center mb-4">
                <h2 className="text-lg font-bold text-gray-800 underline">INTERNSHIP OFFER LETTER</h2>
              </div>
              
              <div className="mb-4 text-sm">
                <p><strong>DATE:</strong> {format(new Date(), 'dd/MM/yyyy')}</p>
                <p><strong>Dear {application.name},</strong></p>
                <p><strong>College:</strong> {application.college || 'Not specified'}</p>
              </div>
              
              <div className="mb-4 text-sm">
                <p>
                  Congratulations! We are pleased to inform you that you have been selected for the position of
                  {' '}{internshipTitle} at Atlantic Enterprise. We were impressed by your qualifications, skills, and
                  enthusiasm for {internshipTitle}, and we are excited to have you join our team.
                </p>
                
                <p className="mt-2"><strong>Program Details:</strong></p>
                <p><strong>Start Date:</strong> {format(new Date(startDate), 'MMMM d, yyyy')}</p>
                <p><strong>Duration:</strong> {duration}</p>
                <p><strong>Domain:</strong> {internshipTitle}</p>
                <p><strong>Location:</strong> Work From Home (Remote)</p>
              </div>
              
              <div className="mb-4 text-sm">
                <p>
                  Hope you will be doing well. This Internship is observed by Atlantic Enterprise as
                  being a learning opportunity for you. Your internship will embrace orientation and give emphasis
                  on learning new skills with a deeper understanding of concepts through hands-on application of
                  the knowledge you gained as an intern.
                </p>
                
                <p className="mt-2">
                  You will acknowledge your obligation to perform all work allocated to you to the best of your
                  ability within lawful and reasonable direction given to you.
                </p>
              </div>
              
              <div className="mb-4 text-sm">
                <p>
                  We look forward to a worthwhile and fruitful association which will make you equipped for
                  future projects, wishing you the most enjoyable and truly meaningful internship program
                  experience.
                </p>
              </div>
              
              <div className="flex justify-between mt-6">
                <div className="text-center">
                  <img src={ceoSignPath} alt="CEO Signature" className="h-10 mx-auto mb-1" />
                  <p className="text-xs border-t border-gray-400 pt-1 w-28 mx-auto">CEO Signature</p>
                </div>
                
                <div className="text-center">
                  <img src={stampPath} alt="Company Stamp" className="h-12 w-12 mx-auto" />
                </div>
                
                <div className="text-center">
                  <img src={trainingHeadSignPath} alt="Training Head Signature" className="h-10 mx-auto mb-1" />
                  <p className="text-xs border-t border-gray-400 pt-1 w-28 mx-auto">Training Head</p>
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
              onClick={handleGenerateAppointmentLetter}
              disabled={isGenerating}
              className="px-4 py-2 border border-transparent bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? 'Generating...' : 'Generate Letter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentLetterPreview; 