import Modal from './Modal';
import Badge from './Badge';

/**
 * Read-only detail modal for viewing record information.
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {string} props.title
 * @param {Object} props.item — The data object to display
 * @param {Array<{key, label, render?}>} props.fields — Field definitions
 * @param {Object} props.badge — Optional { label, color } for status badge
 * @param {Array} props.actions — Optional footer action buttons [{ label, onClick, variant }]
 * @param {string} props.size — Modal size (default: 'md')
 */
export default function DetailModal({ open, onClose, title, item, fields = [], badge, actions, size = 'md' }) {
  if (!item) return null;

  return (
    <Modal open={open} onClose={onClose} title={title} size={size}
      footer={actions?.length > 0 && (
        <div className="detail-modal-actions">
          <button className="form-btn form-btn-cancel" onClick={onClose}>Close</button>
          {actions.map((action, i) => (
            <button
              key={i}
              className={`form-btn ${action.variant === 'danger' ? 'form-btn-danger' : 'form-btn-submit'}`}
              onClick={() => { action.onClick?.(item); }}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    >
      <div className="detail-modal-content">
        {badge && (
          <div className="detail-modal-badge-row">
            <Badge variant={badge.variant || badge.color}>{badge.label}</Badge>
            {item.id && <span className="detail-modal-id">{item.id}</span>}
          </div>
        )}

        <div className="detail-modal-grid">
          {fields.map(f => {
            const val = f.render ? f.render(item[f.key], item) : (item[f.key] ?? '—');
            return (
              <div key={f.key} className="detail-modal-field">
                <span className="detail-modal-label">{f.label}</span>
                <span className="detail-modal-value">{val}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}
