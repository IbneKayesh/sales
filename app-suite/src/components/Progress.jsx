export default function Progress({
  value = 0,
  max = 100,
  label,
  description,
  size = 'md',
  variant = 'primary',
  indeterminate = false,
  pulse = false,
  showValue = true,
  className = '',
}) {
  const pct = max > 0 ? Math.min(Math.max((value / max) * 100, 0), 100) : 0
  const animClass = pulse ? ' progress--pulse' : indeterminate ? ' progress--indeterminate' : ''

  return (
    <div
      className={`progress${animClass} progress--${size} progress--${variant}${className ? ' ' + className : ''}`}
      role="progressbar"
      aria-valuenow={indeterminate || pulse ? undefined : value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label || 'Progress'}
    >
      {(label || showValue) && (
        <div className="progress__header">
          {label && <span className="progress__label">{label}</span>}
          {showValue && !indeterminate && !pulse && (
            <span className="progress__value">{Math.round(pct)}%</span>
          )}
        </div>
      )}
      <div className="progress__track">
        <div
          className="progress__bar"
          style={indeterminate || pulse ? undefined : { width: `${pct}%` }}
        />
      </div>
      {description && <p className="progress__description">{description}</p>}
    </div>
  )
}
