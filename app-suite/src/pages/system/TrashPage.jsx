import React, { useState } from 'react';
import { useConfirm } from '../../context/ConfirmContext';
import { useToast } from '../../context/ToastContext';
import styles from './TrashPage.module.css';

// ── Mock deleted items ────────────────────────────────────────────────────
const INITIAL_ITEMS = [
  {
    id: 't1',
    name: 'old-contract.pdf',
    type: 'pdf',
    size: '1.2 MB',
    deletedFrom: 'Documents',
    deletedDate: '2 hours ago',
  },
  {
    id: 't2',
    name: 'temp-logo-v2.png',
    type: 'image',
    size: '0.8 MB',
    deletedFrom: 'Assets',
    deletedDate: '5 hours ago',
  },
  {
    id: 't3',
    name: 'deprecated-config.yaml',
    type: 'code',
    size: '4 KB',
    deletedFrom: 'Projects',
    deletedDate: 'Yesterday',
  },
  {
    id: 't4',
    name: 'Q1_Report_OLD.pdf',
    type: 'pdf',
    size: '3.1 MB',
    deletedFrom: 'Reports',
    deletedDate: '2 days ago',
  },
  {
    id: 't5',
    name: 'unused-asset.psd',
    type: 'image',
    size: '24 MB',
    deletedFrom: 'Assets',
    deletedDate: '3 days ago',
  },
  {
    id: 't6',
    name: 'backup-script-old.sh',
    type: 'code',
    size: '2 KB',
    deletedFrom: 'Projects',
    deletedDate: '1 week ago',
  },
];

const typeIcon = (type) => {
  switch (type) {
    case 'pdf':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    case 'image':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      );
    case 'code':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
        </svg>
      );
  }
};

const typeBadge = (type) => {
  switch (type) {
    case 'pdf':   return styles.badgePdf;
    case 'image': return styles.badgeImage;
    case 'code':  return styles.badgeCode;
    default:      return '';
  }
};

const TrashPage = () => {
  const { confirmWithAction } = useConfirm();
  const { addToast } = useToast();

  const [items, setItems] = useState(INITIAL_ITEMS);
  const [selected, setSelected] = useState(new Set());

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const restoreItem = (id) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const restoreSelected = () => {
    setItems((prev) => prev.filter((i) => !selected.has(i.id)));
    setSelected(new Set());
  };

  const emptyTrash = async () => {
    await confirmWithAction(
      'Empty Trash',
      `Permanently delete all ${items.length} item${items.length !== 1 ? 's' : ''} in the trash? This action cannot be undone.`,
      async () => {
        setItems([]);
        setSelected(new Set());
        addToast({ message: 'Trash has been emptied', type: 'success' });
      },
      { confirmLabel: 'Empty Trash', danger: true, windowId: 'trash' }
    );
  };

  const selectAll = () => {
    if (selected.size === items.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(items.map((i) => i.id)));
    }
  };

  return (
    <div className={styles.page}>
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.trashIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </div>
          <div>
            <h1 className={styles.title}>Trash</h1>
            <span className={styles.subtitle}>
              {items.length === 0
                ? 'Trash is empty'
                : `${items.length} item${items.length !== 1 ? 's' : ''} — items are permanently deleted after 30 days`}
            </span>
          </div>
        </div>
        <div className={styles.headerActions}>
          {items.length > 0 && (
            <>
              <button className={styles.actionBtn} onClick={selectAll}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
                  {selected.size === items.length ? (
                    <>
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="currentColor" />
                      <polyline points="9 12 12 15 17 8" stroke="#fff" />
                    </>
                  ) : (
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  )}
                </svg>
                {selected.size === items.length ? 'Deselect All' : 'Select All'}
              </button>

              {selected.size > 0 && (
                <button className={styles.actionBtn} onClick={restoreSelected}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  Restore ({selected.size})
                </button>
              )}

              <button className={`${styles.actionBtn} ${styles.actionDanger}`} onClick={emptyTrash}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.btnIcon}>
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                </svg>
                Empty Trash
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Item List ───────────────────────────────────────────────── */}
      <div className={styles.listSection}>
        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.emptyIcon}>
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            <h3>Trash is empty</h3>
            <p>Deleted files and folders will appear here for 30 days before permanent erasure.</p>
          </div>
        ) : (
          <>
            <div className={styles.listHeader}>
              <span className={styles.colName}>Name</span>
              <span className={styles.colFrom}>Deleted From</span>
              <span className={styles.colSize}>Size</span>
              <span className={styles.colDate}>Deleted</span>
              <span className={styles.colAction} />
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className={`${styles.itemRow} ${selected.has(item.id) ? styles.itemSelected : ''}`}
              >
                <div className={styles.itemCheck} onClick={() => toggleSelect(item.id)}>
                  <div className={`${styles.checkbox} ${selected.has(item.id) ? styles.checkboxChecked : ''}`}>
                    {selected.has(item.id) && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className={styles.cellName}>
                  <div className={`${styles.itemIcon} ${typeBadge(item.type)}`}>
                    {typeIcon(item.type)}
                  </div>
                  <span className={styles.itemName}>{item.name}</span>
                </div>
                <span className={styles.cellFrom}>{item.deletedFrom}</span>
                <span className={styles.cellSize}>{item.size}</span>
                <span className={styles.cellDate}>{item.deletedDate}</span>
                <div className={styles.cellAction}>
                  <button className={styles.restoreBtn} onClick={() => restoreItem(item.id)} title="Restore">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default TrashPage;
