import React from 'react';
import './JCard.css';

const JCard = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  className = '',
  headerAction,
  compact = true,
  ...props 
}) => {
  return (
    <div className={`j-card ${compact ? 'j-card-compact' : ''} ${className}`} {...props}>
      {(title || subtitle || headerAction) && (
        <div className="j-card-header">
          <div className="j-card-header-titles">
            {title && <h3 className="j-card-title">{title}</h3>}
            {subtitle && <p className="j-card-subtitle">{subtitle}</p>}
          </div>
          {headerAction && <div className="j-card-header-action">{headerAction}</div>}
        </div>
      )}
      <div className="j-card-body">
        {children}
      </div>
      {footer && (
        <div className="j-card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

export default JCard;