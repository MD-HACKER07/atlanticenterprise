import React, { useState, useEffect } from 'react';
import { companyInfo as initialCompanyInfo } from './data/companyInfo';
import { Shield, Lock } from 'lucide-react';
import { getCategoryName, isValidCategoryList } from './utils/productHelpers';
import { Link } from 'react-router-dom';
import InternshipSection from './components/InternshipSection';
import Footer from './components/Footer';
import SEO from './components/SEO';
import CountdownTimer from './components/CountdownTimer';
import { getPromotionSettings } from './utils/settingsUtils';

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState(initialCompanyInfo);
  
  useEffect(() => {
    const loadPromotionSettings = async () => {
      try {
        const promotionSettings = await getPromotionSettings();
        // Update companyInfo with the promotion settings from the database
        setCompanyInfo(prevInfo => ({
          ...prevInfo,
          promotion: promotionSettings
        }));
      } catch (error) {
        console.error('Failed to load promotion settings:', error);
      }
    };
    
    loadPromotionSettings();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    document.addEventListener('scroll', handleScroll);
    return () => {
      document.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Initialize scroll animations
  useEffect(() => {
    // Add animate class to elements with data-aos attribute when they enter viewport
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
        }
      });
    }, observerOptions);
    
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(el => observer.observe(el));
    
    return () => {
      elements.forEach(el => observer.unobserve(el));
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items with proper links
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/#about" },
    { name: "Products", path: "/#products" },
    { name: "Internships", path: "/internships" },
    { name: "Contact", path: "/#contact" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SEO 
        title="Best Internships in Pune | Hardware, Fittings & AI Automation"
        description="Atlantic Enterprise offers exciting internship opportunities in Pune for AI automation, hardware, fittings, bearings, and healthcare products. Apply now for hands-on experience with a leading company established in 2019."
        keywords={["internship", "internship in Pune", "best internship", "atlanticenterprise", "AI automation internship", "hardware internship", "Pune internship", "internship opportunities", "atlanticenterprise internship"]}
        canonicalUrl="https://atlanticenterprise.in"
      />
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm shadow-md' : 'bg-transparent'}`}>
        <div className="container mx-auto py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img src="/images/logo.png" alt={companyInfo.name} className="w-8 h-8 md:w-10 md:h-10 object-contain" />
              <h1 className={`text-xl md:text-2xl font-extrabold ${scrolled ? 'text-[var(--secondary)]' : 'text-white'}`}>
                <span className="font-black tracking-tight">ATLANTIC</span> <span className="font-medium">ENTERPRISE</span>
              </h1>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item, index) => (
                item.path.startsWith('/#') ? (
                  <a 
                    key={index} 
                    href={item.path.substring(1)}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 
                      ${scrolled 
                        ? 'text-[var(--text-primary)] hover:bg-gray-100 hover:text-[var(--primary)]' 
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={index}
                    to={item.path}
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 
                      ${scrolled 
                        ? 'text-[var(--text-primary)] hover:bg-gray-100 hover:text-[var(--primary)]' 
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                      }`}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <Link 
                to="/verify-certificate" 
                className="ml-2 px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-full transition-all duration-200 font-medium"
              >
                Verify Certificate
              </Link>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMobileMenu}
              className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-[var(--text-primary)]' : 'text-white'}`}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 invisible'
          } overflow-hidden`}
        >
          <div className="container mx-auto py-4 px-4 space-y-2">
            {navItems.map((item, index) => (
              item.path.startsWith('/#') ? (
                <a 
                  key={index} 
                  href={item.path.substring(1)}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[var(--text-primary)] hover:bg-gray-50 rounded-lg font-medium"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={index}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-[var(--text-primary)] hover:bg-gray-50 rounded-lg font-medium"
                >
                  {item.name}
                </Link>
              )
            ))}
            <Link 
              to="/verify-certificate" 
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-4 text-center px-4 py-3 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg transition-all duration-200 font-medium"
            >
              Verify Certificate
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with padding to account for fixed navbar */}
      <section className="hero-gradient text-white relative overflow-hidden min-h-[90vh] flex items-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -inset-[10px] bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b')] bg-cover opacity-20 blur-sm"></div>
        </div>
        <div className="container mx-auto px-4 z-10 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Main Hero Content - Takes 2/3 of the space on large screens */}
            <div className="lg:col-span-2">
            <div className="animate-fade-in">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-sm font-medium text-white mb-6">
                Innovation & Quality Since 2019
              </span>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Building the Future with <span className="text-[var(--primary-light)]">Innovation</span>
              </h2>
              <p className="text-xl mb-8 text-white/80 max-w-2xl">
                {companyInfo.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  to="/contact" 
                  className="btn btn-primary btn-pill btn-shine group"
                >
                  <span>Request a Quote</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </Link>
                <Link 
                  to="/learn-more" 
                  className="btn btn-secondary-dark btn-pill group"
                >
                  <span>Learn More</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" />
                    <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            <div className="mt-16 animate-slide-up">
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Atlantic Enterprise innovation" 
                  className="w-full object-cover rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white">Innovative Solutions</h3>
                    <p className="text-white/80">Automating the future with cutting-edge technology</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
            
            {/* Countdown Timer - Takes 1/3 of the space on large screens */}
            {companyInfo.promotion?.enabled && (
              <div className="lg:col-span-1 flex flex-col items-center">
                <div className="sticky top-24 w-full max-w-xs">
                  <div className="bg-blue-700 rounded-lg shadow-xl overflow-hidden text-white">
                    <div className="p-5">
                      <CountdownTimer 
                        targetDate={companyInfo.promotion.deadline}
                        message={companyInfo.promotion.message}
                        className="w-full"
                      />
                      {companyInfo.promotion.ctaText && companyInfo.promotion.ctaLink && (
                        <div className="mt-5">
                          <Link
                            to={companyInfo.promotion.ctaLink}
                            className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors shadow-md hover:shadow-lg"
                          >
                            {companyInfo.promotion.ctaText}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                              <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section bg-[var(--background-alt)]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">About <span className="gradient-text">Atlantic Enterprise</span></h2>
            <p className="section-subtitle mx-auto">
              Founded in {companyInfo.founded}, we've been committed to innovation and quality in everything we do.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="card p-6 feature-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[var(--primary)]">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Our Mission</h3>
                </div>
                <p className="text-[var(--text-secondary)]">{companyInfo.mission}</p>
              </div>
              
              <div className="card p-6 feature-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--primary-light)] flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-[var(--primary)]">
                      <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                      <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold">Our Vision</h3>
                </div>
                <p className="text-[var(--text-secondary)]">{companyInfo.vision}</p>
              </div>
            </div>
            
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-xl relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" 
                  alt="Atlantic Enterprise Team" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute top-10 -right-10 -z-0">
                <svg width="258" height="258" viewBox="0 0 258 258" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M129 0.0407715C132.304 0.0407715 135.609 0.152164 138.913 0.340009C142.217 0.527854 145.522 0.804091 148.826 1.16872C152.13 1.53335 155.435 1.98637 158.739 2.51235C162.043 3.03833 165.348 3.65727 168.652 4.35917C171.957 5.06106 175.261 5.8459 178.565 6.73609C181.87 7.62628 185.174 8.59081 188.478 9.64969C191.783 10.7086 195.087 11.8396 198.391 13.0709C201.696 14.3023 205 15.6152 208.304 17.0394C211.609 18.4636 214.913 19.9705 218.217 21.58C221.522 23.1895 224.826 24.9016 228.13 26.6967C231.435 28.4917 234.739 30.3993 238.043 32.3693C241.348 34.3394 244.652 36.3877 247.957 38.5142C251.261 40.6407 254.565 42.8788 257.87 45.1956C254.565 47.5124 251.261 49.7506 247.957 51.8771C244.652 54.0036 241.348 56.0519 238.043 58.022C234.739 59.992 231.435 61.8996 228.13 63.6947C224.826 65.4897 221.522 67.2018 218.217 68.8113C214.913 70.4208 211.609 71.9277 208.304 73.3519C205 74.7762 201.696 76.0891 198.391 77.3204C195.087 78.5518 191.783 79.6828 188.478 80.7416C185.174 81.8005 181.87 82.765 178.565 83.6552C175.261 84.5454 171.957 85.3303 168.652 86.0322C165.348 86.7341 162.043 87.353 158.739 87.879C155.435 88.405 152.13 88.858 148.826 89.2226C145.522 89.5873 142.217 89.8635 138.913 90.0514C135.609 90.2392 132.304 90.3506 129 90.3506C125.696 90.3506 122.391 90.2392 119.087 90.0514C115.783 89.8635 112.478 89.5873 109.174 89.2226C105.87 88.858 102.565 88.405 99.2609 87.879C95.9565 87.353 92.6522 86.7341 89.3478 86.0322C86.0435 85.3303 82.7391 84.5454 79.4348 83.6552C76.1304 82.765 72.8261 81.8005 69.5217 80.7416C66.2174 79.6828 62.913 78.5518 59.6087 77.3204C56.3043 76.0891 53 74.7762 49.6957 73.3519C46.3913 71.9277 43.087 70.4208 39.7826 68.8113C36.4783 67.2018 33.1739 65.4897 29.8696 63.6947C26.5652 61.8996 23.2609 59.992 19.9565 58.022C16.6522 56.0519 13.3478 54.0036 10.0435 51.8771C6.73913 49.7506 3.43478 47.5124 0.130432 45.1956C3.43478 42.8788 6.73913 40.6407 10.0435 38.5142C13.3478 36.3877 16.6522 34.3394 19.9565 32.3693C23.2609 30.3993 26.5652 28.4917 29.8696 26.6967C33.1739 24.9016 36.4783 23.1895 39.7826 21.58C43.087 19.9705 46.3913 18.4636 49.6957 17.0394C53 15.6152 56.3043 14.3023 59.6087 13.0709C62.913 11.8396 66.2174 10.7086 69.5217 9.64969C72.8261 8.59081 76.1304 7.62628 79.4348 6.73609C82.7391 5.8459 86.0435 5.06106 89.3478 4.35917C92.6522 3.65727 95.9565 3.03833 99.2609 2.51235C102.565 1.98637 105.87 1.53335 109.174 1.16872C112.478 0.804091 115.783 0.527854 119.087 0.340009C122.391 0.152164 125.696 0.0407715 129 0.0407715ZM129 167.651C132.304 167.651 135.609 167.762 138.913 167.95C142.217 168.138 145.522 168.414 148.826 168.779C152.13 169.143 155.435 169.596 158.739 170.122C162.043 170.648 165.348 171.267 168.652 171.969C171.957 172.671 175.261 173.456 178.565 174.346C181.87 175.236 185.174 176.201 188.478 177.26C191.783 178.319 195.087 179.45 198.391 180.681C201.696 181.912 205 183.225 208.304 184.649C211.609 186.074 214.913 187.581 218.217 189.19C221.522 190.8 224.826 192.512 228.13 194.307C231.435 196.102 234.739 198.009 238.043 199.979C241.348 201.949 244.652 203.998 247.957 206.124C251.261 208.251 254.565 210.489 257.87 212.806C254.565 215.122 251.261 217.361 247.957 219.487C244.652 221.614 241.348 223.662 238.043 225.632C234.739 227.602 231.435 229.51 228.13 231.305C224.826 233.1 221.522 234.812 218.217 236.421C214.913 238.031 211.609 239.538 208.304 240.962C205 242.386 201.696 243.699 198.391 244.93C195.087 246.162 191.783 247.293 188.478 248.352C185.174 249.41 181.87 250.375 178.565 251.265C175.261 252.155 171.957 252.94 168.652 253.642C165.348 254.344 162.043 254.963 158.739 255.489C155.435 256.015 152.13 256.468 148.826 256.833C145.522 257.197 142.217 257.473 138.913 257.661C135.609 257.849 132.304 257.961 129 257.961C125.696 257.961 122.391 257.849 119.087 257.661C115.783 257.473 112.478 257.197 109.174 256.833C105.87 256.468 102.565 256.015 99.2609 255.489C95.9565 254.963 92.6522 254.344 89.3478 253.642C86.0435 252.94 82.7391 252.155 79.4348 251.265C76.1304 250.375 72.8261 249.41 69.5217 248.352C66.2174 247.293 62.913 246.162 59.6087 244.93C56.3043 243.699 53 242.386 49.6957 240.962C46.3913 239.538 43.087 238.031 39.7826 236.421C36.4783 234.812 33.1739 233.1 29.8696 231.305C26.5652 229.51 23.2609 227.602 19.9565 225.632C16.6522 223.662 13.3478 221.614 10.0435 219.487C6.73913 217.361 3.43478 215.122 0.130432 212.806C3.43478 210.489 6.73913 208.251 10.0435 206.124C13.3478 203.998 16.6522 201.949 19.9565 199.979C23.2609 198.009 26.5652 196.102 29.8696 194.307C33.1739 192.512 36.4783 190.8 39.7826 189.19C43.087 187.581 46.3913 186.074 49.6957 184.649C53 183.225 56.3043 181.912 59.6087 180.681C62.913 179.45 66.2174 178.319 69.5217 177.26C72.8261 176.201 76.1304 175.236 79.4348 174.346C82.7391 173.456 86.0435 172.671 89.3478 171.969C92.6522 171.267 95.9565 170.648 99.2609 170.122C102.565 169.596 105.87 169.143 109.174 168.779C112.478 168.414 115.783 168.138 119.087 167.95C122.391 167.762 125.696 167.651 129 167.651ZM129 167.651C132.304 167.651 135.609 167.762 138.913 167.95C142.217 168.138 145.522 168.414 148.826 168.779C152.13 169.143 155.435 169.596 158.739 170.122C162.043 170.648 165.348 171.267 168.652 171.969C171.957 172.671 175.261 173.456 178.565 174.346C181.87 175.236 185.174 176.201 188.478 177.26C191.783 178.319 195.087 179.45 198.391 180.681C201.696 181.912 205 183.225 208.304 184.649C211.609 186.074 214.913 187.581 218.217 189.19C221.522 190.8 224.826 192.512 228.13 194.307C231.435 196.102 234.739 198.009 238.043 199.979C241.348 201.949 244.652 203.998 247.957 206.124C251.261 208.251 254.565 210.489 257.87 212.806C254.565 215.122 251.261 217.361 247.957 219.487C244.652 221.614 241.348 223.662 238.043 225.632C234.739 227.602 231.435 229.51 228.13 231.305C224.826 233.1 221.522 234.812 218.217 236.421C214.913 238.031 211.609 239.538 208.304 240.962C205 242.386 201.696 243.699 198.391 244.93C195.087 246.162 191.783 247.293 188.478 248.352C185.174 249.41 181.87 250.375 178.565 251.265C175.261 252.155 171.957 252.94 168.652 253.642C165.348 254.344 162.043 254.963 158.739 255.489C155.435 256.015 152.13 256.468 148.826 256.833C145.522 257.197 142.217 257.473 138.913 257.661C135.609 257.849 132.304 257.961 129 257.961C125.696 257.961 122.391 257.849 119.087 257.661C115.783 257.473 112.478 257.197 109.174 256.833C105.87 256.468 102.565 256.015 99.2609 255.489C95.9565 254.963 92.6522 254.344 89.3478 253.642C86.0435 252.94 82.7391 252.155 79.4348 251.265C76.1304 250.375 72.8261 249.41 69.5217 248.352C66.2174 247.293 62.913 246.162 59.6087 244.93C56.3043 243.699 53 242.386 49.6957 240.962C46.3913 239.538 43.087 238.031 39.7826 236.421C36.4783 234.812 33.1739 233.1 29.8696 231.305C26.5652 229.51 23.2609 227.602 19.9565 225.632C16.6522 223.662 13.3478 221.614 10.0435 219.487C6.73913 217.361 3.43478 215.122 0.130432 212.806C3.43478 210.489 6.73913 208.251 10.0435 206.124C13.3478 203.998 16.6522 201.949 19.9565 199.979C23.2609 198.009 26.5652 196.102 29.8696 194.307C33.1739 192.512 36.4783 190.8 39.7826 189.19C43.087 187.581 46.3913 186.074 49.6957 184.649C53 183.225 56.3043 181.912 59.6087 180.681C62.913 179.45 66.2174 178.319 69.5217 177.26C72.8261 176.201 76.1304 175.236 79.4348 174.346C82.7391 173.456 86.0435 172.671 89.3478 171.969C92.6522 171.267 95.9565 170.648 99.2609 170.122C102.565 169.596 105.87 169.143 109.174 168.779C112.478 168.414 115.783 168.138 119.087 167.95C122.391 167.762 125.696 167.651 129 167.651Z" fill="url(#paint0_linear_1_95)" fillOpacity="0.1"/>
                  <defs>
                  <linearGradient id="paint0_linear_1_95" x1="129" y1="0.0407715" x2="129" y2="257.961" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#007AFF"/>
                  <stop offset="1" stopColor="#7C3AED"/>
                  </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {companyInfo.strengths?.slice(0, 4).map((strength, index) => (
              <div key={index} className="card p-6 feature-card">
                <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4">
                  <span className="text-[var(--primary)] font-bold">{index + 1}</span>
                </div>
                <h3 className="font-bold mb-2">{strength}</h3>
                <p className="text-[var(--text-secondary)] text-sm">
                  Committed to excellence in everything we do.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products" className="section bg-[var(--background)] relative overflow-hidden">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">Legal <span className="gradient-text">Information</span></h2>
            <p className="section-subtitle mx-auto">
              Important information about our policies, terms, and how we operate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                id: 'privacy-policy',
                title: 'Privacy Policy',
                path: '/privacy-policy',
                description: 'Learn about how we collect, use, and protect your personal information.',
                image: 'https://images.unsplash.com/photo-1633265486064-086b219458ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
              },
              {
                id: 'terms',
                title: 'Terms and Conditions',
                path: '/terms-and-conditions',
                description: 'Understand the terms that govern your use of our services and products.',
                image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80'
              },
              {
                id: 'contact',
                title: 'Contact Us',
                path: '/contact',
                description: 'Get in touch with our team for any questions, support, or business inquiries.',
                image: 'https://images.unsplash.com/photo-1556745753-b2904692b3cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1473&q=80'
              }
            ].map((page) => (
              <div key={page.id} className="card feature-card group">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={page.image} 
                        alt={page.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                      <div className="absolute bottom-0 left-0 p-6">
                        <p className="text-white text-sm font-medium">Legal Information</p>
                        <h3 className="text-white text-xl font-bold">{page.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-[var(--text-secondary)] mb-4">
                        {page.description}
                      </p>
                      <Link to={page.path} className="text-[var(--primary)] font-medium flex items-center group-hover:gap-1.5 gap-1 transition-all">
                        Read More <span className="transition-transform group-hover:translate-x-1">→</span>
                      </Link>
                    </div>
                  </div>
            ))}
          </div>
          
          <div className="mt-16 relative">
            <div className="card p-8 md:p-12 lg:flex items-center justify-between gap-8 relative z-10 overflow-hidden bg-gradient-to-r from-[var(--secondary)] to-[var(--accent-dark)]">
              <div className="absolute -right-24 -top-24 w-64 h-64 rounded-full bg-white blur-3xl opacity-10"></div>
              <div className="absolute -left-24 -bottom-24 w-64 h-64 rounded-full bg-white blur-3xl opacity-10"></div>
              <div className="absolute inset-0 opacity-20">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
                      <circle cx="1" cy="1" r="1" fill="white" fill-opacity="0.3" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>
              </div>
              
              <div className="lg:max-w-2xl mb-6 lg:mb-0 relative text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to innovate with industry-leading products?</h3>
                <p className="text-white/80">
                  Connect with our team to discover how our products and services can transform your business.
                </p>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a href="#contact" className="btn btn-pill btn-lg bg-white text-[var(--secondary)] hover:bg-gray-100 whitespace-nowrap group">
                  <span>Contact Us</span>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </a>
                <Link to="/contact" className="btn btn-pill btn-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 whitespace-nowrap">
                  View Catalog
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Internship Section - Now using the dedicated component */}
      <InternshipSection />

      {/* Contact Section */}
      <section id="contact" className="section bg-[var(--background-alt)]">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-primary inline-block mb-4">GET IN TOUCH</span>
            <h2 className="section-title">Contact <span className="gradient-text">Atlantic Enterprise</span></h2>
            <p className="section-subtitle mx-auto">
              Have questions or want to learn more? We'd love to hear from you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="card overflow-hidden relative bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] text-white p-8 lg:p-10">
              <div className="absolute -right-16 -top-16 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="absolute -left-16 -bottom-16 w-32 h-32 rounded-full bg-white/10"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Address</h4>
                      <p className="text-white/80 text-sm leading-relaxed">{companyInfo.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Email</h4>
                      <p className="text-white/80 text-sm">{companyInfo.contact?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Phone</h4>
                      <p className="text-white/80 text-sm">{companyInfo.contact?.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M21.721 12.752a9.711 9.711 0 00-.945-5.003 12.754 12.754 0 01-4.339 2.708 18.991 18.991 0 01-.214 4.772 17.165 17.165 0 005.498-2.477zM14.634 15.55a17.324 17.324 0 00.332-4.647c-.952.227-1.945.347-2.966.347-1.021 0-2.014-.12-2.966-.347a17.515 17.515 0 00.332 4.647 17.385 17.385 0 005.268 0zM9.772 17.119a18.963 18.963 0 004.456 0A17.182 17.182 0 0112 21.724a17.18 17.18 0 01-2.228-4.605zM7.777 15.23a18.87 18.87 0 01-.214-4.774 12.753 12.753 0 01-4.34-2.708 9.711 9.711 0 00-.944 5.004 17.165 17.165 0 005.498 2.477zM21.356 14.752a9.765 9.765 0 01-7.478 6.817 18.64 18.64 0 001.988-4.718 18.627 18.627 0 005.49-2.098zM2.644 14.752c1.682.971 3.53 1.688 5.49 2.099a18.64 18.64 0 001.988 4.718 9.765 9.765 0 01-7.478-6.816zM13.878 2.43a9.755 9.755 0 016.116 3.986 11.267 11.267 0 01-3.746 2.504 18.63 18.63 0 00-2.37-6.49zM12 2.276a17.152 17.152 0 012.805 7.121c-.897.23-1.837.353-2.805.353-.968 0-1.908-.122-2.805-.353A17.151 17.151 0 0112 2.276zM10.122 2.43a18.629 18.629 0 00-2.37 6.49 11.266 11.266 0 01-3.746-2.504a9.754 9.754 0 016.116-3.985z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Website</h4>
                      <p className="text-white/80 text-sm">{companyInfo.contact?.website}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-10 pt-8 border-t border-white/20">
                  <h4 className="font-bold text-white mb-4">Connect With Us</h4>
                  <div className="flex space-x-3">
                    {["facebook", "twitter", "instagram", "linkedin"].map((platform, i) => (
                      <a 
                        key={i} 
                        href="#" 
                        className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white hover:text-[var(--primary)] transition-colors duration-300"
                        aria-label={`Follow us on ${platform}`}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          {platform === "facebook" && <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>}
                          {platform === "twitter" && <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>}
                          {platform === "instagram" && <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />}
                          {platform === "linkedin" && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h-.003z"/>}
                        </svg>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <form className="card p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-6">Send us a message</h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-input" placeholder="John Doe" />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email</label>
                      <input type="email" className="form-input" placeholder="john@example.com" />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Subject</label>
                    <input type="text" className="form-input" placeholder="How can we help you?" />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Message</label>
                    <textarea className="form-input" rows={5} placeholder="Your message here..."></textarea>
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-full">
                    Send Message
                  </button>
                </div>
              </form>
              
              <div className="mt-8">
                <h3 className="text-xl font-bold mb-6">Find us on the map</h3>
                <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3781.057642181986!2d73.76509047420305!3d18.62116386748658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b9f1ca8dab03%3A0x6838afb954d9ec7c!2sSindhu%20Nagar%2C%20Pradhikaran%2C%20Sector%2025%2C%20Nigdi%2C%20Pimpri-Chinchwad%2C%20Maharashtra%20411044!5e0!3m2!1sen!2sin!4v1686759432183!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen 
                    loading="lazy">
                  </iframe>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4 text-[var(--primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Phone</h4>
                <p className="text-[var(--text-secondary)]">{companyInfo.contact?.phone}</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4 text-[var(--primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Email</h4>
                <p className="text-[var(--text-secondary)]">{companyInfo.contact?.email}</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4 text-[var(--primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Address</h4>
                <p className="text-[var(--text-secondary)]">{companyInfo.location}</p>
              </div>
              
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 mx-auto rounded-full bg-[var(--primary-light)] flex items-center justify-center mb-4 text-[var(--primary)]">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                    <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">Business Hours</h4>
                <p className="text-[var(--text-secondary)]">Mon - Fri: 9AM - 6PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
      
      {/* JSON-LD Schema for Organization */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ 
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Atlantic Enterprise",
          "url": "https://atlanticenterprise.in",
          "logo": "https://atlanticenterprise.in/logo.png",
          "foundingDate": "2019",
          "founders": [
            {
              "@type": "Person",
              "name": "Atlantic Enterprise Founder"
            }
          ],
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "270/B, SEC NO 25, PCNTDA SINDHU NAGAR, NIGDI",
            "addressLocality": "Pune",
            "addressRegion": "Maharashtra",
            "postalCode": "411044",
            "addressCountry": "IN"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+91-7666906951",
            "contactType": "customer service",
            "email": "atlanticenterprise7@gmail.com",
            "availableLanguage": ["English", "Hindi", "Marathi"]
          },
          "sameAs": [
            "https://www.facebook.com/atlanticenterprise",
            "https://www.linkedin.com/company/atlanticenterprise",
            "https://twitter.com/atlanticenterprise",
            "https://www.instagram.com/atlanticenterprise"
          ]
        })
      }} />
    </div>
  );
}

export default App;