import React from 'react';
import { Shield, FileText, RefreshCw, Truck, PhoneCall } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';
import { Link } from 'react-router-dom';

const ServicesSection: React.FC = () => {
  // Legal pages data with guaranteed availability
  const legalPages = [
    {
      id: 'privacy-policy',
      title: 'Privacy Policy',
      description: 'Learn about how we collect, use, and protect your personal information.',
      path: '/privacy-policy',
      icon: <Shield size={32} />
    },
    {
      id: 'terms',
      title: 'Terms and Conditions',
      description: 'Understand the terms that govern your use of our services and products.',
      path: '/terms-and-conditions',
      icon: <FileText size={32} />
    },
    {
      id: 'refund',
      title: 'Cancellation and Refund',
      description: 'Our policies regarding cancellations, returns and refunds for your purchases.',
      path: '/cancellation-refund',
      icon: <RefreshCw size={32} />
    },
    {
      id: 'shipping',
      title: 'Shipping and Delivery',
      description: 'Information about our shipping methods, delivery times, and related policies.',
      path: '/shipping-delivery',
      icon: <Truck size={32} />
    },
    {
      id: 'contact',
      title: 'Contact Us',
      description: 'Get in touch with our team for any questions, support, or business inquiries.',
      path: '/contact',
      icon: <PhoneCall size={32} />
    }
  ];

  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Legal Information</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Important information about our policies, terms, and how we operate to ensure the best service for our customers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {legalPages.map((page) => (
            <div 
              key={page.id} 
              className="bg-gray-50 rounded-lg p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="text-blue-600 mb-4">{page.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{page.title}</h3>
              <p className="text-gray-600 mb-4">{page.description}</p>
              <Link 
                to={page.path}
                className="text-blue-600 font-medium inline-flex items-center hover:underline"
              >
                Read More <span className="ml-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection; 