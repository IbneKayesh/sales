export default function Badge({
  children,
  variant = 'success',
  dot = false,
  type,
  icon,
  className = '',
}) {
  const classNames = [
    type ? 'type-badge' : 'badge',
    type ? `type-badge--${type}` : `badge--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classNames}>
      {!type && dot && <span className="badge__dot" />}
      {icon && <span className="badge__icon">{icon}</span>}
      {children}
    </span>
  )
}
