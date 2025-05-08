import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Truck, Clock, Globe, AlertTriangle } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import PageHealthCheck from '../components/PageHealthCheck';

const ShippingDeliveryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <PageHealthCheck />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6">
          <ArrowLeft size={18} className="mr-2" /> Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Shipping and Delivery Policy</h1>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Last Updated: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <p className="mb-4">
                {companyInfo.name} is committed to providing efficient and reliable shipping and delivery services for all our products. This page outlines our shipping methods, delivery timeframes, and related policies.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex">
                  <div className="mr-4 text-blue-600">
                    <Truck size={36} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Domestic Shipping</h3>
                    <p className="text-sm text-gray-700">
                      We ship throughout India using trusted courier partners to ensure your products arrive safely and on time.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex">
                  <div className="mr-4 text-blue-600">
                    <Globe size={36} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">International Shipping</h3>
                    <p className="text-sm text-gray-700">
                      We offer international shipping to select countries with appropriate customs documentation included.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex">
                  <div className="mr-4 text-blue-600">
                    <Clock size={36} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Processing Time</h3>
                    <p className="text-sm text-gray-700">
                      Orders are typically processed within 1-2 business days before being handed over to our shipping partners.
                    </p>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex">
                  <div className="mr-4 text-blue-600">
                    <AlertTriangle size={36} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-800 mb-1">Order Tracking</h3>
                    <p className="text-sm text-gray-700">
                      All orders include tracking information so you can monitor your shipment's progress in real-time.
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Shipping Methods and Delivery Times</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Domestic Shipping (Within India)</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Standard Shipping:</strong> 3-5 business days (₹100 - ₹300 depending on location and package weight)</li>
                <li><strong>Express Shipping:</strong> 1-2 business days (₹300 - ₹600 depending on location and package weight)</li>
                <li><strong>Free Shipping:</strong> Available on orders above ₹5,000 (Standard Shipping only)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">International Shipping</h3>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li><strong>Standard International:</strong> 7-14 business days (rates vary by country)</li>
                <li><strong>Express International:</strong> 3-5 business days (rates vary by country)</li>
              </ul>
              
              <p className="text-sm bg-yellow-50 p-3 rounded-md border border-yellow-100 mb-4">
                <strong>Note:</strong> International shipments may be subject to customs duties and taxes levied by the destination country. These charges are the responsibility of the recipient and are not included in our shipping fees.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Order Processing</h2>
              <p className="mb-4">
                All orders are processed within 1-2 business days (Monday to Friday, excluding holidays) after payment confirmation. Once your order has been processed and shipped, you will receive a confirmation email with tracking information.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Shipping Restrictions</h2>
              <p className="mb-4">
                We currently ship to most locations within India and select international destinations. However, there may be restrictions for certain remote areas or regions with limited courier service availability.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Lost or Damaged Shipments</h2>
              <p className="mb-4">
                In the unlikely event that your package is lost or damaged during transit:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Please contact our customer service team within 48 hours of the expected delivery date.</li>
                <li>We will initiate an investigation with the shipping carrier.</li>
                <li>Depending on the outcome, we will arrange for a replacement shipment or issue a refund.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Digital Product Delivery</h2>
              <p className="mb-4">
                For digital products and software:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Delivery is instantaneous via email or through your account dashboard after payment confirmation.</li>
                <li>Download links will remain active for a period of 30 days.</li>
                <li>If you do not receive your digital product within 24 hours of purchase, please check your spam folder before contacting customer support.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact Information</h2>
              <p className="mb-4">
                If you have any questions about our shipping and delivery policies, please contact our customer service team:
              </p>
              <p className="mb-4">
                Email: {companyInfo.contact?.email || 'atlanticenterprise7@gmail.com'}<br />
                Phone: {companyInfo.contact?.phone || '7666906951'}<br />
                Hours: Monday - Friday, 9:00 AM - 6:00 PM IST
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDeliveryPage; 