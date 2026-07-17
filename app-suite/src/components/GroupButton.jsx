import { useState } from 'react'

export default function GroupButton({
  options = [],
  value,
  onChange,
  name,
  size = 'md',
  disabled = false,
  className = '',
  ...rest
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const handleClick = (opt) => {
    if (onChange) onChange({ target: { value: opt.value, name } })
  }

  const selected = value !== undefined ? value : (options[0]?.value ?? null)

  return (
    <div
      className={`group-btn group-btn--${size}${disabled ? ' group-btn--disabled' : ''}${className ? ' ' + className : ''}`}
      role="radiogroup"
      {...rest}
    >
      {options.map((opt, i) => {
        const isSelected = selected === opt.value
        const isHovered = hoveredIndex === i
        const isFirst = i === 0
        const isLast = i === options.length - 1

        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={isSelected}
            className={`group-btn__item${isSelected ? ' group-btn__item--selected' : ''}${isFirst ? ' group-btn__item--first' : ''}${isLast ? ' group-btn__item--last' : ''}`}
            onClick={() => handleClick(opt)}
            disabled={disabled}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {opt.icon && <span className="group-btn__icon">{opt.icon}</span>}
            <span className="group-btn__text">{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}
