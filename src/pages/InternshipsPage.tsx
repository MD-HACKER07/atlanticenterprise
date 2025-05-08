import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, AlertCircle, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import InternshipCard from '../components/InternshipCard';
import { Internship } from '../types';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

const InternshipsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [showFeeRequired, setShowFeeRequired] = useState<boolean | null>(null);
  const [filteredInternships, setFilteredInternships] = useState<Internship[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [allInternships, setAllInternships] = useState<Internship[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch internships from Supabase
  useEffect(() => {
    const fetchInternships = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('internships')
          .select('*');

        if (error) {
          console.error('Error fetching internships:', error);
          setError('Failed to load internships. Please try again later.');
          return;
        }

        setAllInternships(data || []);
        setFilteredInternships(data || []);
        
        // Extract unique departments and locations
        if (data) {
          const deptSet = new Set(data.map(internship => internship.department));
          const locSet = new Set(data.map(internship => internship.location));
          setDepartments(Array.from(deptSet));
          setLocations(Array.from(locSet));
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchInternships();
  }, []);

  // Filter internships whenever filters change
  useEffect(() => {
    let filtered = [...allInternships];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        internship =>
          internship.title.toLowerCase().includes(searchLower) ||
          internship.description.toLowerCase().includes(searchLower) ||
          internship.department.toLowerCase().includes(searchLower) ||
          internship.location.toLowerCase().includes(searchLower)
      );
    }

    // Apply department filter
    if (selectedDepartments.length > 0) {
      filtered = filtered.filter(internship =>
        selectedDepartments.includes(internship.department)
      );
    }

    // Apply location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter(internship =>
        selectedLocations.includes(internship.location)
      );
    }

    // Apply remote only filter
    if (remoteOnly) {
      filtered = filtered.filter(internship => internship.remote);
    }
    
    // Apply fee required filter
    if (showFeeRequired !== null) {
      filtered = filtered.filter(internship => 
        showFeeRequired ? internship.paymentRequired : !internship.paymentRequired
      );
    }

    setFilteredInternships(filtered);
  }, [allInternships, searchTerm, selectedDepartments, selectedLocations, remoteOnly, showFeeRequired]);

  // Toggle a department selection
  const toggleDepartment = (dept: string) => {
    if (selectedDepartments.includes(dept)) {
      setSelectedDepartments(selectedDepartments.filter(d => d !== dept));
    } else {
      setSelectedDepartments([...selectedDepartments, dept]);
    }
  };

  // Toggle a location selection
  const toggleLocation = (loc: string) => {
    if (selectedLocations.includes(loc)) {
      setSelectedLocations(selectedLocations.filter(l => l !== loc));
    } else {
      setSelectedLocations([...selectedLocations, loc]);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDepartments([]);
    setSelectedLocations([]);
    setRemoteOnly(false);
    setShowFeeRequired(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <SEO 
        title="Internship Opportunities in Pune | Atlantic Enterprise"
        description="Apply for top internship opportunities in Pune at Atlantic Enterprise. We offer AI automation, hardware, and technical internships with hands-on experience in a supportive environment."
        keywords={["internship in Pune", "best internship", "atlanticenterprise internship", "AI automation internship", "hardware internship", "technical internship", "Pune internship", "internship opportunities", "apply for internship"]}
        canonicalUrl="https://atlanticenterprise.in/internships"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Explore Internships</h1>
            <div className="flex flex-wrap items-center gap-4">
              <Link 
                to="/" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                Back to Home
              </Link>
              <Link 
                to="/internship-faq" 
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 border border-blue-200 rounded-full px-3 py-1.5 hover:bg-blue-50 transition-colors"
              >
                Internship FAQ
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                </svg>
              </Link>
            </div>
          </div>
          
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for internships..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              <Filter size={18} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
            
            {(selectedDepartments.length > 0 || selectedLocations.length > 0 || remoteOnly || showFeeRequired !== null) && (
              <button
                onClick={clearFilters}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
          
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Department</h3>
                  <div className="space-y-2">
                    {departments.map(dept => (
                      <label key={dept} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedDepartments.includes(dept)}
                          onChange={() => toggleDepartment(dept)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Location</h3>
                  <div className="space-y-2">
                    {locations.map(loc => (
                      <label key={loc} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedLocations.includes(loc)}
                          onChange={() => toggleLocation(loc)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{loc}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Other Filters</h3>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={remoteOnly}
                        onChange={e => setRemoteOnly(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">Remote only</span>
                    </label>
                    
                    <div className="pt-2">
                      <p className="text-sm font-medium text-gray-700 mb-2">Application Fee</p>
                      <div className="flex flex-col gap-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={showFeeRequired === null}
                            onChange={() => setShowFeeRequired(null)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Show all</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={showFeeRequired === true}
                            onChange={() => setShowFeeRequired(true)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Fee required</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            checked={showFeeRequired === false}
                            onChange={() => setShowFeeRequired(false)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                          />
                          <span className="ml-2 text-sm text-gray-700">Free applications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Loading internships...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 px-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-4">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">{error}</h2>
              <p className="text-gray-600 mb-8">
                We're currently experiencing some technical difficulties. Please try again later or reach out to our team for assistance with your internship application.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.reload()}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Try Again
                </button>
                <Link 
                  to="/contact" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md flex items-center justify-center"
                >
                  <span>Click Here to Apply</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <p className="text-gray-700">
                Showing <span className="font-medium">{filteredInternships.length}</span> internships
              </p>
              
              {showFeeRequired === true && (
                <div className="flex items-center text-purple-700 bg-purple-50 px-3 py-1 rounded-full text-sm">
                  <Tag size={16} className="mr-1" />
                  Showing fee-required internships
                </div>
              )}
              
              {showFeeRequired === false && (
                <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full text-sm">
                  <CheckCircle size={16} className="mr-1" />
                  Showing free internships
                </div>
              )}
            </div>
          </div>
        )}
        
        {filteredInternships.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredInternships.map(internship => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <h3 className="text-xl font-medium text-gray-900 mb-2">No internships found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any internships matching your search criteria.
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipsPage;