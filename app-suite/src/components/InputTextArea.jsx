import { useState } from 'react'

export default function InputTextArea({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  rows = 4,
  maxLength,
  dense = false,
  resizable = true,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = id || name || `ita-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div
      className={`input-textarea${focused ? ' input-textarea--focused' : ''}${error ? ' input-textarea--error' : ''}${disabled ? ' input-textarea--disabled' : ''}${dense ? ' input-textarea--dense' : ''}${resizable ? '' : ' input-textarea--no-resize'}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-textarea__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-textarea__required">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        className="input-textarea__textarea"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        rows={rows}
        maxLength={maxLength}
        aria-invalid={!!error}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {error && <span className="input-textarea__error">{error}</span>}
    </div>
  )
}
