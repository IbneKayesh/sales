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
  const handleChange = (e) => {
    onChange?.(id, e.target.value);
  };

  return (
    <div className="input-box">
      {label && (
        <label className="input-label" htmlFor={id}>
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={`input-text ${disabled ? "input-disabled" : ""}`}
        placeholder={placeholder}
      ></input>
      {error && <span className="input-error">{error}</span>}
    </div>
  );
};

export default TextInput;
