import React from 'react';
import { Link } from 'react-router-dom';

const SimpleCancellationRefundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="text-blue-600 hover:underline mb-6 block">
          &larr; Back to Home
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Cancellation and Refund Policy</h1>
          
          <div className="prose">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <p className="my-4">
              This policy outlines our approach to cancellations and refunds. We are committed to fair treatment of all our customers.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Internship Application Fees</h2>
            <p>
              Application fees for internships are generally non-refundable once the application has been submitted and processed. However, refunds may be considered in certain circumstances.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Refund Process</h2>
            <p>
              To request a refund, please contact our support team with your application details and the reason for your refund request.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Information</h2>
            <p>
              Email: contact@atlanticenterprise.in<br />
              Phone: +91 7666906951
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCancellationRefundPage; 