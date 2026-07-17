import { useState } from 'react'

export default function InputText({
  label,
  placeholder,
  value,
  onChange,
  error,
  icon,
  iconRight,
  type = 'text',
  disabled = false,
  readOnly = false,
  required = false,
  name,
  id,
  maxLength,
  dense = false,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = id || name || `it-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div
      className={`input-text${focused ? ' input-text--focused' : ''}${error ? ' input-text--error' : ''}${disabled ? ' input-text--disabled' : ''}${dense ? ' input-text--dense' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-text__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-text__required">*</span>}
        </label>
      )}
      <div className="input-text__wrap">
        {icon && <span className="input-text__icon input-text__icon--left">{icon}</span>}
        <input
          id={inputId}
          type={type}
          className="input-text__input"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          name={name}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {iconRight && <span className="input-text__icon input-text__icon--right">{iconRight}</span>}
      </div>
      {error && <span className="input-text__error">{error}</span>}
    </div>
  )
}
