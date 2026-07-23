import { useState, useRef } from 'react'

/* ─── Reusable star SVG ─── */
function StarSVG({ fill = 'none' }) {
  return (
    <svg
      className="input-rating__star-svg"
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

export default function InputRating({
  id,
  label,
  value = 0,
  onChange,
  min = 0,
  max = 5,
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = '',
  ...rest
}) {
  const [focused, setFocused] = useState(false)
  const inputId = id || name || `irt-${Math.random().toString(36).slice(2, 8)}`
  const starsRef = useRef(null)

  const count = max - min + 1
  const stars = Array.from({ length: count }, (_, i) => min + i)

  const handleClick = (star, isLeftHalf) => {
    if (disabled) return
    const newVal = isLeftHalf ? star - 0.5 : star
    if (onChange) {
      onChange({ target: { name, value: newVal } })
    }
  }

  const starState = (star) => {
    if (value >= star) return 'full'
    if (value >= star - 0.5) return 'half'
    return 'empty'
  }

  const handleStarsKeyDown = (e) => {
    const starEls = Array.from(starsRef.current?.querySelectorAll('.input-rating__star') || [])
    const currentIdx = starEls.indexOf(e.target)
    if (currentIdx === -1) return

    let nextIdx
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault()
      nextIdx = Math.min(currentIdx + 1, starEls.length - 1)
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault()
      nextIdx = Math.max(currentIdx - 1, 0)
    } else {
      return
    }

    starEls[nextIdx]?.focus()
  }

  return (
    <div
      className={`input-rating${focused ? ' input-rating--focused' : ''}${error ? ' input-rating--error' : ''}${disabled ? ' input-rating--disabled' : ''}${dense ? ' input-rating--dense' : ''}${className ? ' ' + className : ''}`}
      {...rest}
    >
      {label && (
        <label className="input-rating__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-rating__required">*</span>}
        </label>
      )}
      <div className="input-rating__body">
        <div
          className="input-rating__stars"
          ref={starsRef}
          onFocus={() => setFocused(true)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setFocused(false)
            }
          }}
          onKeyDown={handleStarsKeyDown}
        >
          {stars.map((star) => {
            const state = starState(star)
            return (
              <span
                key={star}
                className={`input-rating__star input-rating__star--${state}`}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const x = e.clientX - rect.left
                  handleClick(star, x < rect.width / 2)
                }}
                role="button"
                tabIndex={star === stars[0] ? 0 : -1}
                aria-label={`${star} stars`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleClick(star, false)
                  }
                }}
              >
                {state === 'full' ? (
                  <StarSVG fill="currentColor" />
                ) : state === 'half' ? (
                  <>
                    <StarSVG fill="none" />
                    <span className="input-rating__star-fill" style={{ width: '50%' }}>
                      <StarSVG fill="currentColor" />
                    </span>
                  </>
                ) : (
                  <StarSVG fill="none" />
                )}
              </span>
            )
          })}
        </div>
        <input
          id={inputId}
          type="hidden"
          value={value}
          name={name}
          aria-invalid={!!error}
        />
        <span className="input-rating__value">{value}</span>
      </div>
      {error && <span className="input-rating__error">{error}</span>}
    </div>
  )
}
