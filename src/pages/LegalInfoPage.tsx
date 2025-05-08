import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Mail } from 'lucide-react';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const LegalInfoPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <SEO 
        title="Legal Information | Atlantic Enterprise"
        description="Important legal information about Atlantic Enterprise including our Privacy Policy, Terms and Conditions, and how to contact us."
        keywords={["legal information", "privacy policy", "terms and conditions", "contact support", "Atlantic Enterprise legal"]}
        canonicalUrl="https://atlanticenterprise.in/legal"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Legal Information</h1>
        <p className="text-lg text-gray-700 mb-12 max-w-3xl">
          Important information about our policies, terms, and how we operate.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Privacy Policy Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="text-blue-600 w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Legal Information</span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-4">Privacy Policy</h2>
              <p className="text-gray-600 mb-6">
                Learn about how we collect, use, and protect your personal information.
              </p>
              <Link 
                to="/privacy-policy"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
              >
                Read More 
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
          
          {/* Terms and Conditions Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <FileText className="text-blue-600 w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Legal Information</span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-4">Terms and Conditions</h2>
              <p className="text-gray-600 mb-6">
                Understand the terms that govern your use of our services and products.
              </p>
              <Link 
                to="/terms-and-conditions"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
              >
                Read More 
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
          
          {/* Contact Us Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Mail className="text-blue-600 w-6 h-6" />
              </div>
              <span className="text-sm font-medium text-blue-600 uppercase tracking-wider">Legal Information</span>
              <h2 className="text-xl font-bold text-gray-900 mt-2 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-6">
                Get in touch with our team for any questions, support, or business inquiries.
              </p>
              <Link 
                to="/contact"
                className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800"
              >
                Read More 
                <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LegalInfoPage; 