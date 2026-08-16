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

// Desktop ERP sizing: compact text (matches 15px input scale), md aligns to
// the 30px input height; sm is tuned to the same height as md so page-header
// actions and form-footer buttons look like one button system. The spinner
// (iconSize) matches the button's font size.
const sizes = {
  xs: { padding: '3px 8px', fontSize: '12px', gap: '4px', iconSize: 12 },
  sm: { padding: '7px 12px', fontSize: '13px', gap: '5px', iconSize: 13 },
  md: { padding: '7px 14px', fontSize: '14px', gap: '6px', iconSize: 14 },
  lg: { padding: '9px 18px', fontSize: '16px', gap: '8px', iconSize: 16 },
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
          <IconSpinner size={s.iconSize} />
        </span>
      ) : icon ? (
        <span className="btn__icon" style={{ fontSize: s.iconSize, display: "inline-flex" }}>{icon}</span>
      ) : null}
      {children && <span className="btn__text">{children}</span>}
    </button>
  )
}
