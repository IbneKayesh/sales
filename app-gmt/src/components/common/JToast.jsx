import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAppUI } from '../../hooks/useAppUI';
import './JToast.css';

const JToast = () => {
  const { toasts } = useAppUI();

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={18} />;
      case 'danger': return <AlertCircle size={18} />;
      case 'info': return <Info size={18} />;
      default: return <Info size={18} />;
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="j-toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`j-toast j-toast-${toast.type} slide-in-right`}>
          <div className="j-toast-icon">{getIcon(toast.type)}</div>
          <div className="j-toast-content">
            <div className="j-toast-message">{toast.message}</div>
            {toast.details && <div className="j-toast-details">{toast.details}</div>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JToast;
