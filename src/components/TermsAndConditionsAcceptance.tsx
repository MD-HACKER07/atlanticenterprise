import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

interface TermsAndConditionsAcceptanceProps {
  terms: string[];
  accepted: boolean;
  onAcceptChange: (accepted: boolean) => void;
  error?: string;
}

const TermsAndConditionsAcceptance: React.FC<TermsAndConditionsAcceptanceProps> = ({
  terms,
  accepted,
  onAcceptChange,
  error
}) => {
  if (!terms || terms.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Terms and Conditions</h3>
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
        <ul className="list-decimal pl-5 space-y-2 text-gray-700">
          {terms.map((term, index) => (
            <li key={index}>{term}</li>
          ))}
        </ul>
      </div>
      
      <div className="mb-2">
        <label className="flex items-start">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => onAcceptChange(e.target.checked)}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
          />
          <span className="ml-3 text-gray-700">
            I have read and agree to the terms and conditions
          </span>
        </label>
      </div>
      
      {error && (
        <div className="text-red-600 flex items-center text-sm mt-1">
          <AlertCircle size={16} className="mr-1" />
          {error}
        </div>
      )}
      
      {accepted && (
        <div className="bg-green-50 p-3 rounded-md mt-3 flex items-center">
          <Check size={20} className="text-green-600 mr-2" />
          <span className="text-green-700">Thank you for accepting the terms and conditions</span>
        </div>
      )}
    </div>
  );
};

export default TermsAndConditionsAcceptance; 