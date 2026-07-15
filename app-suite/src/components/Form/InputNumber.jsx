import React, { useId } from 'react';
import styles from './InputNumber.module.css';

const InputNumber = ({
  label,
  error,
  id: externalId,
  className,
  required,
  disabled,
  min,
  max,
  step,
  ...props
}) => {
  const generatedId = useId();
  const inputId = externalId || generatedId;

  return (
    <div className={`${styles.wrapper} ${className || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={`${styles.inputContainer} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''}`}>
        <input
          id={inputId}
          type="number"
          className={styles.input}
          min={min}
          max={max}
          step={step}
          required={required}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default InputNumber;
