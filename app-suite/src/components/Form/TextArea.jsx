import React, { useId } from 'react';
import styles from './TextArea.module.css';

const TextArea = ({
  label,
  error,
  className,
  id: externalId,
  required,
  disabled,
  rows = 3,
  onChange,
  ...props
}) => {
  const generatedId = useId();
  const inputId = externalId || generatedId;

  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={`${styles.container} ${error ? styles.containerError : ''} ${disabled ? styles.containerDisabled : ''}`}>
        <textarea
          id={inputId}
          className={styles.textarea}
          rows={rows}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default TextArea;
