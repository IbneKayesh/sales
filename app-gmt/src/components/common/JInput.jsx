import React from 'react';
import './JInput.css';

const JInput = ({ 
  label, 
  error, 
  status = 'neutral', // neutral, success, error
  size = 'md', 
  className = '', 
  id,
  type = 'text',
  rows,
  ...props 
}) => {
  const finalStatus = error ? 'error' : status;
  const containerClass = `j-input-container j-input-${size} j-input-status-${finalStatus} ${className}`;
  const inputId = id || `j-input-${Math.random().toString(36).substr(2, 9)}`;

  const isTextarea = type === 'textarea' || rows;

  return (
    <div className={containerClass}>
      {label && <label htmlFor={inputId} className="j-input-label">{label}</label>}
      {isTextarea ? (
        <textarea 
          id={inputId}
          className="j-input-field"
          rows={rows || 3}
          {...props} 
        />
      ) : (
        <input 
          id={inputId}
          type={type}
          className={`j-input-field ${finalStatus === 'error' ? 'j-input-field-error' : ''}`}
          aria-invalid={finalStatus === 'error'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props} 
        />
      )}
      {error && <span id={`${inputId}-error`} className="j-input-error-text" role="alert">{error}</span>}
    </div>
  );
};

export default JInput;
