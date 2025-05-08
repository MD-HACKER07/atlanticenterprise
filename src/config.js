/**
 * Application Configuration
 * This file reads environment variables and provides a centralized configuration
 */

// Environment detection
const isProduction = import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production';

// Read environment variables with fallbacks
const getEnvVar = (key, fallback) => {
  const envKey = `VITE_${key}`;
  return import.meta.env[envKey] || fallback;
};

// API URLs
const API_URL = isProduction 
  ? getEnvVar('API_URL', 'https://api.atlanticenterprise.in')
  : getEnvVar('API_URL', '/api');

// Supabase config
const SUPABASE_URL = getEnvVar('SUPABASE_URL', 'https://cblvrevilzovvcwpjzee.supabase.co');
const SUPABASE_KEY = getEnvVar('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNibHZyZXZpbHpvdnZjd3BqemVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMzMwOTksImV4cCI6MjA2MTcwOTA5OX0.R19QR2eZqn1qX57Rumh6A8UYU0MkkQcgfJK95PgjAhI');

// Razorpay
const RAZORPAY_KEY_ID = getEnvVar('RAZORPAY_KEY_ID', 'rzp_test_rg235BX8eobmVD');

// Company Information
const COMPANY_INFO = {
  name: getEnvVar('COMPANY_NAME', 'Atlantic Enterprise'),
  domain: getEnvVar('COMPANY_DOMAIN', 'atlanticenterprise.in'),
  email: getEnvVar('COMPANY_EMAIL', 'info@atlanticenterprise.in'),
  phone: getEnvVar('COMPANY_PHONE', '+91 20 2547 xxxx'),
  address: getEnvVar('COMPANY_ADDRESS', 'Pune, Maharashtra, India')
};

// Feature flags
const FEATURES = {
  enablePayment: getEnvVar('ENABLE_PAYMENT', 'true') === 'true',
  enableInternships: getEnvVar('ENABLE_INTERNSHIPS', 'true') === 'true',
  enableAdminPanel: getEnvVar('ENABLE_ADMIN_PANEL', 'true') === 'true'
};

// Social media links
const SOCIAL_MEDIA = {
  linkedin: 'https://linkedin.com/company/atlantic-enterprise',
  twitter: 'https://twitter.com/atlanticent',
  instagram: 'https://instagram.com/atlanticenterprise'
};

// Export configuration
const config = {
  isProduction,
  apiUrl: API_URL,
  supabase: {
    url: SUPABASE_URL,
    key: SUPABASE_KEY
  },
  razorpay: {
    keyId: RAZORPAY_KEY_ID
  },
  company: COMPANY_INFO,
  features: FEATURES,
  social: SOCIAL_MEDIA
};

export default config; 