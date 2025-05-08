import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, Clock, Tag, FileText } from 'lucide-react';
import { Internship } from '../types';

interface InternshipCardProps {
  internship: Internship;
}

const InternshipCard: React.FC<InternshipCardProps> = ({ internship }) => {
  const {
    id,
    title,
    department,
    duration,
    description,
    location,
    remote,
    applicationDeadline,
    paymentRequired,
    applicationFee,
    termsAndConditions
  } = internship;

  // Format the deadline date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  const deadlineDate = formatDate(applicationDeadline);
  const isDeadlineSoon = new Date(applicationDeadline).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000;
  const isDeadlinePassed = new Date(applicationDeadline) < new Date();

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {department}
          </span>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {paymentRequired && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
              <Tag size={12} /> Fee: ₹{applicationFee}
            </span>
          )}
          {remote && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Remote
            </span>
          )}
          {isDeadlinePassed && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Closed
            </span>
          )}
          {termsAndConditions && termsAndConditions.length > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded flex items-center gap-1">
              <FileText size={12} /> T&C
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-gray-700">
            <Clock size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{duration}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin size={16} className="mr-2 text-gray-500" />
            <span className="text-sm">{location} {remote && '(Remote)'}</span>
          </div>
          <div className="flex items-center text-gray-700 col-span-2">
            <CalendarDays size={16} className="mr-2 text-gray-500" />
            <span className={`text-sm ${isDeadlinePassed ? 'text-red-600 font-medium' : isDeadlineSoon ? 'text-orange-600 font-medium' : ''}`}>
              {isDeadlinePassed ? 'Deadline Passed: ' : isDeadlineSoon ? 'Deadline Soon: ' : ''}
              {deadlineDate}
            </span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
        <Link
          to={`/internships/${id}`}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center group-hover:gap-1.5 gap-1 transition-all"
        >
          View Details <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
        </Link>
        
        {paymentRequired ? (
          <span className="text-sm text-gray-500 font-medium">
            Fee: ₹{applicationFee}
          </span>
        ) : (
          <span className="text-sm text-green-600 font-medium">
            Free Application
          </span>
        )}
      </div>
    </div>
  );
};

export default InternshipCard;