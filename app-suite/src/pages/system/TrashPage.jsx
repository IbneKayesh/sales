import { useState } from 'react';

import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconFilePdf, IconFileImage, IconFileCode, IconFile, IconTrash, IconCheck, IconCheckboxUnchecked, IconCheckboxChecked, IconRestore, IconClose } from '@/assets/icons';
import './TrashPage.css';
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
    case 'pdf':   return <IconFilePdf />;
    case 'image': return <IconFileImage />;
    case 'code':  return <IconFileCode />;
    default:      return <IconFile />;
  }
};

const typeBadge = (type) => {
  switch (type) {
    case 'pdf':   return 'badgePdf';
    case 'image': return 'badgeImage';
    case 'code':  return 'badgeCode';
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
    <div className="page">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="header">
        <div className="headerLeft">
          <div className="trashIcon">
            <IconTrash />
          </div>
          <div>
            <h1 className="title">Trash</h1>
            <span className="subtitle">
              {items.length === 0
                ? 'Trash is empty'
                : `${items.length} item${items.length !== 1 ? 's' : ''} — items are permanently deleted after 30 days`}
            </span>
          </div>
        </div>
        <div className="headerActions">
          {items.length > 0 && (
            <>
              <button className="actionBtn" onClick={selectAll}>
                {selected.size === items.length ? (
                  <IconCheckboxChecked className="btnIcon" />
                ) : (
                  <IconCheckboxUnchecked className="btnIcon" />
                )}
                {selected.size === items.length ? 'Deselect All' : 'Select All'}
              </button>

              {selected.size > 0 && (
                <button className="actionBtn" onClick={restoreSelected}>
                  <IconRestore className="btnIcon" />
                  Restore ({selected.size})
                </button>
              )}

              <button className={`actionBtn actionDanger`} onClick={emptyTrash}>
                <IconTrash className="btnIcon" />
                Empty Trash
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Item List ───────────────────────────────────────────────── */}
      <div className="listSection">
        {items.length === 0 ? (
          <div className="empty">
            <IconTrash className="emptyIcon" />
            <h3>Trash is empty</h3>
            <p>Deleted files and folders will appear here for 30 days before permanent erasure.</p>
          </div>
        ) : (
          <>
            <div className="listHeader">
              <span className="colName">Name</span>
              <span className="colFrom">Deleted From</span>
              <span className="colSize">Size</span>
              <span className="colDate">Deleted</span>
              <span className="colAction" />
            </div>
            {items.map((item) => (
              <div
                key={item.id}
                className={`itemRow ${selected.has(item.id) ? 'itemSelected' : ''}`}
              >
                <div className="itemCheck" onClick={() => toggleSelect(item.id)}>
                  <div className={`checkbox ${selected.has(item.id) ? 'checkboxChecked' : ''}`}>
                    {selected.has(item.id) && (
                      <IconCheck />
                    )}
                  </div>
                </div>
                <div className="cellName">
                  <div className={`itemIcon ${typeBadge(item.type)}`}>
                    {typeIcon(item.type)}
                  </div>
                  <span className="itemName">{item.name}</span>
                </div>
                <span className="cellFrom">{item.deletedFrom}</span>
                <span className="cellSize">{item.size}</span>
                <span className="cellDate">{item.deletedDate}</span>
                <div className="cellAction">
                  <button className="restoreBtn" onClick={() => restoreItem(item.id)} title="Restore">
                    <IconRestore />
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
