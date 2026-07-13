import React, { useState, useEffect } from 'react';
import styles from './Clock.module.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 5000);
    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };
    return date.toLocaleDateString('en-US', options).replace(/,/g, '');
  };

  return (
    <div className={styles.clock} aria-label="System Clock">
      {formatDateTime(time)}
    </div>
  );
};

export default Clock;
