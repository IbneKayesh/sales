import React from 'react';
import './JBusy.css';

const JBusy = ({ 
  message = 'Processing...', 
  overlay = true,
  fullApp = false,
  className = '' 
}) => {
  const containerClass = `j-busy ${fullApp ? 'j-busy-full' : overlay ? 'j-busy-overlay' : ''} ${className}`;
  
  return (
    <div className={containerClass}>
      <div className="j-busy-card">
        <div className="j-busy-spinner"></div>
        <p className="j-busy-message">{message}</p>
      </div>
    </div>
  );
};

export default JBusy;