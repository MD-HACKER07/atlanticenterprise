import React from 'react';
import { Star, Quote } from 'lucide-react';
import SEO from '../components/SEO';

const ReviewsPage: React.FC = () => {
  // Sample internship reviews
  const reviews = [
    {
      id: 1,
      name: 'Priya Sharma',
      position: 'AI Automation Intern',
      rating: 5,
      date: 'May 2023',
      comment: 'The AI Automation internship at Atlantic Enterprise was an outstanding experience. I got hands-on experience with cutting-edge technologies and the mentorship was excellent. This internship in Pune was exactly what I needed for my career growth.',
      imageUrl: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: 2,
      name: 'Rahul Patel',
      position: 'Hardware Engineering Intern',
      rating: 5,
      date: 'June 2023',
      comment: 'Best internship experience I could have asked for! The hardware engineering team at Atlantic Enterprise provided me with meaningful projects and constant guidance. I recommend this Pune-based internship to anyone interested in hardware.',
      imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    {
      id: 3,
      name: 'Anjali Desai',
      position: 'Technical Intern',
      rating: 4,
      date: 'August 2023',
      comment: 'My internship at Atlantic Enterprise helped me develop practical skills that I couldn\'t learn in classroom. The team was supportive and I got to work on real projects that added value to the company and my portfolio.',
      imageUrl: 'https://randomuser.me/api/portraits/women/68.jpg'
    },
    {
      id: 4,
      name: 'Vikram Singh',
      position: 'AI Research Intern',
      rating: 5,
      date: 'October 2023',
      comment: 'Atlantic Enterprise offers one of the best internship programs in Pune. I worked on AI research projects that were challenging and rewarding. The experience I gained here was instrumental in securing my full-time role.',
      imageUrl: 'https://randomuser.me/api/portraits/men/11.jpg'
    },
    {
      id: 5,
      name: 'Neha Kapoor',
      position: 'Product Development Intern',
      rating: 4,
      date: 'December 2023',
      comment: 'My internship experience at Atlantic Enterprise was fantastic. The product development team was welcoming and I learned so much about the entire development lifecycle. This Pune-based internship exceeded my expectations.',
      imageUrl: 'https://randomuser.me/api/portraits/women/26.jpg'
    }
  ];

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        size={16} 
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 pb-16">
      <SEO 
        title="Internship Reviews | Atlantic Enterprise Pune"
        description="Read reviews from interns who completed internships at Atlantic Enterprise in Pune. Learn about our AI automation, hardware, and technical internship experiences."
        keywords={["internship reviews", "internship in Pune reviews", "best internship reviews", "atlanticenterprise internship", "AI automation internship review", "Pune internship testimonials"]}
        canonicalUrl="https://atlanticenterprise.in/reviews"
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Internship Reviews</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from our past interns about their experiences at Atlantic Enterprise in Pune
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-md p-6 transition-transform hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start mb-4">
                <img 
                  src={review.imageUrl} 
                  alt={review.name} 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-gray-600 text-sm">{review.position}</p>
                  <div className="flex mt-1">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <div className="relative pl-8">
                <Quote className="absolute top-0 left-0 text-blue-100 h-6 w-6" />
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ready to Experience Our Internship Program?</h2>
          <a 
            href="/internships" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition-colors"
          >
            Browse Available Internships
          </a>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage; 