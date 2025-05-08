import React, { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Zap, Sparkles, Check, Star } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

// Logo component for the AE logo
const AELogo: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-center">
        <div className="relative">
          {/* Stylized A */}
          <div className="text-white font-bold text-4xl md:text-5xl relative z-10 tracking-tight flex">
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-white"
              style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}
            >
              A
            </span>
            <span 
              className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-300"
              style={{ textShadow: '0 0 15px rgba(255,255,255,0.5)' }}
            >
              E
            </span>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600/40 to-indigo-600/40 blur-sm z-0"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-400/10 rounded-full animate-pulse-slow"></div>
          <div className="absolute top-0 right-0 w-2 h-2 bg-blue-400 rounded-full"></div>
          <div className="absolute bottom-1 left-0 w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
        </div>
      </div>
      <div className="text-xs text-blue-200/80 font-medium tracking-wider mt-1 text-center">ATLANTIC ENTERPRISE</div>
    </div>
  );
};

const Hero: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  // Featured areas that cycle through
  const features = [
    "Hardware & Fittings",
    "Healthcare Products",
    "Safety Equipment",
    "Bearings & Tools",
    "AI Automation Solutions"
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Trigger animations after component mounts
    setIsLoaded(true);
    
    // Cycle through features
    const intervalId = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(intervalId);
    };
  }, [features.length]);

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Dynamic background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
        {/* Animated background elements */}
        <div className="absolute w-full h-full overflow-hidden opacity-20">
          {[...Array(25)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
        
        {/* Accent circles */}
        <div className="absolute w-[500px] h-[500px] bg-blue-500 rounded-full opacity-10 -top-64 -right-64 blur-3xl"></div>
        <div className="absolute w-[600px] h-[600px] bg-indigo-600 rounded-full opacity-10 -bottom-96 -left-64 blur-3xl"></div>
        <div className="absolute w-[300px] h-[300px] bg-blue-400 rounded-full opacity-10 top-1/4 left-1/3 blur-2xl"></div>
      </div>
      
      <div className="container mx-auto px-4 z-10 text-center max-w-6xl py-16 md:py-24">
        {/* Logo */}
        <div 
          className={`mx-auto mb-8 transition-all duration-1000 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
          style={{ transitionDelay: '100ms' }}
        >
          <AELogo />
        </div>
        
        {/* Top floating badge */}
        <div 
          className={`inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-100 text-sm mb-8 border border-white/20 animate-pulse transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          <Zap size={16} className="text-yellow-300" />
          <span>Since 2019 • Premium Quality Products</span>
        </div>
        
        <h1 
          className={`text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 leading-tight tracking-tight transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '200ms' }}
        >
          Building the Future with Innovation
        </h1>
        
        {/* Rotating features section */}
        <div className="h-12 mb-6 overflow-hidden relative">
          {features.map((feature, index) => (
            <p 
              key={feature}
              className={`text-2xl md:text-4xl font-light text-blue-100 absolute w-full transition-all duration-500 ${
                activeFeature === index 
                  ? 'opacity-100 transform-none' 
                  : 'opacity-0 -translate-y-8'
              }`}
            >
              <span className="text-yellow-300"><Sparkles size={24} className="inline mr-2" /></span>
              {feature}
            </p>
          ))}
        </div>
        
        <p 
          className={`mb-10 text-blue-100 max-w-2xl mx-auto text-lg transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '600ms' }}
        >
          {companyInfo.description}
        </p>
        
        <div 
          className={`flex flex-col sm:flex-row gap-5 justify-center mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '800ms' }}
        >
          <a
            href="#internship"
            className="group bg-white hover:bg-blue-50 text-blue-800 px-8 py-4 rounded-full font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Apply for Internship
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#about"
            className="border border-white/30 backdrop-blur-sm bg-white/5 text-white hover:bg-white/20 px-8 py-4 rounded-full font-medium flex items-center justify-center transition-all"
          >
            Learn More
          </a>
        </div>
        
        {/* Key features list with icons */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-3 gap-3 max-w-3xl mx-auto mb-12 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '1000ms' }}
        >
          {[
            'Premium quality products',
            'Reliable service & delivery',
            'Experienced team',
            'Sophisticated infrastructure',
            'Ethical business practices',
            'Customization options'
          ].map((feature, i) => (
            <div 
              key={i} 
              className="flex items-center p-2 text-left"
              style={{ transitionDelay: `${1000 + i * 100}ms` }}
            >
              <Check size={18} className="text-green-400 mr-2 flex-shrink-0" />
              <span className="text-blue-100 text-sm">{feature}</span>
            </div>
          ))}
        </div>
        
        {/* Featured metrics */}
        <div 
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-3xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ transitionDelay: '1200ms' }}
        >
          {[
            { label: 'Years of Excellence', value: '5+' },
            { label: 'Clients Served', value: '250+' },
            { label: 'Products Available', value: '500+' },
            { label: 'Cities Reached', value: '30+' }
          ].map((stat, i) => (
            <div 
              key={i} 
              className="flex flex-col items-center p-4 rounded-xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              style={{ transitionDelay: `${1200 + i * 100}ms` }}
            >
              <span className="text-3xl font-bold text-white mb-1">{stat.value}</span>
              <span className="text-blue-100 text-sm">{stat.label}</span>
            </div>
          ))}
        </div>
        
        {/* Trust indicators */}
        <div 
          className={`flex flex-wrap justify-center gap-4 items-center mt-12 max-w-xl mx-auto transition-opacity duration-1000 ${isLoaded ? 'opacity-80' : 'opacity-0'}`} 
          style={{ transitionDelay: '1400ms' }}
        >
          <div className="flex items-center">
            <Star fill="currentColor" className="h-4 w-4 text-yellow-300" />
            <Star fill="currentColor" className="h-4 w-4 text-yellow-300" />
            <Star fill="currentColor" className="h-4 w-4 text-yellow-300" />
            <Star fill="currentColor" className="h-4 w-4 text-yellow-300" />
            <Star fill="currentColor" className="h-4 w-4 text-yellow-300" />
            <span className="ml-2 text-sm text-blue-100">Trusted by businesses across India</span>
          </div>
        </div>
        
        {/* Subtle scroll indicator */}
        <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center transition-opacity duration-500 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
          <span className="text-sm mb-2">Scroll to explore</span>
          <ChevronDown size={24} className="animate-bounce" />
        </div>
      </div>
      
      {/* Image as decorative element */}
      <div className="absolute -bottom-40 w-full h-80 bg-gradient-to-t from-white/5 to-transparent" style={{ 
        maskImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', 
        WebkitMaskImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' 
      }}></div>
    </div>
  );
};

export default Hero; 