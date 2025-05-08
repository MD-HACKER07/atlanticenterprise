import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  className?: string;
  variant?: 'default' | 'outline' | 'text';
  to?: string;
  label?: string;
  iconOnly?: boolean;
  useHistory?: boolean;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  className = '',
  variant = 'outline',
  to = '',
  label = 'Back',
  iconOnly = false,
  useHistory = false
}) => {
  const navigate = useNavigate();
  
  // Base classes for different variants
  const variantClasses = {
    default: 'bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white',
    outline: 'border border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-800',
    text: 'text-blue-600 hover:text-blue-800'
  };

  // Base padding and rounded classes
  const baseClasses = 'inline-flex items-center transition-all duration-200 font-medium';
  const paddingClasses = iconOnly ? 'p-2' : 'px-3 py-1.5';
  const roundedClasses = 'rounded-full';
  
  const handleGoBack = () => {
    navigate(-1);
  };
  
  // If useHistory is true, render a button that uses browser history
  if (useHistory) {
    return (
      <button 
        onClick={handleGoBack} 
        className={`${baseClasses} ${paddingClasses} ${roundedClasses} ${variantClasses[variant]} ${className}`}
        aria-label={label}
      >
        <ArrowLeft className={`w-4 h-4 ${iconOnly ? '' : 'mr-2'}`} />
        {!iconOnly && <span>{label}</span>}
      </button>
    );
  }
  
  // Otherwise, render a Link to a specific route
  return (
    <Link 
      to={to} 
      className={`${baseClasses} ${paddingClasses} ${roundedClasses} ${variantClasses[variant]} ${className}`}
      aria-label={label}
    >
      <ArrowLeft className={`w-4 h-4 ${iconOnly ? '' : 'mr-2'}`} />
      {!iconOnly && <span>{label}</span>}
    </Link>
  );
};

export default BackButton; 