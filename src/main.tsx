import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import SecureLoginRoute from './components/SecureLoginRoute';
import SecretVerification from './components/SecretVerification';
import AdminAccessCodeTest from './components/AdminAccessCodeTest';
import AdminProfile from './components/AdminProfile';
import App from './App';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRegisterPage from './pages/AdminRegisterPage';
import AdminPromotionPage from './pages/AdminPromotionPage';
import InternshipsPage from './pages/InternshipsPage';
import InternshipDetailPage from './pages/InternshipDetailPage';
import InternshipFAQPage from './pages/InternshipFAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsAndConditionsPage from './pages/TermsAndConditionsPage';
import ContactPage from './pages/ContactPage';
import ReviewsPage from './pages/ReviewsPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import TestPage from './pages/TestPage';
import LearnMorePage from './pages/LearnMorePage';
import NotFoundPage from './pages/NotFoundPage';
import LegalInfoPage from './pages/LegalInfoPage';
import VerifyCertificate from './pages/VerifyCertificate';
import { preventPageRefresh, setupPageStateHandlers } from './utils/browserUtils';
import { ensureResumesBucketExists } from './lib/supabase';
import './index.css';

// Initialize page refresh prevention and state handlers
preventPageRefresh();
setupPageStateHandlers();

// Initialize storage bucket for resumes
ensureResumesBucketExists()
  .then(success => {
    if (success) {
      console.log('Resume storage bucket initialized successfully');
    } else {
      console.warn('Failed to initialize resume storage bucket');
    }
  })
  .catch(error => {
    console.error('Error initializing resume storage bucket:', error);
  });

// Application component to wrap the entire app
const Application = () => {
  // Setup effect to handle page state
  useEffect(() => {
    // Add an event listener to detect when page visibility changes
    const handleVisibilityChange = () => {
      // Dispatch a custom event to trigger form data restoration
      if (document.visibilityState === 'visible') {
        window.dispatchEvent(new CustomEvent('form-restore'));
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Add event listener for page show event (used in browsers that leverage back/forward cache)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // The page was restored from cache, trigger form restoration
        window.dispatchEvent(new CustomEvent('form-restore'));
      }
    };
    
    window.addEventListener('pageshow', handlePageShow);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, []);
  
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<App />} />
          
          {/* Public routes */}
          <Route path="/internships" element={<InternshipsPage />} />
          <Route path="/internships/:id" element={<InternshipDetailPage />} />
          <Route path="/internship-faq" element={<InternshipFAQPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/learn-more" element={<LearnMorePage />} />
          <Route path="/legal" element={<LegalInfoPage />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          
          {/* Secret verification route before accessing login */}
          <Route path="/verify-access" element={<SecretVerification />} />
          
          {/* Admin registration route - Disabled */}
          {/* <Route path="/admin-register" element={<AdminRegisterPage />} /> */}
          
          {/* Protected login route that requires secret verification first */}
          <Route 
            path="/login" 
            element={
              <SecureLoginRoute>
                <LoginPage />
              </SecureLoginRoute>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Profile Route */}
          <Route 
            path="/admin/profile" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminProfile />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Promotion Settings Route */}
          <Route 
            path="/admin/promotion" 
            element={
              <ProtectedRoute requireAdmin>
                <AdminPromotionPage />
              </ProtectedRoute>
            } 
          />
          
          {/* DEV ONLY: Route for testing admin access code verification */}
          {import.meta.env.DEV && (
            <Route path="/dev/test-admin-code" element={<AdminAccessCodeTest />} />
          )}
          
          {/* Catch all route - show 404 page instead of redirecting */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Application />
    </React.StrictMode>
  );
} else {
  console.error('Failed to find root element');
}
