import { useState } from 'react'
import { IconSpinner } from '../icons'

const variants = {
  primary: {
    bg: 'var(--primary)',
    color: 'var(--primary-on)',
    border: 'var(--primary)',
    hoverBg: 'var(--primary-hover)',
    hoverColor: 'var(--primary-on)',
  },
  secondary: {
    bg: 'transparent',
    color: 'var(--text-primary)',
    border: 'var(--border)',
    hoverBg: 'var(--surface-alt)',
    hoverColor: 'var(--text-primary)',
  },
  outline: {
    bg: 'transparent',
    color: 'var(--primary)',
    border: 'var(--primary-border)',
    hoverBg: 'var(--primary-bg)',
    hoverColor: 'var(--primary)',
  },
  ghost: {
    bg: 'transparent',
    color: 'var(--text-secondary)',
    border: 'transparent',
    hoverBg: 'var(--surface-alt)',
    hoverColor: 'var(--text-primary)',
  },
  danger: {
    bg: 'var(--danger)',
    color: 'var(--danger-on)',
    border: 'var(--danger)',
    hoverBg: 'var(--danger-hover)',
    hoverColor: 'var(--danger-on)',
  },
  success: {
    bg: 'var(--success)',
    color: 'var(--success-on)',
    border: 'var(--success)',
    hoverBg: 'var(--success-hover)',
    hoverColor: 'var(--success-on)',
  },
  info: {
    bg: 'var(--info)',
    color: 'var(--info-on)',
    border: 'var(--info)',
    hoverBg: 'var(--info-hover)',
    hoverColor: 'var(--info-on)',
  },
}

const sizes = {
  xs: { padding: '5px 10px', fontSize: '12px', gap: '4px' },
  sm: { padding: '7px 12px', fontSize: '13px', gap: '4px' },
  md: { padding: '8px 16px', fontSize: '15px', gap: '6px' },
  lg: { padding: '10px 22px', fontSize: '17px', gap: '8px' },
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) {
  const [isHovered, setIsHovered] = useState(false)
  const v = variants[variant] || variants.primary
  const s = sizes[size] || sizes.md

  const style = {
    '--btn-bg': isHovered ? v.hoverBg : v.bg,
    '--btn-color': isHovered ? v.hoverColor : v.color,
    '--btn-border': v.border,
    '--btn-padding': s.padding,
    '--btn-font-size': s.fontSize,
    '--btn-gap': s.gap,
  }

  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}${fullWidth ? ' btn--full' : ''}${className ? ' ' + className : ''}`}
      style={style}
      disabled={disabled || loading}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...rest}
    >
      {loading ? (
        <span className="btn__spinner" aria-hidden="true">
          <IconSpinner size={16} />
        </span>
      ) : icon ? (
        <span className="btn__icon">{icon}</span>
      ) : null}
      {children && <span className="btn__text">{children}</span>}
    </button>
  )
}
