import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAppUI } from '../../hooks/useAppUI';
import JButton from './JButton';
import './JAlert.css';

const JAlert = () => {
  const { alert, hideAlert } = useAppUI();

  if (!alert) return null;

  const handleOk = () => {
    if (alert.onOk) alert.onOk();
    hideAlert();
  };

  return (
    <div className="j-alert-overlay" onClick={hideAlert}>
      <div className="j-alert-container scale-in" onClick={(e) => e.stopPropagation()}>
        <div className="j-alert-header">
          <AlertTriangle className="j-alert-icon" size={20} />
          <h3 className="j-alert-title">{alert.title || 'Confirm'}</h3>
        </div>
        <div className="j-alert-body">
          {alert.message}
        </div>
        <div className="j-alert-footer">
          <JButton variant="outline" size="sm" onClick={hideAlert}>
            Cancel
          </JButton>
          <JButton variant="primary" size="sm" onClick={handleOk}>
            Confirm
          </JButton>
        </div>
      </div>
    </div>
  );
};

export default JAlert;
