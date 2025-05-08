import React from 'react';
import { Quote } from 'lucide-react';
import { Testimonial } from '../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial }) => {
  const { name, role, company, image, testimonial: text } = testimonial;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative overflow-hidden">
      <div className="absolute top-4 right-4 text-blue-100">
        <Quote size={48} className="opacity-30" />
      </div>
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-500"
        />
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm">{role}</p>
          <p className="text-blue-600 text-sm font-medium">{company}</p>
        </div>
      </div>
      <p className="text-gray-700 relative z-10">"{text}"</p>
    </div>
  );
};

export default TestimonialCard;