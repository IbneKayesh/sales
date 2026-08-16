import { useState, useRef, useEffect } from 'react'
import { IconCalendar } from '../icons'
import Calendar from './Calendar'

export default function InputCalendar({
  label,
  value = '',
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = '',
  format = 'YYYY-MM-DD',
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef(null)
  const inputId = name || `ic-${Math.random().toString(36).slice(2, 8)}`

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selectedDate = value ? new Date((value.includes('T') ? value.split('T')[0] : value) + 'T00:00:00') : null

  const handleSelectDay = (dateStr) => {
    if (onChange) onChange({ target: { value: dateStr, name } })
    setOpen(false)
  }

  const formatDisplay = () => {
    if (!value) return ''
    if (!selectedDate || isNaN(selectedDate.getTime())) return value
    const y = selectedDate.getFullYear()
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const d = String(selectedDate.getDate()).padStart(2, '0')
    if (format === 'DD/MM/YYYY') return `${d}/${m}/${y}`
    if (format === 'MM/DD/YYYY') return `${m}/${d}/${y}`
    return `${y}-${m}-${d}`
  }

  return (
    <div
      className={`input-calendar${focused ? ' input-calendar--focused' : ''}${error ? ' input-calendar--error' : ''}${disabled ? ' input-calendar--disabled' : ''}${open ? ' input-calendar--open' : ''}${dense ? ' input-calendar--dense' : ''}${className ? ' ' + className : ''}`}
      ref={wrapRef}
    >
      {label && (
        <label className="input-calendar__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-calendar__required">*</span>}
        </label>
      )}
      <div className="input-calendar__trigger" onClick={() => !disabled && setOpen(!open)}>
        <span className="input-calendar__icon">
          <IconCalendar size={16} />
        </span>
        <input
          id={inputId}
          type="text"
          className="input-calendar__input"
          value={formatDisplay()}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          name={name}
          readOnly
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
      </div>
      {open && (
        <div className="input-calendar__popup">
          <Calendar value={value} onSelect={handleSelectDay} />
        </div>
      )}
      {error && <span className="input-calendar__error">{error}</span>}
    </div>
  )
}
