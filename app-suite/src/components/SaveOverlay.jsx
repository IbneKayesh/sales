import Progress from './Progress'
import { IconSave } from '../icons'

export default function SaveOverlay({
  open = false,
  title = 'Please wait, saving the data',
  message = 'Your request is being processed. This will only take a moment.',
  progressLabel = 'Saving...',
  className = '',
  ...rest
}) {
  if (!open) return null

  return (
    <div className="modal-overlay save-overlay" onClick={(e) => { if (e.target === e.currentTarget) return }} {...rest}>
      <div className={`modal modal--sm${className ? ' ' + className : ''}`} style={{ textAlign: 'center', padding: 'var(--sp-8)' }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--sp-5)',
        }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'var(--primary-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <IconSave size={28} style={{ color: 'var(--primary)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', width: '100%' }}>
            <h3 style={{
              fontSize: 'var(--fs-lg)',
              fontWeight: 'var(--fw-semibold)',
              color: 'var(--text-primary)',
              margin: 0,
            }}>
              {title}
            </h3>
            <p style={{
              fontSize: 'var(--fs-sm)',
              color: 'var(--text-secondary)',
              margin: 0,
              lineHeight: 1.5,
            }}>
              {message}
            </p>
            <Progress
              pulse
              size="md"
              variant="primary"
              label={progressLabel}
              showValue={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
