import { useState, useEffect } from 'react';
import Modal from './Modal';
import { useToast } from './Toast';

/**
 * Bulk action modal for batch operations (delete, update, export, etc.).
 *
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onClose
 * @param {Array} props.items — Selected items
 * @param {string} props.title — Modal title (default: 'Bulk Action')
 * @param {string} props.actionLabel — Action button text (default: 'Confirm')
 * @param {string} props.actionVariant — 'danger' | 'primary' (default: 'primary')
 * @param {string} props.description — Instructions shown above the preview
 * @param {Array<{key, label, render?}>} props.columns — Preview table columns
 * @param {Function} props.onConfirm — Called with selected items
 * @param {string} props.size — Modal size (default: 'lg')
 */
export default function BulkActionModal({
  open, onClose, items = [], title = 'Bulk Action', actionLabel = 'Confirm',
  actionVariant = 'primary', description, columns = [], onConfirm, size = 'lg',
  successMessage, errorMessage,
}) {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [selected, setSelected] = useState(() => items.map(i => i.id));

  // Sync selection when items change or modal opens
  useEffect(() => {
    setSelected(items.map(i => i.id));
  }, [open, items]);

  const toggleAll = () => {
    if (selected.length === items.length) setSelected([]);
    else setSelected(items.map(i => i.id));
  };

  const toggleItem = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const selectedItems = items.filter(i => selected.includes(i.id));

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm?.(selectedItems);
      const count = selectedItems.length;
      toast.success(successMessage || `${count} item${count !== 1 ? 's' : ''} processed successfully`);
      setSubmitting(false);
      onClose();
    } catch {
      toast.error(errorMessage || 'An error occurred while processing. Please try again.');
      setSubmitting(false);
    }
  };

  const footer = (
    <div className="bulk-footer">
      <span className="bulk-footer-count">
        {selected.length} of {items.length} selected
      </span>
      <div className="bulk-footer-actions">
        <button className="form-btn form-btn-cancel" onClick={onClose} disabled={submitting}>Cancel</button>
        <button
          className={`form-btn ${actionVariant === 'danger' ? 'form-btn-danger' : 'form-btn-submit'}`}
          onClick={handleConfirm}
          disabled={selected.length === 0 || submitting}
        >
          {submitting ? (
            <span className="btn-loading"><span className="spinner" /> Processing...</span>
          ) : (
            `${actionLabel} (${selected.length})`
          )}
        </button>
      </div>
    </div>
  );

  return (
    <Modal open={open} onClose={onClose} title={title} size={size} footer={footer}>
      <div className="bulk-container">
        {description && <p className="bulk-description">{description}</p>}

        {/* Preview table */}
        <div className="bulk-table-wrapper">
          <table className="bulk-table">
            <thead>
              <tr>
                <th className="bulk-check-col">
                  <input
                    type="checkbox"
                    className="bulk-checkbox"
                    checked={selected.length === items.length && items.length > 0}
                    onChange={toggleAll}
                  />
                </th>
                {columns.map(col => (
                  <th key={col.key}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className={`bulk-row ${selected.includes(item.id) ? 'selected' : ''}`}>
                  <td className="bulk-check-col">
                    <input
                      type="checkbox"
                      className="bulk-checkbox"
                      checked={selected.includes(item.id)}
                      onChange={() => toggleItem(item.id)}
                    />
                  </td>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(item[col.key], item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="bulk-empty">
                    No items selected
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
