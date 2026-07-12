import { useNavigate } from 'react-router-dom';
import Badge from './Badge';

/**
 * Reusable detail page layout for item-level views.
 * Provides back navigation, title, status badge, metadata grid, and actions.
 */
export default function DetailCard({ item, fields, backPath, title, status, actions, onBack }) {
  const navigate = useNavigate();

  const handleBack = onBack || (() => navigate(backPath));

  return (
    <div className="detail-page">
      <div className="detail-header">
        <button className="detail-back" onClick={handleBack}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </button>
      </div>

      <div className="detail-card">
        <div className="detail-card-header">
          <div>
            <h2 className="detail-title">{title}</h2>
            <span className="detail-id">{item?.id}</span>
          </div>
          {status && <Badge variant={status.value ?? status}>{status.label ?? status}</Badge>}
        </div>

        <div className="detail-card-body">
          <div className="detail-grid">
            {fields.map((field) => (
              <div key={field.key} className="detail-field">
                <span className="detail-field-label">{field.label}</span>
                <span className="detail-field-value">
                  {field.render ? field.render(item?.[field.key], item) : item?.[field.key] ?? '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {actions && (
          <div className="detail-card-footer">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
