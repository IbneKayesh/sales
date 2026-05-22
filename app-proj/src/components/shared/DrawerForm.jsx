import React, { useEffect } from 'react';

export default function DrawerForm({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onSubmit, 
  isSaving = false,
  submitText = 'Save'
}) {
  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h3 className="drawer-title">{title}</h3>
          <button className="drawer-close-btn" onClick={onClose} aria-label="Close panel">
            &times;
          </button>
        </div>
        
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="drawer-form-container">
          <div className="drawer-body">
            {children}
          </div>
          
          <div className="drawer-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Saving...
                </>
              ) : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
