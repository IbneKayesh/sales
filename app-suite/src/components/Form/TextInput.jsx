import { useId } from 'react';

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
    <div className="d-flex flex-column gap-2 w-100 mb-1">
      {label && (
        <label className="fs-10 fw-600 text-primary text-uppercase user-select-none" htmlFor={id} style={{letterSpacing:'0.3px'}}>
          {label}
          {required && <span className="text-danger">*</span>}
        </label>
      )}
      <input
        id={id}
        type="text"
        value={value}
        onChange={handleChange}
        required={required}
        disabled={disabled}
        className={`input-text w-100 px-2 py-1-5 border rounded-sm bg-none fs-12 text-primary ${disabled ? "text-muted cursor-not-allowed" : ""}`}
        placeholder={placeholder}
      ></input>
      {error && <span className="fs-10 text-danger" style={{lineHeight:'1.2', minHeight:'10px'}}>{error}</span>}
    </div>
  );
};

export default TextInput;
