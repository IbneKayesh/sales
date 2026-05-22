import React from 'react';

export default function PriorityBadge({ priority }) {
  if (!priority) return null;
  
  const displayPriority = priority.toUpperCase();
  const className = `priority-badge priority-${priority.toLowerCase()}`;
  
  return (
    <span className={className}>
      {displayPriority}
    </span>
  );
}
