import { useId } from 'react';

import './TextArea.css';
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
    <div className={`d-flex flex-column gap-2 ${className || ''}`}>
      {label && (
        <label className="fs-10 fw-600 text-secondary text-uppercase user-select-none" htmlFor={inputId} style={{letterSpacing:'0.3px'}}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <div className={`pos-relative d-flex ai-start w-100 rounded-sm border bg-transparent ${error ? 'containerError' : ''} ${disabled ? 'containerDisabled' : ''}`}>
        <textarea
          id={inputId}
          className="textarea w-100 px-2 py-1-5 border-none bg-none fs-11"
          rows={rows}
          required={required}
          disabled={disabled}
          onChange={handleChange}
          {...props}
        />
      </div>
      {error && <span className="fs-9 text-danger" style={{lineHeight:'1.2', minHeight:'10px'}}>{error}</span>}
    </div>
  );
};

export default TextArea;
