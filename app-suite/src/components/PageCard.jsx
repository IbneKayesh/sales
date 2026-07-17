
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

export function PageCardTitle({ title, subtitle, className = '', ...rest }) {
  return (
    <div className={`page-card__title-wrap${className ? ' ' + className : ''}`} {...rest}>
      {title && <h2 className="page-card__title">{title}</h2>}
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
