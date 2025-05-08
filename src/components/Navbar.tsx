import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Shield, UserPlus, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { companyInfo } from '../data/companyInfo';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isAuthenticated, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      // Determine active section based on scroll position
      const scrollPosition = window.scrollY + 100;
      
      const sections = ['internship', 'contact', 'services', 'about'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
          break;
        } else {
          setActiveSection('home');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" onClick={() => scrollToSection('home')} className="flex items-center gap-2">
              <img src="/images/logo.png" alt={companyInfo.name} className="w-10 h-10 object-contain" />
              <span className={`text-xl font-bold ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                {companyInfo.name}
              </span>
            </a>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a 
                href="#" 
                onClick={() => scrollToSection('home')}
                className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'home' 
                    ? 'text-blue-600 bg-blue-50' 
                    : `${isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'}`
                }`}
              >
                Home
              </a>
              <a 
                href="#about" 
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'about' 
                    ? 'text-blue-600 bg-blue-50' 
                    : `${isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'}`
                }`}
              >
                About
              </a>
              <a 
                href="#services" 
                onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'services' 
                    ? 'text-blue-600 bg-blue-50' 
                    : `${isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'}`
                }`}
              >
                Products & Services
              </a>
              <a 
                href="#contact" 
                onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
                className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                  activeSection === 'contact' 
                    ? 'text-blue-600 bg-blue-50' 
                    : `${isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'}`
                }`}
              >
                Contact
              </a>
              <Link 
                to="/verify-certificate" 
                className={`transition-colors px-3 py-2 rounded-md text-sm font-medium flex items-center ${
                  isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-white hover:text-blue-200'
                }`}
              >
                <Award size={16} className="mr-1" />
                Verify Certificate
              </Link>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#internship" 
              onClick={(e) => { e.preventDefault(); scrollToSection('internship'); }}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              Apply for Internship
            </a>
            
            {isAuthenticated ? (
              <Link 
                to={isAdmin ? "/admin" : "/dashboard"} 
                className={`flex items-center gap-1 px-4 py-2 transition-colors text-sm font-medium rounded-md border ${
                  isScrolled 
                    ? 'border-blue-600 text-blue-600 hover:bg-blue-50' 
                    : 'border-white text-white hover:bg-white/10'
                }`}
              >
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
            ) : (
              <div className="flex gap-2">
                <Link 
                  to="/login" 
                  className={`flex items-center gap-1 px-4 py-2 transition-colors text-sm font-medium rounded-md border ${
                    isScrolled 
                      ? 'border-blue-600 text-blue-600 hover:bg-blue-50' 
                      : 'border-white text-white hover:bg-white/10'
                  }`}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/verify-access" 
                  className={`flex items-center gap-1 px-4 py-2 transition-colors text-sm font-medium rounded-md ${
                    isScrolled 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  <Shield size={16} className="mr-1" />
                  Admin Portal
                </Link>
                <Link 
                  to="/admin-register" 
                  className={`flex items-center gap-1 px-4 py-2 transition-colors text-sm font-medium rounded-md ${
                    isScrolled 
                      ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                      : 'bg-white/5 text-white hover:bg-white/15 backdrop-blur-sm border border-white/10'
                  }`}
                >
                  <UserPlus size={16} className="mr-1" />
                  Register Admin
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                isScrolled 
                  ? 'text-gray-900 hover:text-blue-600 hover:bg-blue-50' 
                  : 'text-white hover:text-white hover:bg-blue-800'
              }`}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
          <a
            href="#"
            onClick={() => scrollToSection('home')}
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeSection === 'home' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeSection === 'about' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            About
          </a>
          <a
            href="#services"
            onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeSection === 'services' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            Products & Services
          </a>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }}
            className={`block px-3 py-2 rounded-md text-base font-medium ${activeSection === 'contact' ? 'text-blue-600 bg-blue-50' : 'text-gray-900 hover:bg-gray-50 hover:text-blue-600'}`}
          >
            Contact
          </a>
          <Link
            to="/verify-certificate"
            className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-blue-600"
          >
            <Award size={18} className="mr-2" />
            Verify Certificate
          </Link>
          <div className="pt-4 space-y-2">
            <a
              href="#internship"
              onClick={(e) => { e.preventDefault(); scrollToSection('internship'); }}
              className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Apply for Internship
            </a>
            
            {isAuthenticated ? (
              <Link 
                to={isAdmin ? "/admin" : "/dashboard"} 
                className="block w-full px-4 py-2 text-center border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
              >
                {isAdmin ? "Admin Dashboard" : "Dashboard"}
              </Link>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="flex items-center justify-center gap-1 w-full px-4 py-2 text-center border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/verify-access" 
                  className="flex items-center justify-center gap-1 w-full px-4 py-2 text-center border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50"
                >
                  <Shield size={16} className="mr-1" />
                  Admin Portal
                </Link>
                <Link 
                  to="/admin-register" 
                  className="flex items-center justify-center gap-1 w-full px-4 py-2 text-center bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                >
                  <UserPlus size={16} className="mr-1" />
                  Register Admin
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;