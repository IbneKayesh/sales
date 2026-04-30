import React from 'react';
import { X } from 'lucide-react';
import JButton from './JButton';
import './JDialog.css';

const JDialog = ({ 
  visible, 
  title, 
  subtitle, 
  footer, 
  children, 
  onClose,
  width = '500px'
}) => {
  if (!visible) return null;

  return (
    <div className="j-dialog-overlay">
      <div className="j-dialog" style={{ maxWidth: width }}>
        <div className="j-dialog-header">
          <div className="header-text">
            <h2 className="j-dialog-title">{title}</h2>
            {subtitle && <p className="j-dialog-subtitle">{subtitle}</p>}
          </div>
          <JButton 
            variant="ghost" 
            icon={<X size={18} />} 
            onClick={onClose} 
            className="j-dialog-close-btn"
          />
        </div>
        
        <div className="j-dialog-body">
          {children}
        </div>

        {footer && (
          <div className="j-dialog-footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default JDialog;
