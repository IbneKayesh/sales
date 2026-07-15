import React, { useId } from 'react';
import styles from './InputText.module.css';

const InputText = ({
  label,
  error,
  icon,
  className,
  inputClassName,
  wrapperClassName,
  id: externalId,
  required,
  disabled,
  ...props
}) => {
  const generatedId = useId();
  const inputId = externalId || generatedId;

  return (
    <div className={`${styles.wrapper} ${wrapperClassName || ''}`}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}
      <div className={`${styles.inputContainer} ${error ? styles.inputError : ''} ${disabled ? styles.inputDisabled : ''} ${className || ''}`}>
        {icon && (
          <span className={styles.iconLeft}>
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          className={`${styles.input} ${icon ? styles.inputWithIcon : ''} ${inputClassName || ''}`}
          required={required}
          disabled={disabled}
          {...props}
        />
      </div>
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

export default InputText;
