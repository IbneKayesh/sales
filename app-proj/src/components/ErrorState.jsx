export default function ErrorState({ error, onRetry }) {
  return (
    <div className="error-state">
      <div className="error-state-icon">⚠</div>
      <h3 className="error-state-title">Connection Error</h3>
      <p className="error-state-message">{error}</p>
      <div className="error-state-actions">
        {onRetry && (
          <button className="btn btn-primary" onClick={onRetry}>
            ↻ Retry
          </button>
        )}
        <p className="error-state-hint">
          Make sure the backend is running: <code>npm start</code>
        </p>
      </div>
    </div>
  );
}
