import { IconInfo, IconSearch, IconBox, IconCheck, IconClose } from '../icons'

const defaultIcons = {
  noData: <IconBox size={32} />,
  noResults: <IconSearch size={32} />,
  error: <IconClose size={32} />,
  success: <IconCheck size={32} />,
  info: <IconInfo size={32} />,
}

export default function EmptyState({
  icon,
  title = 'No data',
  message = 'There is nothing to display yet.',
  action,
  variant = 'noData',
  compact = false,
  className = '',
}) {
  const IconEl = icon || defaultIcons[variant] || defaultIcons.noData

  return (
    <div className={`empty-state${compact ? ' empty-state--compact' : ''}${className ? ' ' + className : ''}`}>
      <div className={`empty-state__icon empty-state__icon--${variant}`}>
        {IconEl}
      </div>
      <h3 className="empty-state__title">{title}</h3>
      <p className="empty-state__message">{message}</p>
      {action && (
        <div className="empty-state__action">
          {action}
        </div>
      )}
    </div>
  )
}
