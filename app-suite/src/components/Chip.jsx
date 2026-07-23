import { IconClose } from '@/icons'

export default function Chip({
  children,
  variant = 'default',
  size = 'md',
  icon,
  avatar,
  avatarSrc,
  avatarAlt = '',
  onRemove,
  onClick,
  disabled = false,
  className = '',
}) {
  const Component = onClick ? 'button' : 'span'

  return (
    <Component
      className={`chip chip--${variant} chip--${size}${onClick ? ' chip--clickable' : ''}${onRemove ? ' chip--removable' : ''}${disabled ? ' chip--disabled' : ''}${className ? ' ' + className : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled && Component === 'button' ? true : undefined}
      type={Component === 'button' ? 'button' : undefined}
    >
      {(avatar || avatarSrc) && (
        <span className="chip__avatar">
          {avatarSrc ? <img src={avatarSrc} alt={avatarAlt} /> : avatar}
        </span>
      )}
      {icon && <span className="chip__icon">{icon}</span>}
      <span className="chip__label">{children}</span>
      {onRemove && (
        <span
          className="chip__remove"
          onClick={(e) => {
            e.stopPropagation()
            if (!disabled) onRemove()
          }}
          role="button"
          tabIndex={0}
          aria-label="Remove"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled) onRemove()
            }
          }}
        >
          <IconClose size={12} />
        </span>
      )}
    </Component>
  )
}
