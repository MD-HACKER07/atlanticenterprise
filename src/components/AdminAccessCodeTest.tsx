import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { verifyAdminAccessCode } from '../utils/auth';

/**
 * This is a developer-only component to test the access code verification
 * DO NOT use in production
 */
const AdminAccessCodeTest: React.FC = () => {
  const [code, setCode] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [directResult, setDirectResult] = useState<any>(null);

  const handleVerify = async () => {
    setLoading(true);
    setResult(null);
    setDirectResult(null);
    
    try {
      // Test the utility function
      const isValid = await verifyAdminAccessCode(code);
      setResult(isValid ? 'Valid access code!' : 'Invalid access code!');
      
      // Also test direct DB access for troubleshooting
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('setting_key', 'admin_access_code')
        .single();
      
      setDirectResult({
        data,
        error,
        messageIfValid: data?.setting_value === code ? 'Direct match!' : 'No direct match',
        codeEntered: code,
        codeInDB: data?.setting_value
      });
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Admin Access Code Test (Dev Only)</h2>
      <p className="text-gray-500 mb-4">This is a developer-only component to test access code verification</p>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Test Access Code</label>
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter code to test"
        />
      </div>
      
      <button
        onClick={handleVerify}
        disabled={loading}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Verification'}
      </button>
      
      {result && (
        <div className={`mt-4 p-3 rounded ${result.includes('Valid') ? 'bg-green-100' : 'bg-red-100'}`}>
          <p className={result.includes('Valid') ? 'text-green-700' : 'text-red-700'}>
            {result}
          </p>
        </div>
      )}
      
      {directResult && (
        <div className="mt-4 p-3 bg-gray-100 rounded">
          <h3 className="font-bold">Direct Database Check:</h3>
          <pre className="text-xs mt-2 overflow-auto">
            {JSON.stringify(directResult, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminAccessCodeTest; 