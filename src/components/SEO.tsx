import React, { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  ogImage?: string;
  ogType?: string;
  canonicalUrl?: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage = 'https://atlanticenterprise.in/logo.png', // Default image
  ogType = 'website',
  canonicalUrl,
}) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Atlantic Enterprise`;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords.join(', '));
    
    // Add Microsoft Bing verification
    updateMetaTag('msvalidate.01', '3349E6DC4567AD7A344F0AEA0F1201A1');
    
    // Add Google verification if needed
    // updateMetaTag('google-site-verification', 'YOUR_GOOGLE_VERIFICATION_CODE');
    
    // Additional SEO meta tags
    updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    updateMetaTag('author', 'Atlantic Enterprise');
    updateMetaTag('revisit-after', '7 days');
    
    // Open Graph tags for better social sharing
    updateMetaTag('og:title', `${title} | Atlantic Enterprise`);
    updateMetaTag('og:description', description);
    updateMetaTag('og:type', ogType);
    updateMetaTag('og:image', ogImage);
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:site_name', 'Atlantic Enterprise');
    updateMetaTag('og:locale', 'en_IN');
    
    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${title} | Atlantic Enterprise`);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage);
    updateMetaTag('twitter:site', '@atlanticenterprise');

    // Add structured data for local business
    addStructuredData();

    // Add canonical URL if provided
    if (canonicalUrl) {
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.setAttribute('href', canonicalUrl);
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }
    }

    // Add alternate language tags if you have multilingual support
    // addAlternateLanguageLinks();
    
    // Add mobile-specific meta tags
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');
    updateMetaTag('theme-color', '#007BFF');
    updateMetaTag('apple-mobile-web-app-capable', 'yes');
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent');

    // Cleanup function
    return () => {
      // If you need to clean up any side effects
    };
  }, [title, description, keywords, ogImage, ogType, canonicalUrl]);

  const updateMetaTag = (name: string, content: string) => {
    let metaTag = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    
    if (!metaTag) {
      metaTag = document.createElement('meta');
      if (name.startsWith('og:') || name.startsWith('twitter:')) {
        metaTag.setAttribute('property', name);
      } else {
        metaTag.setAttribute('name', name);
      }
      document.head.appendChild(metaTag);
    }
    
    metaTag.setAttribute('content', content);
  };

  const addStructuredData = () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      'name': 'Atlantic Enterprise',
      'description': 'Incorporated in the year 2019, Atlantic Enterprise offers hardware, fittings, bearings, healthcare products, and AI automation internships in Pune.',
      'url': 'https://atlanticenterprise.in',
      'logo': 'https://atlanticenterprise.in/logo.png',
      'image': 'https://atlanticenterprise.in/building.jpg',
      'telephone': '+91-7666906951',
      'email': 'atlanticenterprise7@gmail.com',
      'foundingDate': '2019',
      'priceRange': '₹₹',
      'sameAs': [
        'https://www.facebook.com/atlanticenterprise',
        'https://www.linkedin.com/company/atlanticenterprise',
        'https://twitter.com/atlanticenterprise',
        'https://www.instagram.com/atlanticenterprise'
      ],
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': '270/B, SEC NO 25, PCNTDA SINDHU NAGAR, NIGDI',
        'addressLocality': 'Pune',
        'addressRegion': 'Maharashtra',
        'postalCode': '411044',
        'addressCountry': 'IN'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': '18.621164',
        'longitude': '73.765090'
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
          ],
          'opens': '09:00',
          'closes': '18:00'
        }
      ],
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Internship Programs',
        'itemListElement': [
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'AI Automation Internship in Pune',
              'description': 'Gain hands-on experience in AI automation technologies with Atlantic Enterprise in Pune.'
            }
          },
          {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              'name': 'Hardware Internship in Pune',
              'description': 'Practical training in hardware technologies with Atlantic Enterprise in Pune.'
            }
          }
        ]
      }
    };

    // Remove any existing structured data
    const existingScript = document.querySelector('#structured-data');
    if (existingScript) {
      existingScript.remove();
    }

    // Add the new structured data
    const script = document.createElement('script');
    script.id = 'structured-data';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    // Add breadcrumb structured data
    addBreadcrumbStructuredData();
  };
  
  const addBreadcrumbStructuredData = () => {
    // Create breadcrumb schema
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(segment => segment !== '');
    
    if (pathSegments.length === 0) return; // Don't add breadcrumbs for homepage
    
    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://atlanticenterprise.in'
      }
    ];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      breadcrumbItems.push({
        '@type': 'ListItem',
        'position': index + 2,
        'name': segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
        'item': `https://atlanticenterprise.in${currentPath}`
      });
    });
    
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': breadcrumbItems
    };
    
    const existingBreadcrumb = document.querySelector('#breadcrumb-structured-data');
    if (existingBreadcrumb) {
      existingBreadcrumb.remove();
    }
    
    const script = document.createElement('script');
    script.id = 'breadcrumb-structured-data';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(breadcrumbData);
    document.head.appendChild(script);
  };

  // This component doesn't render anything visible
  return null;
};

export default SEO; 