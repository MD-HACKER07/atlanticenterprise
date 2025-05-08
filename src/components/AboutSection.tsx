import React from 'react';
import { Calendar, Map, Shield, Target } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Us</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Incorporated in the year 2019, Atlantic Enterprise is expanding into AI automation products 
            and tools, offering exciting internship opportunities.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h3>
            <p className="text-gray-600 mb-6">
              {companyInfo.description}
            </p>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <Calendar size={24} />
              </div>
              <div>
                <span className="font-medium text-gray-900">Founded in</span>
                <p className="text-gray-600">{companyInfo.founded}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600">
                <Map size={24} />
              </div>
              <div>
                <span className="font-medium text-gray-900">Headquarters</span>
                <p className="text-gray-600">{companyInfo.location}</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Target size={24} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Our Mission</h4>
              <p className="text-gray-600">{companyInfo.mission}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Shield size={24} />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Our Vision</h4>
              <p className="text-gray-600">{companyInfo.vision}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Our Strengths</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {companyInfo.strengths?.map((strength, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all">
                <p className="text-center text-gray-800">{strength}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 