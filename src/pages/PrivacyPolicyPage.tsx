import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6">
          <ArrowLeft size={18} className="mr-2" /> Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Last updated on May 2 2025
              </p>

              <p className="mb-6">
                For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Atlantic Enterprise, whose registered/operational office is 270/B, Sector 25, PCNTDA Sindhunagar, Nigdi, Pune, MAHARASHTRA 411044. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Introduction</h2>
              <p className="mb-6">
                Atlantic Enterprise is committed to protecting your privacy and ensuring your personal information is handled securely. This Privacy Policy explains how we collect, use, and protect your information when you use our website or services. By using our website, you consent to the data practices described in this policy.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Information We Collect</h2>
              <p className="mb-4">We may collect the following types of information:</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li><strong>Personal Information:</strong> Name, email address, phone number, and address when you sign up for our services, apply for internships, or contact us.</li>
                <li><strong>Technical Information:</strong> IP address, browser type, device information, and cookies when you browse our website.</li>
                <li><strong>Usage Information:</strong> How you interact with our website, pages visited, and time spent on our website.</li>
                <li><strong>Communication Information:</strong> Content of emails, messages, or other communications you send us.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. How We Use Your Information</h2>
              <p className="mb-4">We use your information for various purposes, including:</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Providing and improving our services</li>
                <li>Processing internship applications</li>
                <li>Communicating with you about our services</li>
                <li>Sending important notifications and updates</li>
                <li>Conducting research and analysis to improve user experience</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Legal Basis for Processing</h2>
              <p className="mb-6">
                We process your personal information based on one or more of the following legal grounds:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li><strong>Consent:</strong> Where you have given us permission to process your data for specific purposes.</li>
                <li><strong>Contractual Necessity:</strong> When processing is necessary to fulfill a contract with you.</li>
                <li><strong>Legitimate Interests:</strong> When processing is necessary for our legitimate business interests.</li>
                <li><strong>Legal Obligation:</strong> When we need to comply with a legal or regulatory obligation.</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">5. General Terms</h2>
              <p className="mb-6">
                Your use of the website and/or purchase from us are governed by the following Terms and Conditions:
              </p>

              <ul className="list-disc pl-5 space-y-3 mb-6">
                <li>The content of the pages of this website is subject to change without notice.</li>
                <li>Neither we nor any third parties provide any warranty or guarantee as to the accuracy, timeliness, performance, completeness or suitability of the information and materials found or offered on this website for any particular purpose. You acknowledge that such information and materials may contain inaccuracies or errors and we expressly exclude liability for any such inaccuracies or errors to the fullest extent permitted by law.</li>
                <li>Your use of any information or materials on our website and/or product pages is entirely at your own risk, for which we shall not be liable. It shall be your own responsibility to ensure that any products, services or information available through our website and/or product pages meet your specific requirements.</li>
                <li>Our website contains material which is owned by or licensed to us. This material includes, but are not limited to, the design, layout, look, appearance and graphics. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</li>
                <li>All trademarks reproduced in our website which are not the property of, or licensed to, the operator are acknowledged on the website.</li>
                <li>Unauthorized use of information provided by us shall give rise to a claim for damages and/or be a criminal offense.</li>
                <li>From time to time our website may also include links to other websites. These links are provided for your convenience to provide further information.</li>
                <li>You may not create a link to our website from another website or document without Atlantic Enterprise's prior written consent.</li>
                <li>Any dispute arising out of use of our website and/or purchase with us and/or any engagement with us is subject to the laws of India.</li>
                <li>We, shall be under no liability whatsoever in respect of any loss or damage arising directly or indirectly out of the decline of authorization for any Transaction, on Account of the Cardholder having exceeded the preset limit mutually agreed by us with our acquiring bank from time to time</li>
              </ul>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. Cookies and Tracking Technologies</h2>
              <p className="mb-6">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and personalize content. You can control cookies through your browser settings. By continuing to use our website, you consent to our use of cookies in accordance with this Privacy Policy.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Data Retention</h2>
              <p className="mb-6">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When determining how long to keep your information, we consider the nature and sensitivity of the data, the potential risk of harm from unauthorized use or disclosure, and legal requirements.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">8. Your Rights</h2>
              <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>The right to access and receive a copy of your personal information</li>
                <li>The right to correct or update your personal information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to restrict or object to processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p className="mb-6">
                To exercise any of these rights, please contact us using the information provided at the end of this policy.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">9. Security Measures</h2>
              <p className="mb-6">
                We implement appropriate security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">10. Changes to This Privacy Policy</h2>
              <p className="mb-6">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Contact Information</h2>
              <p className="mb-4">
                If you have questions or concerns about this Privacy Policy or our data practices, please contact us at: {companyInfo.contact?.email}
              </p>
              <p className="mt-6 text-sm text-gray-500 italic">
                Note: This privacy policy has been created for general informational purposes only and does not constitute legal advice. Please consult with a legal professional for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 