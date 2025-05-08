import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, ArrowLeft, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

// The admin code is now only stored in the database
const SecretVerification: React.FC = () => {
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showCode, setShowCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const navigate = useNavigate();

  // Check database connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('system_settings')
          .select('setting_value')
          .eq('setting_key', 'admin_access_code')
          .single();
          
        if (error) {
          console.error('Database connection error:', error);
          setDbStatus('error');
        } else {
          console.log('Database connection successful');
          setDbStatus('connected');
        }
      } catch (err) {
        console.error('Database connection check failed:', err);
        setDbStatus('error');
      }
    };
    
    checkConnection();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    if (!secretCode.trim()) {
      setError('Please enter a secret code');
      setIsVerifying(false);
      return;
    }

    try {
      // First approach: Use the database function to verify the code
      const { data, error: functionError } = await supabase.rpc('verify_admin_access_code', {
        input_code: secretCode
      });

      // Log detailed error information for debugging
      if (functionError) {
        console.error('Error verifying code with function:', functionError);
        
        // Fallback approach: Direct query to the settings table
        const { data: settingsData, error: settingsError } = await supabase
          .from('system_settings')
          .select('setting_value')
          .eq('setting_key', 'admin_access_code')
          .single();

        if (settingsError) {
          console.error('Error fetching secret code:', settingsError);
          throw new Error('Verification failed. Please try again.');
        }

        // Check if code matches
        if (settingsData && secretCode === settingsData.setting_value) {
          console.log('Verification successful via direct settings table check');
          // Valid code - store verification and navigate to login
          sessionStorage.setItem('accessVerified', 'true');
          navigate('/login');
          return;
        } else {
          throw new Error('Invalid access code. Please try again.');
        }
      }

      // If function worked and returned true, code is valid
      if (data === true) {
        console.log('Verification successful via RPC function');
        sessionStorage.setItem('accessVerified', 'true');
        navigate('/login');
      } else {
        console.log('RPC function returned false:', data);
        throw new Error('Invalid access code. Please try again.');
      }
    } catch (err) {
      console.error('Verification error details:', err);
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Link to="/" className="flex items-center text-blue-600 hover:text-blue-800 mb-6 group">
          <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to home
        </Link>
        
        <div className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-5">
              <Shield size={28} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Secure Access</h1>
            <p className="mt-2 text-gray-600">
              Enter the access code to continue to the admin portal
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleVerify}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="secret-code" className="block text-sm font-medium text-gray-700 mb-1">
                Access Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="secret-code"
                  type={showCode ? 'text' : 'password'}
                  value={secretCode}
                  onChange={(e) => setSecretCode(e.target.value)}
                  className="block w-full pl-11 pr-10 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter access code"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowCode(!showCode)}
                >
                  {showCode ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            
            <div>
              <button
                type="submit"
                disabled={isVerifying}
                className={`${
                  isVerifying 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
              >
                {isVerifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Continue to Login'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SecretVerification; 