
export default function PageCard({ children, className = '', ...rest }) {
  return (
    <div className={`page-card${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function PageCardHeader({ children, className = '', ...rest }) {
  return (
    <div className={`page-card__header${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function PageCardTitle({ title, subtitle, titleStyle, className = '', ...rest }) {
  return (
    <div className={`page-card__title-wrap${className ? ' ' + className : ''}`} {...rest}>
      {title && <h2 className="page-card__title" style={titleStyle}>{title}</h2>}
      {subtitle && <p className="page-card__subtitle">{subtitle}</p>}
    </div>
  )
}

export function PageCardActions({ children, className = '', ...rest }) {
  return (
    <div className={`page-card__actions${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function PageCardBody({ children, className = '', ...rest }) {
  return (
    <div className={`page-card__body${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

export function PageCardFooter({ children, className = '', ...rest }) {
  return (
    <div className={`page-card__footer${className ? ' ' + className : ''}`} {...rest}>
      {children}
    </div>
  )
}

/**
 * PageSection — groups form fields under a visible section title with a
 * subtle divider, so long data-entry forms are scannable (classic desktop
 * ERP style: "General / Address / Remarks").
 */
export function PageSection({ title, children, style, ...rest }) {
  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--sp-2)',
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginTop: 'var(--sp-2)',
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: 0.7,
            color: 'var(--text-secondary)',
            whiteSpace: 'nowrap',
          }}
        >
          {title}
        </span>
        <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      </div>
      {children}
    </section>
  )
}
