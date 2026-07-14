import React from 'react';
import { getAppIcon } from '@/routes/appConfig';
import styles from './DesktopIcon.module.css';

const DesktopIcon = ({ id, label, isSelected, onClick, onDoubleClick }) => {
  const Icon = getAppIcon(id);

  return (
    <button
      className={`${styles.iconContainer} ${isSelected ? styles.iconSelected : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
      aria-label={`${label} Shortcut`}
    >
      <div className={styles.iconWrapper}>
        <div className={styles.iconGlow} />
        {Icon ? <Icon className={styles.iconSvg} /> : null}
      </div>
      <span className={styles.iconLabel}>{label}</span>
    </button>
  );
};

export default DesktopIcon;
