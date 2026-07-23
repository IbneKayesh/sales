import { IconChevronRight, IconHome } from '@/icons'

export default function Breadcrumb({
  items = [],
  homeIcon = true,
  homeHref = '/',
  separator,
  className = '',
}) {
  if (!items.length) return null

  return (
    <nav className={`breadcrumb${className ? ' ' + className : ''}`} aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {homeIcon && (
          <li className="breadcrumb__item">
            <a className="breadcrumb__link breadcrumb__link--home" href={homeHref} aria-label="Home">
              <IconHome size={16} />
            </a>
            <span className="breadcrumb__sep" aria-hidden="true">
              {separator || <IconChevronRight size={14} />}
            </span>
          </li>
        )}
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={item.key ?? i} className="breadcrumb__item">
              {isLast ? (
                <span className="breadcrumb__text" aria-current="page">
                  {item.label || item.title || item}
                </span>
              ) : (
                <>
                  <a
                    className="breadcrumb__link"
                    href={item.href || item.to || '#'}
                    onClick={item.onClick}
                  >
                    {item.icon && (
                      <span className="breadcrumb__link-icon">{item.icon}</span>
                    )}
                    <span>{item.label || item.title || item}</span>
                  </a>
                  <span className="breadcrumb__sep" aria-hidden="true">
                    {separator || <IconChevronRight size={14} />}
                  </span>
                </>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
