import { useState } from 'react'
import { IconClock } from "@/icons"

const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/

export default function InputTime({
  label,
  value = '',
  onChange,
  placeholder = 'HH:MM',
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = name || `itm-${Math.random().toString(36).slice(2, 8)}`

  const handleChange = (e) => {
    const raw = e.target.value
    // Allow native time input to pass its value through
    if (onChange) {
      onChange({ target: { value: raw, name } })
    }
  }

  const handleBlur = (e) => {
    setFocused(false)
    // Auto-format: if user types "9" or "09", leave as-is (native input handles it)
    if (onChange && value) {
      // Trim whitespace
      const trimmed = value.trim()
      if (trimmed !== value) {
        onChange({ target: { value: trimmed, name } })
      }
    }
    if (rest.onBlur) rest.onBlur(e)
  }

  const isValid = !value || TIME_REGEX.test(value)

  return (
    <div
      className={`input-time${focused ? ' input-time--focused' : ''}${error ? ' input-time--error' : ''}${disabled ? ' input-time--disabled' : ''}${dense ? ' input-time--dense' : ''}${!isValid && value ? ' input-time--error' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-time__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-time__required">*</span>}
        </label>
      )}
      <div className="input-time__wrap">
        <span className="input-time__icon">
          <IconClock size={dense ? 14 : 16} />
        </span>
        <input
          id={inputId}
          type="time"
          className="input-time__input"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          name={name}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          {...rest}
        />
      </div>
      {error && <span className="input-time__error">{error}</span>}
    </div>
  )
}
