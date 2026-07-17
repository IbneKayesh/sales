import { useState } from 'react'

export default function InputNumber({
  label,
  value = '',
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = name || `in-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div
      className={`input-number${focused ? ' input-number--focused' : ''}${error ? ' input-number--error' : ''}${disabled ? ' input-number--disabled' : ''}${dense ? ' input-number--dense' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-number__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-number__required">*</span>}
        </label>
      )}
      <div className="input-number__wrap">
        <input
          id={inputId}
          type="number"
          className="input-number__input"
          value={value}
          onChange={onChange}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          name={name}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </div>
      {error && <span className="input-number__error">{error}</span>}
    </div>
  )
}
