export default function EmptyState({ title = 'No data', actionLabel = 'Create', onAction }) {
  return (
    <div style={{ padding: 14, textAlign: 'center' }}>
      <div style={{ fontWeight: 800, marginBottom: 10, color: '#e5e7eb' }}>{title}</div>
      {onAction ? (
        <button type="button" className="btn btn--primary" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

