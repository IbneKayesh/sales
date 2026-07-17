import { useState } from 'react'
import { IconSpinner } from '../icons'

const variants = {
  primary: {
    bg: 'var(--accent)',
    color: '#fff',
    border: 'var(--accent)',
    hoverBg: 'var(--accent-border)',
    hoverColor: '#fff',
  },
  secondary: {
    bg: 'transparent',
    color: 'var(--text-h)',
    border: 'var(--border)',
    hoverBg: 'var(--code-bg)',
    hoverColor: 'var(--text-h)',
  },
  outline: {
    bg: 'transparent',
    color: 'var(--accent)',
    border: 'var(--accent-border)',
    hoverBg: 'var(--accent-bg)',
    hoverColor: 'var(--accent)',
  },
  ghost: {
    bg: 'transparent',
    color: 'var(--text)',
    border: 'transparent',
    hoverBg: 'var(--code-bg)',
    hoverColor: 'var(--text-h)',
  },
  danger: {
    bg: '#ef4444',
    color: '#fff',
    border: '#ef4444',
    hoverBg: '#dc2626',
    hoverColor: '#fff',
  },
}

const sizes = {
  sm: { padding: '8px 14px', fontSize: '13px', gap: '4px' },
  md: { padding: '12px 20px', fontSize: '15px', gap: '6px' },
  lg: { padding: '12px 28px', fontSize: '17px', gap: '8px' },
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
