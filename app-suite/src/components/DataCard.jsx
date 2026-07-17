/**
 * DataCard — Reusable stat card for dashboards.
 *
 * Variants:
 *   accent    → --accent / --accent-bg  (purple)
 *   secondary → --secondary / --secondary-bg  (violet)
 *   success   → green
 *   danger    → red
 *   warning   → amber
 *
 * Usage:
 *   <DataCardGrid>
 *     <DataCard variant="success" icon={<IconDollar />} value="$48k" label="Revenue" badge="+12.5%" trend="up" />
 *     <DataCard variant="danger"  icon={<IconBox />}    value="$12k" label="Expenses" badge="-3.1%" trend="down" />
 *   </DataCardGrid>
 */
import { forwardRef } from 'react'

/* ---------- Grid container ---------- */
export function DataCardGrid({ children, cols = 4, gap = 16, className = '', style, ...rest }) {
  return (
    <div
      className={`datacard-grid${className ? ' ' + className : ''}`}
      style={{
        '--datacard-cols': cols,
        '--datacard-gap': `${gap}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

/* ---------- Variant colour map ---------- */
const variantStyles = {
  accent:    { bg: 'var(--primary-bg)',          color: 'var(--primary)' },
  secondary: { bg: 'var(--secondary-bg)',       color: 'var(--secondary)' },
  success:   { bg: 'var(--success-bg)',         color: 'var(--success)' },
  danger:    { bg: 'var(--danger-bg)',          color: 'var(--danger)' },
  warning:   { bg: 'var(--warning-bg)',         color: 'var(--warning)' },
}

const trendStyles = {
  up:   { bg: 'var(--success-bg)',   color: 'var(--success)' },
  down: { bg: 'var(--danger-bg)',    color: 'var(--danger)' },
}

/* ---------- Single card ---------- */
export const DataCard = forwardRef(function DataCard(
  {
    variant = 'accent',
    icon,
    value,
    label,
    badge,
    trend,
    valueStyle,
    onClick,
    className = '',
    style,
    children,
    ...rest
  },
  ref,
) {
  const v = variantStyles[variant] || variantStyles.accent
  const t = trend ? (trendStyles[trend] || null) : null

  return (
    <div
      ref={ref}
      className={`datacard${onClick ? ' datacard--clickable' : ''}${className ? ' ' + className : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e) } : undefined}
      style={style}
      {...rest}
    >
      <span className="datacard__icon" style={{ background: v.bg, color: v.color }}>
        {icon}
      </span>
      <div className="datacard__info">
        <span className="datacard__value" style={valueStyle}>{value}</span>
        <span className="datacard__label">{label}</span>
      </div>
      {badge && (
        <span
          className="datacard__badge"
          style={t ? { background: t.bg, color: t.color } : undefined}
        >
          {badge}
        </span>
      )}
      {children}
    </div>
  )
})

export default DataCard
