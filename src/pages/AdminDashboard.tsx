import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, BarChart, FilePlus, Settings, Bell, 
  Search, LogOut, LayoutDashboard, User, Calendar,
  Menu, X, Shield, Home, FileText, Database, Plus, ArrowRight, Tag, Clock, Timer, BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import AdminInternships from '../components/AdminInternships';
import AdminBlogManager from '../components/AdminBlogManager';
import CouponManager from '../components/CouponManager';
import ApplicationManager from '../components/ApplicationManager';
import { companyInfo as initialCompanyInfo } from '../data/companyInfo';
import CountdownTimer from '../components/CountdownTimer';
import { getPromotionSettings } from '../utils/settingsUtils';

// Mock data for users
const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinedDate: '2023-05-15' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'active', joinedDate: '2023-06-20' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'user', status: 'inactive', joinedDate: '2023-07-10' },
  { id: '4', name: 'Sarah Brown', email: 'sarah@example.com', role: 'user', status: 'active', joinedDate: '2023-08-01' },
  { id: '5', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joinedDate: '2023-01-01' },
];

// Activity feed data
const activityFeed = [
  { id: '1', user: 'John Doe', action: 'applied for', target: 'Frontend Developer Intern', time: '2 hours ago' },
  { id: '2', user: 'Admin User', action: 'posted', target: 'UI/UX Design Intern', time: '1 day ago' },
  { id: '3', user: 'Jane Smith', action: 'updated profile', target: '', time: '2 days ago' },
  { id: '4', user: 'Mike Johnson', action: 'completed', target: 'registration', time: '3 days ago' },
  { id: '5', user: 'Sarah Brown', action: 'submitted application for', target: 'Marketing Intern', time: '5 days ago' },
];

// Dashboard stats
const stats = [
  { id: '1', name: 'Total Users', value: '145', change: '+12.3%', icon: <Users size={20} /> },
  { id: '2', name: 'Active Internships', value: '8', change: '+4.6%', icon: <Calendar size={20} /> },
  { id: '3', name: 'Applications', value: '324', change: '+24.8%', icon: <FilePlus size={20} /> },
  { id: '4', name: 'Completion Rate', value: '68%', change: '+2.4%', icon: <BarChart size={20} /> },
];

const AdminDashboard: React.FC = () => {
  // Get initial tab from session storage if available
  const getInitialTab = () => {
    try {
      const savedTab = sessionStorage.getItem('adminActiveTab');
      if (savedTab) {
        // Convert the saved tab name to the expected type
        const validTabs = ['dashboard', 'users', 'internships', 'applications', 'coupons', 'analytics', 'settings', 'database', 'promotions', 'blog'];
        const normalizedTab = savedTab.toLowerCase().trim();
        
        // Find the matching tab
        const matchedTab = validTabs.find(tab => 
          normalizedTab.includes(tab) || tab.includes(normalizedTab)
        );
        
        if (matchedTab) {
          return matchedTab as 'dashboard' | 'users' | 'internships' | 'applications' | 'coupons' | 'analytics' | 'settings' | 'database' | 'promotions' | 'blog';
        }
      }
      
      return 'internships'; // Default tab
    } catch (e) {
      console.error('Error getting initial tab:', e);
      return 'internships';
    }
  };
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'internships' | 'applications' | 'coupons' | 'analytics' | 'settings' | 'database' | 'promotions' | 'blog'>(getInitialTab);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Ref to track if component is mounted
  const isMounted = useRef(true);
  
  // Anti-refresh protections
  useEffect(() => {
    // Function to prevent reload/refresh
    const preventRefresh = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
      return '';
    };
    
    // Function to handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isMounted.current) {
        // Restore active tab and other state when tab becomes visible
        const savedTab = sessionStorage.getItem('adminActiveTab');
        if (savedTab) {
          // Find the button with this text and simulate a click
          const tabButtons = document.querySelectorAll('button');
          for (const button of tabButtons) {
            if (button.textContent?.trim().toLowerCase().includes(savedTab.toLowerCase())) {
              // Don't actually click - just restore the state
              const validTabs = ['dashboard', 'users', 'internships', 'applications', 'coupons', 'analytics', 'settings', 'database', 'promotions', 'blog'];
              const matchedTab = validTabs.find(tab => 
                savedTab.toLowerCase().includes(tab) || tab.includes(savedTab.toLowerCase())
              );
              
              if (matchedTab) {
                setActiveTab(matchedTab as any);
              }
              break;
            }
          }
        }
      }
    };
    
    // Save active tab whenever it changes
    const saveActiveTab = () => {
      try {
        sessionStorage.setItem('adminActiveTab', activeTab);
      } catch (e) {
        console.error('Error saving active tab:', e);
      }
    };
    
    // Add event listeners
    window.addEventListener('beforeunload', preventRefresh);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Save initial tab state
    saveActiveTab();
    
    // Clean up
    return () => {
      isMounted.current = false;
      window.removeEventListener('beforeunload', preventRefresh);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  
  // Save active tab whenever it changes
  useEffect(() => {
    if (isMounted.current) {
      try {
        sessionStorage.setItem('adminActiveTab', activeTab);
        // Also save to localStorage as a backup
        localStorage.setItem('adminActiveTab', activeTab);
      } catch (e) {
        console.error('Error saving active tab:', e);
      }
    }
  }, [activeTab]);
  
  useEffect(() => {
    const loadPromotionSettings = async () => {
      try {
        const promotionSettings = await getPromotionSettings();
        // Update companyInfo with the promotion settings from the database
        if (isMounted.current) {
          setCompanyInfo(prevInfo => ({
            ...prevInfo,
            promotion: promotionSettings
          }));
        }
      } catch (error) {
        console.error('Failed to load promotion settings:', error);
      }
    };
    
    loadPromotionSettings();
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Wrap tab change function to ensure it's saved
  const handleTabChange = (tab: 'dashboard' | 'users' | 'internships' | 'applications' | 'coupons' | 'analytics' | 'settings' | 'database' | 'promotions' | 'blog') => {
    setActiveTab(tab);
    try {
      sessionStorage.setItem('adminActiveTab', tab);
      localStorage.setItem('adminActiveTab', tab);
    } catch (e) {
      console.error('Error saving tab state:', e);
    }
  };

  // Filter users based on search term
  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Simple tab renderers
  const renderDashboardTab = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">{stat.icon}</div>
              <span className={`text-sm font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.name}</p>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {activityFeed.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex items-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User size={18} />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {activity.user} {activity.action} {activity.target}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Promotion Timer Preview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Promotion Timer Status</h2>
              <Link 
                to="/admin/promotion"
                className="text-sm flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <Settings size={16} className="mr-1" />
                Manage Timer
              </Link>
            </div>
            
            {companyInfo.promotion?.enabled ? (
              <div className="bg-blue-700 rounded-lg overflow-hidden text-white p-4">
                <CountdownTimer 
                  targetDate={companyInfo.promotion.deadline}
                  message={companyInfo.promotion.message}
                  className="w-full"
                />
                <div className="mt-3 text-xs text-white/80">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-semibold text-green-300">Active</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Deadline:</span>
                    <span className="font-semibold">{new Date(companyInfo.promotion.deadline).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-200 p-4 rounded-md text-gray-500 text-center">
                <div className="flex flex-col items-center justify-center py-4">
                  <Clock size={32} className="text-gray-400 mb-2" />
                  <p className="mb-3">Promotion timer is currently disabled</p>
                  <Link
                    to="/admin/promotion"
                    className="btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium"
                  >
                    Enable Timer
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setActiveTab('internships')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-left px-4 py-3 rounded-lg flex items-center text-gray-700 transition-colors"
              >
                <Plus size={18} className="mr-3 text-blue-600" />
                Create New Internship
              </button>
              <Link 
                to="/admin/promotion"
                className="w-full bg-gray-50 hover:bg-gray-100 text-left px-4 py-3 rounded-lg flex items-center text-gray-700 transition-colors"
              >
                <Clock size={18} className="mr-3 text-blue-600" />
                Manage Promotion Timer
              </Link>
              <button 
                onClick={() => setActiveTab('applications')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-left px-4 py-3 rounded-lg flex items-center text-gray-700 transition-colors"
              >
                <FilePlus size={18} className="mr-3 text-green-600" />
                Review Applications
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className="w-full bg-gray-50 hover:bg-gray-100 text-left px-4 py-3 rounded-lg flex items-center text-gray-700 transition-colors"
              >
                <Users size={18} className="mr-3 text-amber-600" />
                Manage Users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 py-2 px-4 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="p-6 text-center">
          <p className="text-gray-500">User management is coming soon.</p>
        </div>
      </div>
    </div>
  );

  const renderApplicationsTab = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Application Management</h1>
      <ApplicationManager />
    </div>
  );

  const renderSettingsTab = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">System Settings</h1>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">Settings functionality is coming soon.</p>
      </div>
    </div>
  );

  const renderDatabaseTab = () => (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Database Management</h1>
      <div className="bg-white shadow rounded-lg p-6 text-center">
        <p className="text-gray-500">Database management functionality is coming soon.</p>
      </div>
    </div>
  );

  // Add new Promotions Tab
  const renderPromotionsTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Promotion Management</h1>
        <Link 
          to="/admin/promotion"
          className="btn px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center"
        >
          <Settings size={16} className="mr-2" />
          Configure Timer
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Countdown Timer Preview</h2>
          <div className="border p-4 rounded-lg bg-gray-50">
            {companyInfo.promotion?.enabled ? (
              <div className="bg-blue-700 rounded-lg overflow-hidden text-white p-5">
                <CountdownTimer 
                  targetDate={companyInfo.promotion.deadline}
                  message={companyInfo.promotion.message}
                  className="w-full"
                />
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-200 p-4 rounded-md text-gray-500 text-center">
                <p>Promotion timer is currently disabled</p>
              </div>
            )}
          </div>
          
          <div className="mt-4">
            <h3 className="text-md font-medium text-gray-900 mb-2">Current Settings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${companyInfo.promotion?.enabled ? 'text-green-600' : 'text-red-600'}`}>
                  {companyInfo.promotion?.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>
              
              {companyInfo.promotion?.enabled && (
                <>
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Message:</span>
                    <span className="font-medium text-gray-800">{companyInfo.promotion.message}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(companyInfo.promotion.deadline).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-gray-600">Action Button:</span>
                    <span className="font-medium text-gray-800">
                      {companyInfo.promotion.ctaText || 'None'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Promotion Timer Actions</h2>
          
          <div className="space-y-4">
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-2">Timer Management</h3>
              <p className="text-sm text-gray-600 mb-4">
                Configure the promotion timer that appears on your website. Set a deadline, message, and call-to-action.
              </p>
              <Link
                to="/admin/promotion"
                className="btn w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center justify-center"
              >
                <Clock size={18} className="mr-2" />
                Configure Timer Settings
              </Link>
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-2">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3 mt-3">
                {companyInfo.promotion?.enabled ? (
                  <Link
                    to="/admin/promotion"
                    className="btn px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <X size={16} className="mr-1" />
                    Disable
                  </Link>
                ) : (
                  <Link
                    to="/admin/promotion"
                    className="btn px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center justify-center"
                  >
                    <Clock size={16} className="mr-1" />
                    Enable
                  </Link>
                )}
                
                <Link
                  to="/admin/promotion"
                  className="btn px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <Calendar size={16} className="mr-1" />
                  Update Deadline
                </Link>
              </div>
            </div>
            
            <div className="p-4 border rounded-lg bg-gray-50">
              <h3 className="text-md font-medium text-gray-900 mb-2">Help</h3>
              <p className="text-sm text-gray-600 mb-2">
                The promotion timer helps create urgency and can boost conversion rates for special offers and 
                limited-time availability items.
              </p>
              <p className="text-sm text-gray-600">
                It appears prominently on your home page and can be customized to match your marketing campaigns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBlogTab = () => (
    <AdminBlogManager />
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardTab();
      case 'users':
        return renderUsersTab();
      case 'internships':
        return <AdminInternships />;
      case 'applications':
        return renderApplicationsTab();
      case 'coupons':
        return <CouponManager />;
      case 'analytics':
        return (
          <div className="text-center py-12 text-gray-500">
            <BarChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics Dashboard</h3>
            <p>Analytics features are coming soon.</p>
          </div>
        );
      case 'settings':
        return renderSettingsTab();
      case 'database':
        return renderDatabaseTab();
      case 'promotions':
        return renderPromotionsTab();
      case 'blog':
        return renderBlogTab();
      default:
        return renderDashboardTab();
    }
  };

  // Add wrapper functions for all tab buttons
  const tabClickHandlers = {
    dashboard: () => handleTabChange('dashboard'),
    users: () => handleTabChange('users'),
    internships: () => handleTabChange('internships'),
    applications: () => handleTabChange('applications'),
    coupons: () => handleTabChange('coupons'),
    analytics: () => handleTabChange('analytics'),
    settings: () => handleTabChange('settings'),
    database: () => handleTabChange('database'),
    promotions: () => handleTabChange('promotions'),
    blog: () => handleTabChange('blog')
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden mr-4 text-gray-500 hover:text-gray-700"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <h1 className="text-xl font-bold text-gray-800 flex items-center">
              <Shield size={24} className="mr-2 text-blue-600" />
              Admin Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <Bell size={20} />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                  <User size={18} />
                </div>
                <span className="hidden md:inline-block font-medium">Admin</span>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 w-48 mt-2 py-2 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</a>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex h-[calc(100vh-57px)]">
        {/* Sidebar */}
        <aside 
          className={`
            bg-white shadow-md z-20 fixed md:static inset-y-0 left-0 transform 
            ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 transition duration-200 ease-in-out
            w-64 h-full overflow-y-auto
          `}
        >
          <nav className="mt-5 px-4">
            <div className="space-y-4">
              <div>
                <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Main
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <button
                      onClick={tabClickHandlers.dashboard}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <LayoutDashboard size={18} className="mr-3" />
                      Dashboard
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.internships}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'internships' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Calendar size={18} className="mr-3" />
                      Internships
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.applications}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'applications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <FilePlus size={18} className="mr-3" />
                      Applications
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.blog}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'blog' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <BookOpen size={18} className="mr-3" />
                      Blog
                    </button>
                  </li>
                </ul>
              </div>
              
              {/* Existing sidebar items... */}
              <div>
                <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Management
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <button
                      onClick={tabClickHandlers.users}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'users' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Users size={18} className="mr-3" />
                      Users
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.coupons}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'coupons' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Tag size={18} className="mr-3" />
                      Coupon Codes
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.promotions}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'promotions' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Clock size={18} className="mr-3" />
                      Promotions
                    </button>
                  </li>
                </ul>
              </div>
              
              <div>
                <p className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  System
                </p>
                <ul className="mt-2 space-y-1">
                  <li>
                    <button
                      onClick={tabClickHandlers.analytics}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'analytics' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <BarChart size={18} className="mr-3" />
                      Analytics
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.settings}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'settings' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Settings size={18} className="mr-3" />
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={tabClickHandlers.database}
                      className={`w-full flex items-center px-2 py-2 rounded-md ${activeTab === 'database' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                      <Database size={18} className="mr-3" />
                      Database
                    </button>
                  </li>
                </ul>
              </div>
              
              <div className="pt-4">
                <div className="px-2 py-1">
                  <Link
                    to="/"
                    className="flex items-center px-2 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                  >
                    <Home size={18} className="mr-3" />
                    Back to Home
                  </Link>
                </div>
                <div className="px-2 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-red-600 hover:bg-red-50 rounded-md"
                  >
                    <LogOut size={18} className="mr-3" />
                    Log Out
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </aside>
        
        {/* Overlay */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 z-10 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          ></div>
        )}
        
        {/* Main content */}
        <main className="flex-1 p-4 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;