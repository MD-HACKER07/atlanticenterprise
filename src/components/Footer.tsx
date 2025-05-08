import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Globe, Shield, FileText, UserCheck } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import { getCategoryName, isValidCategoryList } from '../utils/productHelpers';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/images/logo.png" alt={companyInfo.name} className="w-10 h-10 object-contain" />
              <span className="text-xl font-bold text-white">{companyInfo.name}</span>
            </div>
            <p className="text-gray-400 mb-4">{companyInfo.tagline}</p>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <MapPin size={18} className="text-blue-500" />
              <span>{companyInfo.location}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Mail size={18} className="text-blue-500" />
              <a 
                href={`mailto:${companyInfo.contact?.email || 'atlanticenterprise7@gmail.com'}`} 
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                {companyInfo.contact?.email || 'atlanticenterprise7@gmail.com'}
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Phone size={18} className="text-blue-500" />
              <a 
                href={`tel:${companyInfo.contact?.phone || '7666906951'}`} 
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                {companyInfo.contact?.phone || '7666906951'}
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <Globe size={18} className="text-blue-500" />
              <a 
                href="https://atlanticenterprise.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                atlanticenterprise.in
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-400 hover:text-blue-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Products & Services
                </a>
              </li>
              <li>
                <Link to="/internships" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Internships
                </Link>
              </li>
              <li>
                <Link to="/reviews" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Internship Reviews
                </Link>
              </li>
              <li>
                <Link to="/internship-faq" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Internship FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Legal Information</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <Shield size={16} className="mr-2 text-blue-500" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <FileText size={16} className="mr-2 text-blue-500" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-500 transition-colors flex items-center">
                  <UserCheck size={16} className="mr-2 text-blue-500" />
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Internship</h3>
            <p className="text-gray-400 mb-4">
              Join our team and gain hands-on experience in AI automation and robotics.
            </p>
            <Link
              to="/internships"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors inline-block"
            >
              Apply Now
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {companyInfo.name}. All rights reserved. GST: {companyInfo.legalInfo?.gst || '27ARWPN4452G1Z9'}
            </p>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0 justify-center">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms-and-conditions" className="text-gray-400 hover:text-blue-500 transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-blue-500 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;