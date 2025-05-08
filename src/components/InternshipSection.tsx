import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Internship } from '../types';
import { ArrowRight, CalendarDays, MapPin, Tag } from 'lucide-react';

const InternshipSection: React.FC = () => {
  const [featuredInternships, setFeaturedInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedInternships = async () => {
      setLoading(true);
      try {
        // Fetch featured internships that haven't expired yet
        const now = new Date().toISOString();
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('featured', true)
          .gt('applicationDeadline', now)
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) {
          console.error('Error fetching internships:', error);
          setError('Failed to load internships');
        } else {
          setFeaturedInternships(data || []);
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedInternships();
  }, []);

  // Format the deadline date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  
  const renderInternshipCard = (internship: Internship) => {
    return (
      <div key={internship.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-bold text-gray-900">{internship.title}</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {internship.department}
            </span>
          </div>
          
          <p className="text-gray-600 mb-4 line-clamp-2">{internship.description}</p>
          
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center text-gray-700">
              <MapPin size={16} className="mr-1.5 text-gray-500" />
              <span className="text-sm">{internship.location}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <CalendarDays size={16} className="mr-1.5 text-gray-500" />
              <span className="text-sm">Deadline: {formatDate(internship.applicationDeadline)}</span>
            </div>
          </div>

          {internship.paymentRequired && (
            <div className="mt-2 mb-4">
              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center w-fit">
                <Tag size={12} className="mr-1" /> Application Fee: ₹{internship.applicationFee}
              </span>
            </div>
          )}
        </div>
        
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <Link 
            to={`/internships`}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm inline-flex items-center"
          >
            View Details <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </div>
      </div>
    );
  };

  return (
    <section id="internship" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Internships</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join us for an enriching internship experience. Apply now to kickstart your career with our specialized programs.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-white shadow-lg rounded-xl overflow-hidden mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1">
              <div className="bg-white p-4 sm:p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-center">
                  <div className="md:w-1/2 mb-8 md:mb-0 md:pr-4 lg:pr-8">
                    <img 
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80" 
                      alt="Internship Opportunities" 
                      className="rounded-lg shadow-md w-full h-auto"
                    />
                  </div>
                  <div className="md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Explore Exciting Internship Opportunities</h3>
                    <p className="text-gray-600 mb-6">
                      Gain hands-on experience, work with industry experts, and build your professional network. 
                      Our internship programs are designed to help you grow and succeed in your career.
                    </p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700">Flexible work schedules</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700">Mentorship from experts</span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="ml-3 text-gray-700">Real-world project experience</span>
                      </div>
                    </div>
                    <div className="mt-8">
                      <Link
                        to="/internships"
                        className="btn btn-primary btn-pill btn-shine group"
                      >
                        <span>Apply Now</span>
                        <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : featuredInternships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredInternships.map(internship => renderInternshipCard(internship))}
            </div>
            
            <div className="text-center mt-10">
              <Link
                to="/internships"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl"
              >
                Browse All Internships
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">No internships are currently available.</p>
            <Link
              to="/internships"
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full transition-colors shadow-lg hover:shadow-xl"
            >
              Check All Internships
              <ArrowRight size={18} className="ml-2" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default InternshipSection; 