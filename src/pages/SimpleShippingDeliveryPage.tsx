import React from 'react';
import { Link } from 'react-router-dom';

const SimpleShippingDeliveryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="text-blue-600 hover:underline mb-6 block">
          &larr; Back to Home
        </Link>
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-6">Shipping and Delivery Policy</h1>
          
          <div className="prose">
            <p>Last Updated: {new Date().toLocaleDateString()}</p>
            
            <p className="my-4">
              ATLANTIC ENTERPRISE is committed to providing efficient and reliable shipping and delivery services for all our products.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Shipping Methods and Delivery Times</h2>
            <h3 className="text-lg font-medium mt-4 mb-2">Domestic Shipping (Within India)</h3>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li><strong>Standard Shipping:</strong> 3-5 business days</li>
              <li><strong>Express Shipping:</strong> 1-2 business days</li>
              <li><strong>Free Shipping:</strong> Available on orders above ₹5,000</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Order Processing</h2>
            <p>
              All orders are processed within 1-2 business days (Monday to Friday, excluding holidays) after payment confirmation.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Contact Information</h2>
            <p>
              Email: contact@atlanticenterprise.in<br />
              Phone: +91 7666906951<br />
              Hours: Monday - Friday, 9:00 AM - 6:00 PM IST
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleShippingDeliveryPage; 