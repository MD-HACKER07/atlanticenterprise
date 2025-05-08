import React from 'react';
import { companyInfo } from '../data/companyInfo';
import { 
  BookOpen, 
  Lightbulb, 
  Award, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  Calendar, 
  Users, 
  Clock, 
  BarChart, 
  Truck,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Footer from '../components/Footer';

const LearnMorePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Learn More About Atlantic Enterprise | Our Mission, Vision & Values"
        description="Discover the story of Atlantic Enterprise, our journey, mission, vision, and the values that drive our innovation in hardware, fittings, and AI automation."
        keywords={["Atlantic Enterprise", "company mission", "company vision", "hardware supplier", "AI automation", "Pune business"]}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Atlantic Enterprise</h1>
            <p className="text-xl text-white/80 mb-8">
              Leading the way in hardware, fittings, and AI automation since 2019
            </p>
            <div className="flex justify-center">
              <Link 
                to="/contact" 
                className="btn btn-primary bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-lg"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Our Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-lg text-gray-600">
                The journey of Atlantic Enterprise from its foundation to becoming a leading supplier
              </p>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p>
                Atlantic Enterprise was founded in {companyInfo.founded} with a vision to provide high-quality hardware, fittings, and bearings to businesses across Maharashtra. What started as a small enterprise has now grown into a respected name in the industry.
              </p>
              
              <p>
                Over the years, we have consistently expanded our product range to meet the evolving needs of our customers. From traditional hardware components to modern healthcare and safety products, we have always stayed ahead of market trends.
              </p>
              
              <p>
                In recent years, recognizing the transformative potential of artificial intelligence and automation, we have ventured into AI automation products and tools. This strategic expansion not only diversifies our offerings but also positions us at the forefront of technological innovation.
              </p>
              
              <p>
                Today, we are proud to be a one-stop destination for a wide range of products that cater to various industries, from manufacturing and construction to healthcare and technology.
              </p>
              
              <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-semibold text-blue-800 mb-3">Our Founding Principles</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 w-5 h-5 mt-1 mr-2 flex-shrink-0" />
                    <span>Unwavering commitment to quality in every product we offer</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 w-5 h-5 mt-1 mr-2 flex-shrink-0" />
                    <span>Customer satisfaction as our primary objective</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 w-5 h-5 mt-1 mr-2 flex-shrink-0" />
                    <span>Ethical business practices in all our dealings</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="text-blue-600 w-5 h-5 mt-1 mr-2 flex-shrink-0" />
                    <span>Innovation and adaptation to changing market needs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Mission, Vision, Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Target className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600">
                {companyInfo.mission || "To provide innovative, high-quality products and solutions that meet the diverse needs of our customers while maintaining the highest standards of service and integrity."}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Lightbulb className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600">
                {companyInfo.vision || "To be the leading supplier of hardware, fittings, and AI automation solutions, recognized for our excellence, innovation, and contribution to the advancement of industries we serve."}
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Award className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Values</h3>
              <ul className="text-gray-600 space-y-2">
                {companyInfo.strengths?.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="text-blue-600 w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                )) || (
                  <>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Quality</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Integrity</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Customer Focus</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-blue-600 w-5 h-5 mr-2 flex-shrink-0" />
                      <span>Innovation</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Growth Journey</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Since our founding in {companyInfo.founded}, we've consistently grown and expanded our reach
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Calendar className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{new Date().getFullYear() - parseInt(companyInfo.founded || "2019")}+</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">2000+</h3>
              <p className="text-gray-600">Happy Customers</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Truck className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">10000+</h3>
              <p className="text-gray-600">Products Delivered</p>
            </div>
            
            <div className="p-6 bg-blue-50 rounded-lg">
              <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BarChart className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">150%</h3>
              <p className="text-gray-600">Growth in Last 2 Years</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Atlantic Enterprise</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              What sets us apart and makes us the preferred choice for our customers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                All our products undergo rigorous quality checks to ensure they meet the highest standards. We source from trusted manufacturers and conduct our own inspections.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <TrendingUp className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Innovation Focus</h3>
              <p className="text-gray-600">
                We continuously seek innovative products and solutions to add to our catalog, ensuring our customers have access to the latest advancements in their industries.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Customer-Centric Approach</h3>
              <p className="text-gray-600">
                Our business revolves around understanding and meeting customer needs. We provide personalized support and tailor our services to individual requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Truck className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Reliable Delivery</h3>
              <p className="text-gray-600">
                We understand the importance of timely delivery in business operations. Our efficient logistics ensure your orders reach you when you need them.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <BookOpen className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expertise & Knowledge</h3>
              <p className="text-gray-600">
                Our team comprises industry experts who can provide valuable insights and guidance on product selection and usage, helping you make informed decisions.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Clock className="text-blue-600 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Responsive Support</h3>
              <p className="text-gray-600">
                Our customer support team is always ready to assist you with any queries or concerns, ensuring a smooth and satisfactory experience with our products and services.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Partner with Atlantic Enterprise?</h2>
            <p className="text-xl text-white/80 mb-8">
              Discover how our products and solutions can benefit your business
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                to="/contact" 
                className="btn btn-primary bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-lg font-medium shadow-lg"
              >
                Contact Us
              </Link>
              <Link 
                to="/catalog" 
                className="btn btn-secondary bg-transparent border border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-medium"
              >
                View Catalog
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default LearnMorePage; 