import { useState } from 'react'

export default function InputSlider({
  id,
  label,
  value = 50,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  showValue = true,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = id || name || `isl-${Math.random().toString(36).slice(2, 8)}`

  const pct = max !== min ? ((value - min) / (max - min)) * 100 : 0

  return (
    <div
      className={`input-slider${focused ? ' input-slider--focused' : ''}${error ? ' input-slider--error' : ''}${disabled ? ' input-slider--disabled' : ''}${dense ? ' input-slider--dense' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-slider__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-slider__required">*</span>}
        </label>
      )}
      <div className="input-slider__body">
        <div className="input-slider__track-wrap">
          <div className="input-slider__track">
            <div
              className="input-slider__fill"
              style={{ width: `${pct}%` }}
            />
            <input
              id={inputId}
              type="range"
              className="input-slider__input"
              value={value}
              onChange={onChange}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
              required={required}
              name={name}
              aria-invalid={!!error}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              {...rest}
            />
            <div
              className="input-slider__thumb"
              style={{ left: `${pct}%` }}
              aria-hidden="true"
            />
          </div>
        </div>
        {showValue && (
          <output className="input-slider__value" htmlFor={inputId}>
            {value}
          </output>
        )}
      </div>
      {error && <span className="input-slider__error">{error}</span>}
    </div>
  )
}
