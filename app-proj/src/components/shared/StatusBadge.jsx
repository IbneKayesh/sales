import React from 'react';

export default function StatusBadge({ status }) {
  if (!status) return null;
  
  const displayStatus = status.replace('-', ' ').toUpperCase();
  const className = `status-badge status-${status.toLowerCase()}`;
  
  return (
    <span className={className}>
      {displayStatus}
    </span>
  );
}
