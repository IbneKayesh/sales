import Progress from './Progress'

export default function LoadableCard({
  title,
  subtitle,
  loading = false,
  error = null,
  children,
  loader,
  loaderLabel,
  className = '',
}) {
  return (
    <div className={`loadable-card${className ? ' ' + className : ''}`}>
      {/* Header */}
      <div className="loadable-card__header">
        <div className="loadable-card__title-wrap">
          {title && <h2 className="loadable-card__title">{title}</h2>}
          {subtitle && <p className="loadable-card__subtitle">{subtitle}</p>}
        </div>
      </div>

      {/* Body */}
      <div className="loadable-card__body">
        {/* Loading overlay */}
        {loading && (
          <div className="loadable-card__overlay" role="status" aria-live="polite">
            {loader || (
              <Progress
                pulse
                size="md"
                label={loaderLabel || 'Loading...'}
                description="Fetching data, please wait"
              />
            )}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="loadable-card__error" role="alert">
            <span className="loadable-card__error-icon">⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Content — hidden behind overlay when loading */}
        {!error && (
          <div className={`loadable-card__content${loading ? ' loadable-card__content--blurred' : ''}`}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
