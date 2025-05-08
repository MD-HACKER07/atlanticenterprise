import React from 'react';
import { ArrowRight, GraduationCap, Users, Briefcase, ArrowDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { internships } from '../data/internships';
import { testimonials } from '../data/testimonials';
import { companyInfo } from '../data/companyInfo';
import TestimonialCard from '../components/TestimonialCard';
import InternshipCard from '../components/InternshipCard';

const HomePage: React.FC = () => {
  const featuredInternships = internships.filter(
    (internship) => internship.featured
  ).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              {companyInfo.tagline}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join our internship program and kickstart your career journey with hands-on experience in a supportive environment. Build skills that last a lifetime.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/internships"
                className="bg-white hover:bg-gray-50 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                Browse Internships <ArrowRight size={20} />
              </Link>
              <Link
                to="/register"
                className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Register Now
              </Link>
            </div>
            <div className="mt-20 animate-bounce">
              <ArrowDown size={32} className="text-blue-200 mx-auto" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why Choose InternHub?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're dedicated to creating meaningful internship experiences that benefit both interns and companies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-gray-50 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <GraduationCap size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Learn By Doing</h3>
              <p className="text-gray-600 text-lg">
                Gain hands-on experience working on real projects that make a difference. Build your skills while adding valuable work to your portfolio.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Users size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Dedicated Mentorship</h3>
              <p className="text-gray-600 text-lg">
                Work alongside industry professionals who are committed to helping you grow. Get personalized feedback and guidance throughout your internship.
              </p>
            </div>

            <div className="bg-gray-50 p-8 rounded-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                <Briefcase size={32} className="text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Career Opportunities</h3>
              <p className="text-gray-600 text-lg">
                Many of our interns go on to secure full-time positions with top companies. Build a network and discover pathways to your dream career.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Internships */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900">Featured Internships</h2>
            <Link 
              to="/internships" 
              className="text-blue-600 hover:text-blue-800 font-medium text-lg flex items-center gap-2"
            >
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInternships.map((internship) => (
              <InternshipCard key={internship.id} internship={internship} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Success Stories</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from our past interns about their experiences and where they are now.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 relative">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
            <p className="text-xl text-blue-100 mb-12">
              Apply today for an opportunity to work with our talented team on exciting projects. Build your skills, expand your network, and take the first step towards a successful career.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/internships"
                className="bg-white hover:bg-gray-50 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Browse Internships
              </Link>
              <Link
                to="/register"
                className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center justify-center shadow-lg hover:shadow-xl"
              >
                Register Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;