import React from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="h-64 bg-gradient-to-r from-blue-700 to-blue-900 flex items-center justify-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-4">About InternHub</h1>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-12">
              <div className="md:w-2/3">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-700 mb-6">
                  {companyInfo.description}
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 mb-6">
                  <div className="flex items-center">
                    <Calendar size={20} className="text-blue-600 mr-2" />
                    <span>
                      <span className="text-sm text-gray-500">Founded in</span>
                      <span className="block font-medium text-gray-900">{companyInfo.founded}</span>
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={20} className="text-blue-600 mr-2" />
                    <span>
                      <span className="text-sm text-gray-500">Location</span>
                      <span className="block font-medium text-gray-900">{companyInfo.location}</span>
                    </span>
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Mission</h3>
                <p className="text-gray-700 mb-6">
                  At InternHub, our mission is to bridge the gap between education and the professional world. We believe in the power of practical experience and are committed to providing students with meaningful internship opportunities that will help them grow both personally and professionally.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Our Values</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><span className="font-medium">Learning by Doing</span> - We believe that practical experience is essential for growth and development.</li>
                  <li><span className="font-medium">Mentorship</span> - We provide guidance and support to help interns navigate their professional journey.</li>
                  <li><span className="font-medium">Innovation</span> - We encourage fresh perspectives and new ideas.</li>
                  <li><span className="font-medium">Inclusivity</span> - We create opportunities for students from all backgrounds.</li>
                  <li><span className="font-medium">Excellence</span> - We hold ourselves and our interns to high standards of quality and performance.</li>
                </ul>
              </div>
              
              <div className="md:w-1/3 bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">What Sets Us Apart</h3>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Real-World Experience</h4>
                    <p className="text-gray-600 text-sm">Our interns work on actual projects that have real impact, not just busy work.</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Dedicated Mentorship</h4>
                    <p className="text-gray-600 text-sm">Each intern is paired with an experienced professional who provides guidance and feedback.</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Skill Development</h4>
                    <p className="text-gray-600 text-sm">We focus on helping interns develop both technical and soft skills essential for career success.</p>
                  </div>
                  <div className="bg-white p-4 rounded-md shadow-sm">
                    <h4 className="font-medium text-gray-900 mb-2">Networking Opportunities</h4>
                    <p className="text-gray-600 text-sm">Interns connect with professionals across various industries and build valuable relationships.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Team</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {companyInfo.team.map((member) => (
                <div key={member.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-64 object-cover object-center"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-lg">{member.name}</h3>
                    <p className="text-blue-600">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;