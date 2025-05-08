import React from 'react';
import ErrorBoundary from './components/ErrorBoundary';
import { companyInfo } from './data/companyInfo';

const SimplePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Simplified Navbar */}
      <ErrorBoundary>
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold">{companyInfo.name}</h1>
          </div>
        </nav>
      </ErrorBoundary>
      
      <main className="flex-grow">
        {/* Simplified Hero */}
        <ErrorBoundary>
          <section className="bg-blue-900 text-white py-20">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold mb-4">{companyInfo.name}</h2>
              <p className="text-xl mb-6">{companyInfo.tagline}</p>
              <p className="mb-8 max-w-2xl">{companyInfo.description}</p>
            </div>
          </section>
        </ErrorBoundary>
        
        {/* Simplified About */}
        <ErrorBoundary>
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-700 mb-4">{companyInfo.description}</p>
                <p className="text-gray-700">Founded in {companyInfo.founded}</p>
              </div>
            </div>
          </section>
        </ErrorBoundary>
        
        {/* Simplified Services */}
        <ErrorBoundary>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-8">Our Products & Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companyInfo.productCategories?.map((category, index) => (
                  <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                    <h3 className="text-xl font-bold mb-2">{category}</h3>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </ErrorBoundary>
      </main>
      
      {/* Simplified Footer */}
      <ErrorBoundary>
        <footer className="bg-gray-900 text-white py-8">
          <div className="container mx-auto px-4">
            <p>&copy; {new Date().getFullYear()} {companyInfo.name}</p>
            <p>Contact: {companyInfo.contact?.email}</p>
          </div>
        </footer>
      </ErrorBoundary>
    </div>
  );
};

export default SimplePage; 