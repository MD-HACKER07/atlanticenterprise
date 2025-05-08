import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

interface BackToHomeProps {
  className?: string;
  variant?: 'default' | 'outline' | 'text';
  iconOnly?: boolean;
}

const BackToHome: React.FC<BackToHomeProps> = ({ 
  className = '',
  variant = 'default',
  iconOnly = false
}) => {
  // Base classes for different variants
  const variantClasses = {
    default: 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white',
    outline: 'border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]',
    text: 'text-[var(--primary)] hover:text-[var(--primary-dark)]'
  };

  // Base padding and rounded classes
  const baseClasses = 'inline-flex items-center transition-all duration-200 font-medium';
  const paddingClasses = iconOnly ? 'p-2' : 'px-4 py-2';
  const roundedClasses = 'rounded-full';

  return (
    <Link 
      to="/" 
      className={`${baseClasses} ${paddingClasses} ${roundedClasses} ${variantClasses[variant]} ${className}`}
      aria-label="Back to Home"
    >
      <Home className={`w-5 h-5 ${iconOnly ? '' : 'mr-2'}`} />
      {!iconOnly && <span>Back to Home</span>}
    </Link>
  );
};

export default BackToHome; 