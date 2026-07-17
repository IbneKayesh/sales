import { useState, useRef, useEffect } from 'react'
import { IconCalendar, IconChevronLeft, IconChevronRight } from '../icons'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export default function InputCalendar({
  label,
  value = '',
  onChange,
  placeholder = 'Select date...',
  disabled = false,
  required = false,
  name,
  error,
  className = '',
  format = 'YYYY-MM-DD',
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(false)
  const [viewYear, setViewYear] = useState(new Date().getFullYear())
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())
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

  const selectedDate = value ? new Date(value + 'T00:00:00') : null

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const firstDay = new Date(viewYear, viewMonth, 1).getDay()

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(viewMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(viewMonth + 1)
    }
  }

  const handleSelectDay = (day) => {
    const month = String(viewMonth + 1).padStart(2, '0')
    const d = String(day).padStart(2, '0')
    const dateStr = `${viewYear}-${month}-${d}`
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

  const isSelected = (day) => {
    if (!selectedDate || isNaN(selectedDate.getTime())) return false
    return selectedDate.getFullYear() === viewYear &&
      selectedDate.getMonth() === viewMonth &&
      selectedDate.getDate() === day
  }

  const isToday = (day) => {
    return todayStr === `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<span key={`e-${i}`} className="input-calendar__day input-calendar__day--empty" />)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(
      <button
        key={d}
        type="button"
        className={`input-calendar__day${isSelected(d) ? ' input-calendar__day--selected' : ''}${isToday(d) ? ' input-calendar__day--today' : ''}`}
        onClick={() => handleSelectDay(d)}
      >
        {d}
      </button>,
    )
  }

  return (
    <div
      className={`input-calendar${focused ? ' input-calendar--focused' : ''}${error ? ' input-calendar--error' : ''}${disabled ? ' input-calendar--disabled' : ''}${open ? ' input-calendar--open' : ''}${className ? ' ' + className : ''}`}
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
          <div className="input-calendar__nav">
            <button type="button" className="input-calendar__nav-btn" onClick={handlePrevMonth} aria-label="Previous month">
              <IconChevronLeft size={14} />
            </button>
            <span className="input-calendar__nav-label">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button type="button" className="input-calendar__nav-btn" onClick={handleNextMonth} aria-label="Next month">
              <IconChevronRight size={14} />
            </button>
          </div>
          <div className="input-calendar__grid">
            {DAYS.map((d) => (
              <span key={d} className="input-calendar__day input-calendar__day--header">{d}</span>
            ))}
            {days}
          </div>
        </div>
      )}
      {error && <span className="input-calendar__error">{error}</span>}
    </div>
  )
}
