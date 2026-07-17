import { useId } from 'react';

import './InputText.css';
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
  onChange,
  ...props
}) => {
  const generatedId = useId();
  const inputId = externalId || generatedId;

  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={`d-flex flex-column gap-2 ${wrapperClassName || ''}`}>
      {label && (
        <label className="fs-10 fw-600 text-secondary text-uppercase user-select-none" htmlFor={inputId} style={{letterSpacing:'0.3px'}}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}
      <div className={`pos-relative d-flex ai-center w-100 rounded-sm border bg-transparent ${error ? 'inputError' : ''} ${disabled ? 'inputDisabled' : ''} ${className || ''}`}>
        {icon && (
          <span className="iconLeft">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          type="text"
          className={`input w-100 px-2 py-1-5 border-none bg-none fs-11 ${icon ? 'inputWithIcon' : ''} ${inputClassName || ''}`}
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

export default InputText;
