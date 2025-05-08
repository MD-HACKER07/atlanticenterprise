import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle, Clock, XCircle, FileText, Search, 
  User, BookOpen, Settings, LogOut, Home, Filter,
  Shield
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// Dummy applications data for demo purposes
const applications = [
  {
    id: '1',
    internshipId: '1',
    internshipTitle: 'Frontend Developer Intern',
    company: 'InternHub',
    appliedDate: '2025-05-10',
    status: 'pending',
    statusText: 'Application under review'
  },
  {
    id: '2',
    internshipId: '3',
    internshipTitle: 'UI/UX Design Intern',
    company: 'InternHub',
    appliedDate: '2025-05-08',
    status: 'accepted',
    statusText: 'Interview scheduled for May 20, 2025'
  },
  {
    id: '3',
    internshipId: '2',
    internshipTitle: 'Backend Developer Intern',
    company: 'InternHub',
    appliedDate: '2025-05-05',
    status: 'rejected',
    statusText: 'Thank you for your application. We have decided to move forward with other candidates.'
  }
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { logout, isAdmin, user } = useAuth();
  
  // Filter applications based on status and search term
  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch = app.internshipTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get counts for each status
  const counts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    accepted: applications.filter(app => app.status === 'accepted').length,
    rejected: applications.filter(app => app.status === 'rejected').length
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Function to render the status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle size={12} className="mr-1" />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="md:w-64 bg-white rounded-lg shadow-md p-6 h-fit">
            <div className="flex items-center space-x-3 mb-8">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">{user?.name || 'John Doe'}</h2>
                <p className="text-sm text-gray-500">{user?.email || 'john.doe@example.com'}</p>
                {isAdmin && (
                  <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    <Shield size={10} className="mr-1" />
                    Admin
                  </span>
                )}
              </div>
            </div>
            
            <nav className="space-y-1">
              <Link 
                to="/"
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <Home size={18} className="mr-3" />
                Home
              </Link>
              <button 
                onClick={() => setActiveTab('applications')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'applications' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <FileText size={18} className="mr-3" />
                My Applications
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'profile' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <User size={18} className="mr-3" />
                Profile
              </button>
              <button 
                onClick={() => setActiveTab('resources')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'resources' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <BookOpen size={18} className="mr-3" />
                Resources
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'settings' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                <Settings size={18} className="mr-3" />
                Settings
              </button>
              
              {isAdmin && (
                <Link 
                  to="/admin"
                  className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50"
                >
                  <Shield size={18} className="mr-3" />
                  Admin Dashboard
                </Link>
              )}
              
              <Link 
                to="/login"
                onClick={() => logout()}
                className="flex items-center px-3 py-2 text-sm font-medium rounded-md text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} className="mr-3" />
                Logout
              </Link>
            </nav>
          </div>
          
          {/* Main content */}
          <div className="flex-1">
            {activeTab === 'applications' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h1 className="text-xl font-semibold text-gray-900">My Applications</h1>
                </div>
                
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          statusFilter === 'all' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        All ({counts.all})
                      </button>
                      <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          statusFilter === 'pending' 
                            ? 'bg-yellow-100 text-yellow-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Pending ({counts.pending})
                      </button>
                      <button
                        onClick={() => setStatusFilter('accepted')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          statusFilter === 'accepted' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Accepted ({counts.accepted})
                      </button>
                      <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          statusFilter === 'rejected' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Rejected ({counts.rejected})
                      </button>
                    </div>
                    
                    <div className="w-full sm:w-auto relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Search applications..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                {filteredApplications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {filteredApplications.map(application => (
                      <div key={application.id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between">
                          <div>
                            <div className="flex items-start">
                              <h3 className="text-lg font-medium text-gray-900 mr-3">{application.internshipTitle}</h3>
                              {renderStatusBadge(application.status)}
                            </div>
                            <p className="text-gray-600 text-sm">{application.company}</p>
                            <p className="text-gray-500 text-sm mt-1">
                              Applied on {formatDate(application.appliedDate)}
                            </p>
                          </div>
                          <div className="mt-3 sm:mt-0">
                            <Link
                              to={`/internships/${application.internshipId}`}
                              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              View Internship
                            </Link>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-700">{application.statusText}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-12 text-center">
                    <p className="text-gray-500 mb-4">No applications found matching your filters.</p>
                    <Link
                      to="/internships"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Internships
                    </Link>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
                </div>
                <div className="p-6">
                  <p className="text-gray-500">Your profile information would appear here.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'resources' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h1 className="text-xl font-semibold text-gray-900">Learning Resources</h1>
                </div>
                <div className="p-6">
                  <p className="text-gray-500">Career resources and learning materials would appear here.</p>
                </div>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="border-b border-gray-200 px-6 py-4">
                  <h1 className="text-xl font-semibold text-gray-900">Account Settings</h1>
                </div>
                <div className="p-6">
                  <p className="text-gray-500">Your account settings would appear here.</p>
                </div>
              </div>
            )}
            
            {/* Recommended Internships */}
            <div className="mt-8 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">Recommended for You</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900">Data Science Intern</h3>
                    <p className="text-sm text-gray-600 mt-1">InternHub</p>
                    <div className="flex space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Data Science
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Remote
                      </span>
                    </div>
                    <div className="mt-3">
                      <Link 
                        to="/internships" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-md p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-medium text-gray-900">Product Management Intern</h3>
                    <p className="text-sm text-gray-600 mt-1">InternHub</p>
                    <div className="flex space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        Management
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                        Hybrid
                      </span>
                    </div>
                    <div className="mt-3">
                      <Link 
                        to="/internships" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                  <Link
                    to="/internships"
                    className="inline-block text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View all internships
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;