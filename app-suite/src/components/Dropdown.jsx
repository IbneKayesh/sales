import { useState, useRef, useEffect } from 'react'
import { IconClose, IconChevronDown, IconSearch, IconCheck } from '../icons'

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  searchable = true,
  clearable = false,
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = '',
  ...rest
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [focused, setFocused] = useState(false)
  const wrapRef = useRef(null)
  const searchRef = useRef(null)
  const inputId = name || `dd-${Math.random().toString(36).slice(2, 8)}`

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  const filtered = searchable && search
    ? options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase()),
      )
    : options

  const selected = options.find((opt) => opt.value === value)
  const displayText = selected?.label || placeholder

  const handleSelect = (opt) => {
    if (onChange) onChange({ target: { value: opt.value, name } })
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    if (onChange) onChange({ target: { value: '', name } })
  }

  return (
    <div
      className={`dropdown${focused ? ' dropdown--focused' : ''}${open ? ' dropdown--open' : ''}${error ? ' dropdown--error' : ''}${disabled ? ' dropdown--disabled' : ''}${dense ? ' dropdown--dense' : ''}${className ? ' ' + className : ''}`}
      ref={wrapRef}
    >
      {label && (
        <label className="dropdown__label" htmlFor={inputId}>
          {label}
          {required && <span className="dropdown__required">*</span>}
        </label>
      )}
      <div
        id={inputId}
        className="dropdown__trigger"
        onClick={() => !disabled && setOpen(!open)}
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            !disabled && setOpen(!open)
          }
          if (e.key === 'Escape') setOpen(false)
        }}
      >
        <span className={`dropdown__value${!selected ? ' dropdown__value--placeholder' : ''}`}>
          {displayText}
        </span>
        <div className="dropdown__actions">
          {clearable && value && (
            <button
              type="button"
              className="dropdown__clear"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <IconClose size={14} />
            </button>
          )}
          <span className={`dropdown__arrow${open ? ' dropdown__arrow--open' : ''}`}>
            <IconChevronDown size={14} />
          </span>
        </div>
      </div>
      {open && (
        <div className="dropdown__menu" role="listbox">
          {searchable && (
            <div className="dropdown__search">
              <span className="dropdown__search-icon">
                <IconSearch size={14} />
              </span>
              <input
                ref={searchRef}
                type="text"
                className="dropdown__search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="dropdown__options">
            {filtered.length > 0 ? (
              filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  className={`dropdown__option${opt.value === value ? ' dropdown__option--selected' : ''}`}
                  role="option"
                  aria-selected={opt.value === value}
                  onClick={() => handleSelect(opt)}
                >
                  {opt.icon && <span className="dropdown__option-icon">{opt.icon}</span>}
                  <span>{opt.label}</span>
                  {opt.value === value && (
                    <span className="dropdown__check">
                      <IconCheck size={14} />
                    </span>
                  )}
                </button>
              ))
            ) : (
              <div className="dropdown__empty">No results found</div>
            )}
          </div>
        </div>
      )}
      {error && <span className="dropdown__error">{error}</span>}
    </div>
  )
}
