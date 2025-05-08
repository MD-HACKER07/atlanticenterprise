import React from 'react';
import { Mail, MapPin, Phone, Globe, ChevronRight } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
          <div className="w-16 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="max-w-3xl mx-auto text-gray-600 text-lg">
            Have questions about our products or internship opportunities? Get in touch with us.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 bg-gray-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Address</h4>
                  <p className="text-gray-600">
                    {companyInfo.location}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Email</h4>
                  <a href={`mailto:${companyInfo.contact?.email}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                    {companyInfo.contact?.email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Phone</h4>
                  <a href={`tel:${companyInfo.contact?.phone}`} className="text-blue-600 hover:text-blue-800 transition-colors">
                    {companyInfo.contact?.phone}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mt-1">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-1">Website</h4>
                  <a href="https://atlanticenterprise.in" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors">
                    atlanticenterprise.in
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-lg font-medium text-gray-900 mb-3">Company Information</h4>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">GST No:</span> {companyInfo.legalInfo?.gst}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">PAN No:</span> {companyInfo.legalInfo?.pan}
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <form className="p-8 bg-white rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Send us a message</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">Your Name</label>
                  <input
                    type="text"
                    id="contactName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="contactEmail" className="block text-gray-700 font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    id="contactEmail"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john.doe@example.com"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="contactSubject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input
                  type="text"
                  id="contactSubject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="How can we help you?"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="contactMessage" className="block text-gray-700 font-medium mb-2">Message</label>
                <textarea
                  id="contactMessage"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your message here..."
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
            
            <div className="mt-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Our Location</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-200">
                <div className="flex items-start">
                  <MapPin className="text-blue-600 mt-1 mr-2 flex-shrink-0" size={20} />
                  <p className="text-gray-700 font-medium">
                    270/B, SEC NO 25, PCNTDA SINDHU NAGAR, NIGDI, Pune-411044, Maharashtra
                  </p>
                </div>
                <div className="mt-2 text-sm text-gray-600 ml-6">
                  <p>Landmarks: Near PCMC Bus Stand</p>
                  <p className="mt-1">
                    <a 
                      href="https://maps.app.goo.gl/ZJGt7j4LWQRpgPny9" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      Get Directions <ChevronRight size={16} className="ml-1" />
                    </a>
                  </p>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden h-80 shadow-md">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.1289955792818!2d73.76475687465536!3d18.658206564956625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9fb2b34dcc5%3A0x61bd2f65bf99e706!2sAtlantic%20Enterprise!5e0!3m2!1sen!2sin!4v1746186744461!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 