/**
 * Reusable action buttons for table/grid row-level CRUD operations.
 * Provides consistent edit and delete buttons with hover states.
 */

const editIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const deleteIcon = (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

export default function ActionCell({ onEdit, onDelete, compact }) {
  const btnStyle = compact ? { padding: '4px 8px', fontSize: '12px' } : {};

  return (
    <div className="action-btns">
      {onEdit && (
        <button className="action-btn edit" title="Edit" onClick={(e) => { e.stopPropagation(); onEdit(); }} style={btnStyle}>
          {editIcon}
          {compact && ' Edit'}
        </button>
      )}
      {onDelete && (
        <button className="action-btn delete" title="Delete" onClick={(e) => { e.stopPropagation(); onDelete(); }} style={btnStyle}>
          {deleteIcon}
          {compact && ' Delete'}
        </button>
      )}
    </div>
  );
}
