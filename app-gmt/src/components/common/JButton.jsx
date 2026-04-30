import React from 'react';
import './JButton.css';

const JButton = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  icon,
  disabled = false,
  loading = false,
  ...props 
}) => {
  const baseClass = 'j-button';
  const variantClass = `j-button-${variant}`;
  const sizeClass = `j-button-${size}`;
  const stateClass = loading ? 'j-button-loading' : (disabled ? 'j-button-disabled' : '');
  
  return (
    <button 
      className={`${baseClass} ${variantClass} ${sizeClass} ${stateClass} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {icon && !loading && <span className="j-button-icon">{icon}</span>}
      {children && <span className="j-button-text">{children}</span>}
    </button>
  );
};

export default JButton;
