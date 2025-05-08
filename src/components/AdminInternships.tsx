import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, AlertCircle, Clock, BarChart2, Download, Filter, Edit, Trash2, ExternalLink, LogOut, User } from 'lucide-react';
import CreateInternshipForm from './CreateInternshipForm';
import { Internship } from '../types';

// Add interface for CreateInternshipForm props to fix linter error
interface CreateInternshipFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  internshipToEdit?: Internship | null;
}

const AdminInternships: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateInternshipForm, setShowCreateInternshipForm] = useState(false);
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'deadline' | 'title'>('newest');
  const [statsData, setStatsData] = useState({
    total: 0,
    active: 0,
    expired: 0,
    withFee: 0,
    featured: 0
  });
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    fetchInternships();
  }, []);

  useEffect(() => {
    // Calculate statistics whenever internships change
    if (internships.length > 0) {
      const now = new Date();
      const active = internships.filter(i => new Date(i.applicationDeadline) > now).length;
      const withFee = internships.filter(i => i.paymentRequired).length;
      const featured = internships.filter(i => i.featured).length;

      setStatsData({
        total: internships.length,
        active,
        expired: internships.length - active,
        withFee,
        featured
      });
    }
  }, [internships]);

  const fetchInternships = async () => {
    setLoadingInternships(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('internships')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching internships:', error);
        setError('Failed to load internships. ' + error.message);
      } else {
        // Ensure we have data with the correct property names
        const formattedData = (data || []).map(item => ({
          ...item,
          // Ensure consistent property naming (camelCase)
          id: item.id,
          title: item.title || 'Untitled Internship',
          department: item.department || 'General',
          location: item.location || 'Not specified',
          applicationDeadline: item.application_deadline || item.applicationDeadline,
          createdAt: item.created_at || item.createdAt || new Date().toISOString(), // Fix linter error by providing a default
          applicationFee: item.application_fee || item.applicationFee || 0,
          paymentRequired: item.payment_required !== undefined ? item.payment_required : item.paymentRequired || false
        }));
        
        setInternships(formattedData);
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
    } finally {
      setLoadingInternships(false);
    }
  };

  const handleInternshipCreate = () => {
    setShowCreateInternshipForm(true);
    setEditingInternship(null);
  };

  const handleInternshipEdit = (internship: Internship) => {
    setEditingInternship(internship);
    setShowCreateInternshipForm(true);
  };

  const handleInternshipCreateSuccess = () => {
    setShowCreateInternshipForm(false);
    setEditingInternship(null);
    fetchInternships();
  };

  const handleInternshipCreateCancel = () => {
    setShowCreateInternshipForm(false);
    setEditingInternship(null);
  };

  const deleteInternship = async (id: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting internship:', error);
        setError('Failed to delete internship: ' + error.message);
      } else {
        fetchInternships();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
    }
  };

  const toggleInternshipFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const { error } = await supabase
        .from('internships')
        .update({ featured: !currentFeatured })
        .eq('id', id);

      if (error) {
        console.error('Error updating internship featured status:', error);
        setError('Failed to update internship: ' + error.message);
      } else {
        fetchInternships();
      }
    } catch (error: any) {
      console.error('Unexpected error:', error);
      setError('An unexpected error occurred: ' + (error.message || 'Unknown error'));
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        alert('Failed to sign out. Please try again.');
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      console.error('Unexpected error during logout:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const exportInternshipsToCSV = () => {
    // Create CSV content
    const headers = ['Title', 'Department', 'Location', 'Application Fee', 'Duration', 'Remote', 'Featured', 'Deadline'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedInternships.map(intern => {
        return [
          `"${intern.title.replace(/"/g, '""')}"`,
          `"${intern.department.replace(/"/g, '""')}"`,
          `"${intern.location.replace(/"/g, '""')}"`,
          intern.paymentRequired ? `₹${intern.applicationFee}` : 'Free',
          `"${intern.duration}"`,
          intern.remote ? 'Yes' : 'No',
          intern.featured ? 'Yes' : 'No',
          new Date(intern.applicationDeadline).toLocaleDateString('en-IN')
        ].join(',');
      })
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `internships-export-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter internships based on search term and status filter
  const filteredAndSortedInternships = internships
    .filter(internship => {
      const matchesSearch = 
        internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        internship.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.location?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (!matchesSearch) return false;
      
      const deadline = new Date(internship.applicationDeadline);
      const isExpired = deadline < new Date();
      
      if (filterStatus === 'active' && isExpired) return false;
      if (filterStatus === 'expired' && !isExpired) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.applicationDeadline).getTime() - new Date(b.applicationDeadline).getTime();
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          // Fix linter error by ensuring createdAt is always a string
          const aCreatedAt = a.createdAt || new Date().toISOString();
          const bCreatedAt = b.createdAt || new Date().toISOString();
          return new Date(bCreatedAt).getTime() - new Date(aCreatedAt).getTime();
      }
    });

  if (showCreateInternshipForm) {
    return (
      <CreateInternshipForm 
        onSuccess={handleInternshipCreateSuccess} 
        onCancel={handleInternshipCreateCancel}
        internshipToEdit={editingInternship}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Manage Internships</h2>
        <div className="flex space-x-3 items-center">
          <button
            onClick={exportInternshipsToCSV}
            className="inline-flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            <Download size={16} className="mr-1.5" />
            Export
          </button>
          <button
            onClick={handleInternshipCreate}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
          >
            <Plus size={18} className="mr-1.5" />
            Add New Internship
          </button>
          
          {/* Admin Profile & Logout Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="inline-flex items-center px-3 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm font-medium rounded-md shadow-sm transition-colors"
            >
              <User size={16} className="mr-1.5" />
              Admin
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                  <User size={16} className="mr-2" />
                  Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Internships</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.total}</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-md">
              <BarChart2 size={20} className="text-blue-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.active}</p>
            </div>
            <div className="p-2 bg-green-100 rounded-md">
              <Clock size={20} className="text-green-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-red-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Expired</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.expired}</p>
            </div>
            <div className="p-2 bg-red-100 rounded-md">
              <AlertCircle size={20} className="text-red-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-purple-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">With Fee</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.withFee}</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-md">
              <BarChart2 size={20} className="text-purple-500" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4 border-l-4 border-yellow-500">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{statsData.featured}</p>
            </div>
            <div className="p-2 bg-yellow-100 rounded-md">
              <BarChart2 size={20} className="text-yellow-500" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md flex items-start">
          <AlertCircle size={20} className="text-red-500 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 font-medium">Error loading internships</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
            <button 
              onClick={fetchInternships} 
              className="text-red-700 font-medium text-sm underline mt-2"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {loadingInternships ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-grow w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search internships..."
                className="pl-10 py-2 px-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 sm:ml-auto w-full sm:w-auto">
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'expired')}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="expired">Expired Only</option>
              </select>
              
              <select
                className="border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'deadline' | 'title')}
              >
                <option value="newest">Newest First</option>
                <option value="deadline">By Deadline</option>
                <option value="title">By Title</option>
              </select>
            </div>
          </div>

          {filteredAndSortedInternships.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                      Fee
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deadline
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedInternships.map((internship) => {
                    const deadline = new Date(internship.applicationDeadline);
                    const isDeadlinePassed = deadline < new Date();
                    
                    return (
                      <tr key={internship.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {internship.title}
                              </div>
                              <div className="flex flex-wrap mt-1 gap-1">
                                {internship.featured && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Featured
                                  </span>
                                )}
                                {internship.remote && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                    Remote
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{internship.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                          <div className="text-sm text-gray-900">{internship.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                          <div className="text-sm text-gray-900">
                            {internship.paymentRequired 
                              ? `₹${internship.applicationFee}` 
                              : 'Free'
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm ${isDeadlinePassed ? 'text-red-600' : 'text-gray-900'}`}>
                            {new Date(internship.applicationDeadline).toLocaleDateString('en-IN')}
                            {isDeadlinePassed && 
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                Expired
                              </span>
                            }
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-3 justify-end">
                            <button
                              onClick={() => toggleInternshipFeatured(internship.id, !!internship.featured)}
                              className={`${internship.featured ? 'text-yellow-600 hover:text-yellow-800' : 'text-gray-600 hover:text-gray-800'}`}
                              title={internship.featured ? "Remove from featured" : "Mark as featured"}
                            >
                              {internship.featured ? 'Unfeature' : 'Feature'}
                            </button>
                            <Link
                              to={`/internships/${internship.id}`}
                              className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                              target="_blank"
                              title="View internship page"
                            >
                              <ExternalLink size={16} className="mr-1" />
                              View
                            </Link>
                            <button
                              onClick={() => handleInternshipEdit(internship)}
                              className="text-indigo-600 hover:text-indigo-900 inline-flex items-center"
                              title="Edit internship"
                            >
                              <Edit size={16} className="mr-1" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteInternship(internship.id)}
                              className="text-red-600 hover:text-red-900 inline-flex items-center"
                              title="Delete internship"
                            >
                              <Trash2 size={16} className="mr-1" />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all'
                  ? 'No internships match your search criteria.' 
                  : 'No internships have been created yet.'
                }
              </p>
              <button
                onClick={handleInternshipCreate}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors"
              >
                <Plus size={18} className="mr-1.5" />
                Add New Internship
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminInternships; 