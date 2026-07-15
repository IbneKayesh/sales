import React, { useId } from 'react';
import { IconCheck } from '@/assets/icons';
import styles from './Checkbox.module.css';

const Checkbox = ({
  label,
  checked,
  onChange,
  id: externalId,
  disabled,
  className,
  ...props
}) => {
  const generatedId = useId();
  const inputId = externalId || generatedId;

  return (
    <label className={`${styles.wrapper} ${disabled ? styles.disabled : ''} ${className || ''}`} htmlFor={inputId}>
      <span className={`${styles.checkbox} ${checked ? styles.checked : ''} ${disabled ? styles.checkboxDisabled : ''}`}>
        {checked && <IconCheck className={styles.checkIcon} />}
      </span>
      <input
        id={inputId}
        type="checkbox"
        className={styles.nativeInput}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
};

export default Checkbox;
