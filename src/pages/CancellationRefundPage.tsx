import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import PageHealthCheck from '../components/PageHealthCheck';

const CancellationRefundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <PageHealthCheck />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6">
          <ArrowLeft size={18} className="mr-2" /> Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Cancellation and Refund Policy</h1>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Last Updated: {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>

              <p className="mb-4">
                This Cancellation and Refund Policy outlines the terms and conditions regarding cancellations and refunds for services provided by {companyInfo.name}. We are committed to fair and transparent business practices, and this policy is designed to clarify our procedures regarding refunds and cancellations.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Internship Application Fees</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Refund Eligibility</h3>
              <p className="mb-4">
                Application fees for internships are generally non-refundable once the application has been submitted and processed. However, refunds may be considered in the following circumstances:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>The internship program is cancelled by {companyInfo.name} before its commencement.</li>
                <li>Technical issues prevented the completion of your application, and our support team confirms the issue.</li>
                <li>Double payment or overcharging occurred due to a technical error on our platform.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Refund Process</h3>
              <p className="mb-4">
                To request a refund, please contact our support team at {companyInfo.contact?.email || 'contact@atlanticenterprise.in'} with your application details and the reason for your refund request. All refund requests will be reviewed on a case-by-case basis.
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Refund requests must be submitted within 7 days of the payment date.</li>
                <li>Approved refunds will be processed within 7-10 business days.</li>
                <li>Refunds will be issued using the same payment method used for the original transaction.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Product and Service Cancellations</h2>
              
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Subscription Services</h3>
              <p className="mb-4">
                For subscription-based services:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>You may cancel your subscription at any time through your account settings or by contacting our customer support.</li>
                <li>Cancellations will take effect at the end of the current billing cycle.</li>
                <li>No partial refunds are provided for unused portions of the current billing cycle.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Custom Projects and Consultations</h3>
              <p className="mb-4">
                For custom projects, consultations, or other tailored services:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Cancellations made more than 48 hours before a scheduled consultation may receive a full refund.</li>
                <li>Cancellations made less than 48 hours before a scheduled consultation may be subject to a cancellation fee of up to 50% of the service cost.</li>
                <li>For ongoing projects, cancellation terms will be specified in your service contract.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Product Purchases</h2>
              <p className="mb-4">
                For physical or digital products:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-4">
                <li>Physical products may be returned within 14 days of delivery if they are in their original condition.</li>
                <li>Digital products and downloads are generally non-refundable once access has been provided.</li>
                <li>Defective products will be replaced or refunded at our discretion.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Force Majeure</h2>
              <p className="mb-4">
                {companyInfo.name} is not liable for any failure to perform due to unforeseen circumstances or causes beyond our reasonable control, including but not limited to acts of nature, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, network infrastructure failures, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Changes to This Policy</h2>
              <p className="mb-4">
                We reserve the right to modify this Cancellation and Refund Policy at any time. Changes and clarifications will take effect immediately upon posting on the website. We encourage customers to check this page periodically for updates.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact Information</h2>
              <p className="mb-4">
                If you have any questions about our Cancellation and Refund Policy, please contact us at:
              </p>
              <p className="mb-4">
                Email: {companyInfo.contact?.email || 'atlanticenterprise7@gmail.com'}<br />
                Phone: {companyInfo.contact?.phone || '7666906951'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationRefundPage; 