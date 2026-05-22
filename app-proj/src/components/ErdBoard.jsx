import { useMemo, useState } from 'react';
import EmptyState from './EmptyState';

export default function ErdBoard({
  modules = [],
  submodules = [],
  features = [],
  tableFeatures = [],
  tables = [],
  columns = []
}) {
  const [searchTerm, setSearchTerm] = useState('');

  // Always compute hooks first (no early returns before hooks)
  const filteredTables = useMemo(() => {
    const st = searchTerm.trim().toLowerCase();
    if (!st) return tables;
    return tables.filter((t) => (t.table_name || '').toLowerCase().includes(st));
  }, [tables, searchTerm]);

  const featureIdToSubmoduleId = useMemo(() => {
    const m = new Map();
    for (const f of features) m.set(f.id, f.submodule_id);
    return m;
  }, [features]);

  // submodule_id -> Set(table_id)
  const submoduleIdToTableIds = useMemo(() => {
    const m = new Map();
    for (const link of tableFeatures) {
      const subId = featureIdToSubmoduleId.get(link.feature_id);
      if (!subId) continue;
      if (!m.has(subId)) m.set(subId, new Set());
      m.get(subId).add(link.table_id);
    }
    return m;
  }, [tableFeatures, featureIdToSubmoduleId]);

  const tableIdSetFiltered = useMemo(() => {
    const s = new Set();
    for (const t of filteredTables) s.add(t.id);
    return s;
  }, [filteredTables]);

  const tableById = useMemo(() => {
    const m = new Map();
    for (const t of tables) m.set(t.id, t);
    return m;
  }, [tables]);

  const columnsByTableId = useMemo(() => {
    const m = new Map();
    for (const c of columns) {
      if (!m.has(c.table_id)) m.set(c.table_id, []);
      m.get(c.table_id).push(c);
    }
    return m;
  }, [columns]);

  const submoduleRows = useMemo(() => {
    return [...submodules].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id);
  }, [submodules]);

  const moduleRows = useMemo(() => {
    return [...modules].sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id);
  }, [modules]);

  const visibleModuleRows = useMemo(() => {
    // Determine which modules/submodules have at least one visible table
    return moduleRows
      .map((mod) => {
        const modSubmodules = submoduleRows.filter((s) => s.module_id === mod.id);
        const modSubmodulesWithTables = modSubmodules
          .map((sub) => {
            const ids = submoduleIdToTableIds.get(sub.id);
            if (!ids) return null;
            const hasVisibleTable = [...ids].some((tid) => tableIdSetFiltered.has(tid));
            return hasVisibleTable ? sub : null;
          })
          .filter(Boolean);

        return modSubmodulesWithTables.length ? { mod, modSubmodulesWithTables } : null;
      })
      .filter(Boolean);
  }, [moduleRows, submoduleRows, submoduleIdToTableIds, tableIdSetFiltered]);

  return (
    <div className="erd-container fade-in">
      <div className="erd-search">
        <input
          type="text"
          className="erd-search-input"
          placeholder="Search tables..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {tables.length === 0 ? (
        <EmptyState
          icon="[]"
          title="No tables yet"
          description="Create your first table in the Tables Grid tab to get started."
        />
      ) : visibleModuleRows.length === 0 ? (
        <EmptyState icon="?" title="No results" description={`No tables match "${searchTerm}"`} />
      ) : (
        <div className="erd-grouped" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {visibleModuleRows.map(({ mod, modSubmodulesWithTables }) => (
            <div key={mod.id} className="erd-module-card" style={{ padding: 0 }}>
              <div className="erd-module-header" style={{ background: '#0ea5e9', borderRadius: 8, margin: 0 }}>
                <span className="erd-module-name">{mod.name}</span>
                <span
                  className="badge badge-neutral"
                  style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  {modSubmodulesWithTables.length} submodules
                </span>
              </div>

              <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {modSubmodulesWithTables.map((sub) => {
                  const tidSet = submoduleIdToTableIds.get(sub.id) || new Set();
                  const subTableIds = [...tidSet].filter((tid) => tableIdSetFiltered.has(tid));

                  if (subTableIds.length === 0) return null;

                  return (
                    <div key={sub.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      <div className="section-label">{sub.name}</div>
                      <div className="erd-board">
                        {subTableIds
                          .map((tid) => tableById.get(tid))
                          .filter(Boolean)
                          .map((table) => {
                            const tableColumns = (columnsByTableId.get(table.id) || []).sort(
                              (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id
                            );

                            return (
                              <div key={table.id} className="erd-module-card" style={{ padding: 0 }}>
                                <div className="erd-module-header" style={{ background: '#0284c7' }}>
                                  <span className="erd-module-name">{table.table_name}</span>
                                  <span
                                    className="badge badge-neutral"
                                    style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', borderColor: 'rgba(255,255,255,0.2)' }}
                                  >
                                    {tableColumns.length} cols
                                  </span>
                                </div>

                                <div className="erd-table-card">
                                  {tableColumns.length === 0 ? (
                                    <div className="erd-column-row" style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                                      no columns
                                    </div>
                                  ) : (
                                    tableColumns.map((col) => (
                                      <div key={col.id} className="erd-column-row">
                                        <div className="erd-col-name">
                                          <span style={{ fontWeight: col.is_primary || col.is_foreign ? 600 : 400 }}>{col.column_name}</span>
                                          {col.is_primary && <span className="badge badge-warning">PK</span>}
                                          {col.is_foreign && <span className="badge badge-primary">FK</span>}
                                          {col.nullable === false && <span className="not-null" title="NOT NULL">*</span>}
                                        </div>
                                        <span className="erd-col-type">
                                          {(col.data_type || '').toLowerCase()}
                                          {col.length ? `(${col.length})` : ''}
                                        </span>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

