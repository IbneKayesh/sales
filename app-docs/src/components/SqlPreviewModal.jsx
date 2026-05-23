import LoadingSpinner from "./LoadingSpinner";
import "./SqlPreviewModal.css";

export const SQL_EMPTY_MESSAGE =
  "-- No columns defined. Add columns to generate CREATE TABLE SQL.";

export const SqlViewButton = ({
  onClick,
  disabled = false,
  title = "View SQL",
}) => (
  <button
    type="button"
    className="btn-icon"
    onClick={onClick}
    title={title}
    disabled={disabled}
    aria-label={title}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  </button>
);

const SqlPreviewModal = ({
  tableName,
  sql,
  loading = false,
  copied = false,
  onClose,
  onCopy,
}) => (
  <div
    className="sql-preview-overlay"
    onClick={onClose}
    role="presentation"
  >
    <div
      className="sql-preview-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sql-preview-title"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sql-preview-header">
        <h3 id="sql-preview-title" className="sql-preview-title">
          SQL Preview — {tableName || "Table"}
        </h3>
        <button
          type="button"
          className="btn-icon"
          onClick={onClose}
          title="Close"
          aria-label="Close SQL preview"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading SQL..." />
      ) : (
        <div className="form-group sql-code-group">
          <div className="sql-code-wrapper">
            <pre className="sql-code-block">
              <code>{sql || SQL_EMPTY_MESSAGE}</code>
            </pre>
          </div>
        </div>
      )}

      <div className="sql-preview-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={onCopy}
          disabled={!sql || loading}
        >
          {copied ? "Copied!" : "Copy SQL"}
        </button>
      </div>
    </div>
  </div>
);

export default SqlPreviewModal;
