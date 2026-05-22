import { useEffect, useMemo, useState } from 'react';

import { useTable } from '../hooks/useTable.js';
import EmptyState from './components/EmptyState.jsx';
import LoadingState from './components/LoadingState.jsx';

function CollapsibleRow({ table, expanded, onToggle }) {
  return (
    <>
      <tr>
        <td className="td">
          <button type="button" className="rowBtn" onClick={() => onToggle(table.id)}>
            {expanded ? '−' : '+'}
          </button>
        </td>
        <td className="td">{table.table_name}</td>
        <td className="td">{table.serial_number ?? ''}</td>
        <td className="td">{table.table_description ?? ''}</td>
        <td className="td" style={{ width: 200 }}>
          <button type="button" className="btn btn--secondary" onClick={() => onToggle(table.id)}>
            Columns
          </button>
        </td>
      </tr>
      {expanded ? (
        <tr>
          <td className="td" colSpan={5}>
            <div className="detailsBox">
              <div style={{ fontWeight: 900, marginBottom: 6 }}>Table details</div>
              <div className="muted">ID: {table.id}</div>
              <div className="muted">Description: {table.table_description || '—'}</div>
              <div className="muted">Created: {table.created_at || '—'}</div>
            </div>
          </td>
        </tr>
      ) : null}
    </>
  );
}

export default function Tables() {
  const { tables, columns, createTableSql, loadingTables, loadingColumns, refreshTables, refreshColumns, error } = useTable();
  const [expandedId, setExpandedId] = useState(null);
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    if (!selectedTableId && tables.length) {
      const firstId = tables[0].id;
      queueMicrotask(() => {
        setExpandedId((cur) => cur ?? firstId);
        setSelectedTableId(firstId);
        refreshColumns(firstId);
      });
    }
  }, [tables, selectedTableId, refreshColumns]);



  useEffect(() => {
    if (selectedTableId) refreshColumns(selectedTableId);
  }, [selectedTableId, refreshColumns]);

  const selectedTable = useMemo(() => tables.find((t) => t.id === selectedTableId) || null, [tables, selectedTableId]);

  return (
    <div className="grid">
      <div className="panel">
        <div className="panel__title">Tables</div>
        {error ? <div className="errorBox">{String(error)}</div> : null}
        {loadingTables ? <LoadingState /> : null}

        {!loadingTables && tables.length === 0 ? (
          <EmptyState title="No tables" actionLabel="Refresh" onAction={refreshTables} />
        ) : null}

        {!loadingTables && tables.length ? (
          <table className="table">
            <thead>
              <tr>
                <th className="th" />
                <th className="th">Name</th>
                <th className="th">Serial</th>
                <th className="th">Description</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.map((t) => (
                <CollapsibleRow
                  key={t.id}
                  table={t}
                  expanded={expandedId === t.id}
                  onToggle={(id) => {
                    setExpandedId((cur) => (cur === id ? null : id));
                    setSelectedTableId(id);
                    refreshColumns(id);
                  }}
                />
              ))}
            </tbody>
          </table>
        ) : null}
      </div>

      <div className="panel">
        <div className="panel__title">Columns</div>
        {loadingColumns ? <LoadingState /> : null}
        {!loadingColumns && selectedTable ? (
          <div>
            <div className="muted" style={{ marginBottom: 10 }}>
              Managing: <b>{selectedTable.table_name}</b>
            </div>
            {/* Columns CRUD lives in ColumnsComp; to keep app runnable, keep a simple list here */}
            {columns.length ? (
              <ul className="taskList">
                {columns.map((c) => (
                  <li key={c.id} className="taskItem">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <div style={{ fontWeight: 900 }}>{c.column_name}</div>
                      <div className="muted">{c.data_type}{c.data_length ? `(${c.data_length})` : ''}</div>
                    </div>
                    <div className="muted">{c.is_primary ? 'PRIMARY' : ''}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyState title="No columns yet" actionLabel="Reload" onAction={() => refreshColumns(selectedTable.id)} />
            )}

            {createTableSql ? (
              <div style={{ marginTop: 14 }}>
                <div className="panel__title" style={{ marginBottom: 8 }}>Generated CREATE TABLE</div>
                <pre className="sqlPre">{createTableSql}</pre>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

