import { useState, useMemo } from 'react';
import DataTable from '../ui/DataTable';
import GridView from '../ui/GridView';
import FormModal from '../ui/FormModal';
import { useToast } from '../ui/Toast';
import { confirm } from '../ui/ConfirmDialog';

/**
 * Reusable ERP module page with stats, tabs, table/grid views, and CRUD form modal.
 * Each module just passes its config (mock data, columns, form fields, etc.) and
 * this component handles the rest.
 */
export default function ErpPage({
  // Required
  title,           // Module title for the add button, e.g. 'Employee'
  data: initialData, // Array of mock/initial data
  columns,         // Column definitions (function that returns array)
  formFields,      // Form field definitions
  onTransformNew,  // (formData, id) => object — transform form data for new items
  idPrefix,        // e.g. 'EMP', 'PRJ', etc.

  // Optional
  tabs,            // [{ key, label }] — tab definitions (if null, uses table/grid toggle)
  getColumns,      // (tab, handleEdit, handleDelete) => columns — if tabs exist, per-tab columns
  formFieldsByTab, // (tab) => form fields — per-tab form fields
  dataByTab,       // (tab) => data array — per-tab data sources for non-editable tabs
  stats,           // Array of stat card configs [{ title, value, change, color, icon, prefix }]
  renderCard,      // (item, handleEdit, handleDelete) => JSX — grid card renderer
  initialTab,      // Default tab key
  onSuccess,       // (action, item) => void — custom callback after create/update/delete
}) {
  const { toast } = useToast();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState(initialTab || (tabs ? tabs[0]?.key : null));
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewMode, setViewMode] = useState(tabs ? 'table' : 'table');

  const handleAdd = () => { setEditing(null); setFormOpen(true); };
  const handleEdit = (item) => { setEditing(item); setFormOpen(true); };
  const handleDelete = async (item) => {
    const confirmed = await confirm(`Delete ${item.name || item.id || item.title}?`, {
      title: `Delete ${title}`, confirmText: 'Delete', variant: 'danger', icon: 'danger',
    });
    if (confirmed) {
      setData(prev => prev.filter(d => d.id !== item.id));
      toast.success(`${item.name || item.id} deleted`);
      onSuccess?.('delete', item);
    }
    return confirmed;
  };
  const handleSubmit = async (formData) => {
    if (editing) {
      const updated = { ...editing, ...formData };
      setData(prev => prev.map(d => d.id === editing.id ? updated : d));
      toast.success(`${editing.name || editing.id} updated`);
      onSuccess?.('update', updated);
    } else {
      const prefix = idPrefix;
      const id = `${prefix}-${String(data.length + 1).padStart(3, '0')}`;
      const item = onTransformNew ? onTransformNew(formData, id) : { id, ...formData };
      setData(prev => [item, ...prev]);
      toast.success(`${id} created`);
      onSuccess?.('create', item);
    }
    setFormOpen(false);
  };

  const columnsArr = useMemo(() => {
    if (getColumns) return getColumns(activeTab, handleEdit, handleDelete);
    if (typeof columns === 'function') return columns(handleEdit, handleDelete);
    return columns || [];
  }, [activeTab, data.length, columns, getColumns]);

  const currentFields = formFieldsByTab ? formFieldsByTab(activeTab) : formFields;
  const currentData = dataByTab ? dataByTab(activeTab) : data;

  const renderStatsCard = (s) => (
    <div key={s.title} className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-icon" style={{ background: `${s.color}15` }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <g dangerouslySetInnerHTML={{ __html: s.icon }} />
          </svg>
        </div>
        <span className="stats-card-change" style={{ color: s.change >= 0 ? '#059669' : '#dc2626' }}>
          {s.change >= 0 ? '+' : ''}{s.change}%
        </span>
      </div>
      <div className="stats-card-body">
        <span className="stats-card-title">{s.title}</span>
        <span className="stats-card-value">
          {s.prefix || ''}{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}
        </span>
      </div>
    </div>
  );

  const currentTabEditable = tabs ? tabs.find(t => t.key === activeTab)?.editable !== false : true;

  return (
    <div className="page-sales">
      {stats && <div className="stats-grid">{stats.map(renderStatsCard)}</div>}

      <div className="tab-card">
        <div className="tab-header">
          <div className="tabs">
            {tabs ? tabs.map(t => (
              <button key={t.key} className={`tab ${activeTab === t.key ? 'active' : ''}`}
                onClick={() => { setActiveTab(t.key); if (dataByTab && dataByTab(t.key) !== data && !t.editable) setViewMode('table'); }}>
                {t.label}
              </button>
            )) : (
              <>
                <button className={`tab ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                  </svg>Table
                </button>
                <button className={`tab ${viewMode === 'grid' ? 'active' : ''}`} onClick={() => setViewMode('grid')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/>
                    <line x1="9" y1="21" x2="9" y2="9"/>
                  </svg>Grid
                </button>
              </>
            )}
          </div>
          <div className="tab-header-right">
            <span className="table-count">{currentData.length} records</span>
            {currentTabEditable && (
              <button className="btn-primary" onClick={handleAdd}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                Add {title}
              </button>
            )}
          </div>
        </div>
        <div className="tab-content">
          {viewMode === 'table' || (tabs && !currentTabEditable) ? (
            <DataTable columns={columnsArr} data={currentData} searchable searchPlaceholder={`Search...`} exportable exportFilename={title.toLowerCase().replace(/\s+/g, '-')} />
          ) : (
            <GridView data={data} renderCard={(item) => renderCard(item, handleEdit, handleDelete)}
              searchable searchPlaceholder="Search..." columns={3} emptyMessage={`No ${title.toLowerCase()}s found`} />
          )}
        </div>
      </div>

      <FormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={handleSubmit}
        title={editing ? `Edit ${editing.name || editing.id}` : `New ${title}`}
        fields={currentFields} initialData={editing || {}} submitLabel={editing ? 'Update' : 'Create'} size={480} />
    </div>
  );
}
