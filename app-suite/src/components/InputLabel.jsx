export default function InputLabel({
  label,
  value = '',
  icon,
  dense = false,
  className = '',
  ...rest
}) {
  const inputId = `il-${Math.random().toString(36).slice(2, 8)}`

  return (
    <div
      className={`input-label${dense ? ' input-label--dense' : ''}${className ? ' ' + className : ''}`}
    >
      {label && (
        <label className="input-label__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className="input-label__value" id={inputId} {...rest}>
        {icon && <span className="input-label__icon">{icon}</span>}
        <span className="input-label__text">{value}</span>
      </div>
    </div>
  )
}
