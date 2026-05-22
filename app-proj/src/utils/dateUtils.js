/**
 * Formats an ISO date string (YYYY-MM-DD or TIMESTAMP) into a user-friendly format: e.g., "Jan 15, 2026"
 */
export function formatDate(dateString) {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (err) {
    return '—';
  }
}

/**
 * Checks if a given end date is before today, provided the status is not completed/done.
 */
export function isOverdue(endDateString, status) {
  if (!endDateString) return false;
  
  // Completed statuses are never overdue
  const normalizedStatus = (status || '').toLowerCase();
  if (['complete', 'completed', 'done'].includes(normalizedStatus)) {
    return false;
  }

  try {
    const end = new Date(endDateString);
    if (isNaN(end.getTime())) return false;
    
    // Set end to the very end of the day, and today to the start of the day
    end.setHours(23, 59, 59, 999);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return end < today;
  } catch (err) {
    return false;
  }
}

/**
 * Computes the remaining days or formatted duration string.
 */
export function getDurationText(startDateString, endDateString) {
  if (!startDateString && !endDateString) return 'Not scheduled';
  if (startDateString && !endDateString) return `Starts ${formatDate(startDateString)}`;
  if (!startDateString && endDateString) return `Ends ${formatDate(endDateString)}`;

  try {
    const start = new Date(startDateString);
    const end = new Date(endDateString);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 'Invalid schedule';
    
    const diffTime = end - start;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'End precedes start';
    return `${formatDate(startDateString)} - ${formatDate(endDateString)} (${diffDays} days)`;
  } catch (err) {
    return 'Invalid schedule';
  }
}

/**
 * Gets days remaining until the end date.
 */
export function getDaysRemaining(endDateString) {
  if (!endDateString) return null;
  try {
    const end = new Date(endDateString);
    if (isNaN(end.getTime())) return null;
    
    end.setHours(23, 59, 59, 999);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (err) {
    return null;
  }
}
