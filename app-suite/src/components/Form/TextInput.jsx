import React, { useId } from "react";
import './TextInput.css';

const TextInput = ({
  id,
  value,
  required,
  disabled,
  onChange,
  label,
  error,
  placeholder
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="input-box">
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type="text"
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={`input-text ${disabled ? "input-disabled" : ""} ${error ? "input-error" : ""}`}
        placeholder={placeholder}
      ></input>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default TextInput;
