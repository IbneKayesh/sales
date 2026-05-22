import React from 'react';

export default function ProgressBar({ progress = 0, size = 'md', showValue = true }) {
  const percentage = Math.min(Math.max(Math.round(progress), 0), 100);
  
  // Decide a track color theme based on completion
  let colorTheme = 'primary';
  if (percentage === 100) colorTheme = 'success';
  else if (percentage > 70) colorTheme = 'info';
  else if (percentage < 30) colorTheme = 'warning';
  
  return (
    <div className={`progress-bar-container size-${size}`}>
      <div className="progress-bar-track">
        <div 
          className={`progress-bar-fill theme-${colorTheme}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <span className="progress-bar-label">{percentage}%</span>
      )}
    </div>
  );
}
