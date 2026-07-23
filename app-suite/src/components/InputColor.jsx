import { useState } from 'react'

export default function InputColor({
  id,
  label,
  value = '#7c3aed',
  onChange,
  placeholder = 'Select color...',
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = id || name || `icl-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div
      className={`input-color${focused ? ' input-color--focused' : ''}${error ? ' input-color--error' : ''}${disabled ? ' input-color--disabled' : ''}${dense ? ' input-color--dense' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-color__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-color__required">*</span>}
        </label>
      )}
      <div className="input-color__wrap">
        <span
          className="input-color__swatch"
          style={{ backgroundColor: value || '#ffffff' }}
        >
          <input
            id={inputId}
            type="color"
            className="input-color__input"
            value={value || '#ffffff'}
            onChange={onChange}
            disabled={disabled}
            required={required}
            name={name}
            aria-invalid={!!error}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        </span>
        <span className={`input-color__value${!value ? ' input-color__value--placeholder' : ''}`}>{value || placeholder}</span>
      </div>
      {error && <span className="input-color__error">{error}</span>}
    </div>
  )
}
