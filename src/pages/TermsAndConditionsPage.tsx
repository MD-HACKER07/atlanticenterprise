import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

const TermsAndConditionsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-6">
          <ArrowLeft size={18} className="mr-2" /> Back to home
        </Link>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms and Conditions</h1>
            
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Last updated on May 2 2025
              </p>

              <p className="mb-6">
                For the purpose of these Terms and Conditions, The term "we", "us", "our" used anywhere on this page shall mean Atlantic Enterprise, whose registered/operational office is 270/B, Sector 25, PCNTDA Sindhunagar, Nigdi, Pune, MAHARASHTRA 411044. "you", "your", "user", "visitor" shall mean any natural or legal person who is visiting our website and/or agreed to purchase from us.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Acceptance of Terms</h2>
              <p className="mb-6">
                By accessing or using our website, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily download one copy of the materials on Atlantic Enterprise's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose</li>
                <li>Attempt to decompile or reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
              <p className="mb-6">
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by Atlantic Enterprise at any time.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Disclaimer</h2>
              <p className="mb-6">
                The materials on Atlantic Enterprise's website are provided on an 'as is' basis. Atlantic Enterprise makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Limitations</h2>
              <p className="mb-6">
                In no event shall Atlantic Enterprise or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Atlantic Enterprise's website, even if Atlantic Enterprise or an authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

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

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">6. User Account</h2>
              <p className="mb-4">
                If you create an account on our website, you are responsible for:
              </p>
              <ul className="list-disc pl-5 space-y-2 mb-6">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>Restricting access to your computer or device</li>
                <li>All activities that occur under your account or password</li>
              </ul>
              <p className="mb-6">
                We reserve the right to refuse service, terminate accounts, remove or edit content, or cancel orders at our sole discretion if we believe that user conduct violates applicable laws or is harmful to our interests.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">7. Products and Services</h2>
              <p className="mb-6">
                Products and services displayed on our website may not be available in all locations or jurisdictions. Product descriptions and images are for illustrative purposes only and actual products may vary. We reserve the right to limit the quantities of any products or services that we offer and to discontinue any product or service at any time without notice.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">8. Internship Programs</h2>
              <p className="mb-6">
                Our internship programs are subject to additional terms and conditions that will be provided during the application process. Participation in our internship programs is subject to eligibility requirements, application procedures, and acceptance by Atlantic Enterprise. We reserve the right to modify, suspend, or terminate any internship program at our discretion.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">9. Intellectual Property</h2>
              <p className="mb-6">
                All content included on this website, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Atlantic Enterprise or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws. The compilation of all content on this site is the exclusive property of Atlantic Enterprise.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">10. Revisions and Errata</h2>
              <p className="mb-6">
                The materials appearing on Atlantic Enterprise's website could include technical, typographical, or photographic errors. Atlantic Enterprise does not warrant that any of the materials on its website are accurate, complete, or current. Atlantic Enterprise may make changes to the materials contained on its website at any time without notice.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">11. Governing Law</h2>
              <p className="mb-6">
                These terms and conditions are governed by and construed in accordance with the laws of India, and you irrevocably submit to the exclusive jurisdiction of the courts in Pune, Maharashtra, India.
              </p>

              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms and Conditions, please contact us at: {companyInfo.contact?.email}
              </p>
              <p className="mt-6 text-sm text-gray-500 italic">
                Note: These terms and conditions have been created for general informational purposes only and do not constitute legal advice. Please consult with a legal professional for advice specific to your situation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage; 