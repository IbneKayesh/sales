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
  accent:    { bg: 'var(--accent-bg)',          color: 'var(--accent)' },
  secondary: { bg: 'var(--secondary-bg)',       color: 'var(--secondary)' },
  success:   { bg: 'rgba(34,197,94,0.12)',      color: '#22c55e' },
  danger:    { bg: 'rgba(239,68,68,0.12)',      color: '#ef4444' },
  warning:   { bg: 'rgba(245,158,11,0.12)',     color: '#f59e0b' },
}

const trendStyles = {
  up:   { bg: 'rgba(34,197,94,0.1)',   color: '#22c55e' },
  down: { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444' },
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
