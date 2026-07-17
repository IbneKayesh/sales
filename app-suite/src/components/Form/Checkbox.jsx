import { useId } from 'react';

import { IconCheck } from '@/assets/icons';
import './Checkbox.css';
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
    <label className={`d-inline-flex ai-center gap-1 cursor-pointer user-select-none py-1 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className || ''}`} htmlFor={inputId}>
      <span className={`d-flex ai-center jc-center w-14 h-14 rounded-sm border flex-shrink-0 ${checked ? 'checked' : ''} ${disabled ? 'checkboxDisabled' : ''}`}>
        {checked && <IconCheck className="w-9 h-9 text-white" />}
      </span>
      <input
        id={inputId}
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && <span className="fs-11 text-primary">{label}</span>}
    </label>
  );
};

export default Checkbox;
