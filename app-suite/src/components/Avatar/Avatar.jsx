import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({ src, alt = 'User Avatar', size = 'medium', className = '' }) => {
  const sizeClass = styles[size] || styles.medium;
  
  return (
    <div className={`${styles.avatarContainer} ${sizeClass} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className={styles.avatarImg} />
      ) : (
        <span className={styles.initials}>{alt.charAt(0).toUpperCase()}</span>
      )}
    </div>
  );
};

export default Avatar;
