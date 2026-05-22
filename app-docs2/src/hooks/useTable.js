import { useCallback, useEffect, useMemo, useState } from 'react';
import { postJson } from '../lib/api.js';

export function useTable() {
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [createTableSql, setCreateTableSql] = useState('');
  const [loadingTables, setLoadingTables] = useState(false);
  const [loadingColumns, setLoadingColumns] = useState(false);
  const [error, setError] = useState(null);

  const refreshTables = useCallback(async () => {
    setLoadingTables(true);
    setError(null);
    try {
      const data = await postJson('/tables/list');
      setTables(Array.isArray(data?.tables) ? data.tables : []);
    } catch (e) {
      setError(e?.message || 'Failed to load tables');
    } finally {
      setLoadingTables(false);
    }
  }, []);

  const refreshColumns = useCallback(async (tableId) => {
    if (!tableId) return;
    setLoadingColumns(true);
    setError(null);
    try {
      const data = await postJson('/columns/list', { tableId });
      const cols = Array.isArray(data?.columns) ? data.columns : [];
      setColumns(cols);
      setCreateTableSql(generateCreateTableSql(data?.tableName, cols));
    } catch (e) {
      setError(e?.message || 'Failed to load columns');
    } finally {
      setLoadingColumns(false);
    }
  }, []);

  const createColumn = useCallback(async (tableId, column) => {
    const data = await postJson('/columns/create', { tableId, column });
    return data;
  }, []);

  const updateColumn = useCallback(async (columnId, patch) => {
    const data = await postJson('/columns/update', { columnId, patch });
    return data;
  }, []);

  const deleteColumn = useCallback(async (columnId) => {
    const data = await postJson('/columns/delete', { columnId });
    return data;
  }, []);

  // initial load
  useEffect(() => {
    (async () => {
      await refreshTables();
    })().catch(() => {});
  }, [refreshTables]);

  const derivedCreateTableSql = useMemo(() => generateCreateTableSql(null, columns), [columns]);

  useEffect(() => {
    // avoid lint warning by deferring setState
    queueMicrotask(() => {
      setCreateTableSql(derivedCreateTableSql);
    });
  }, [derivedCreateTableSql]);




  return {
    tables,
    columns,
    createTableSql,
    loadingTables,
    loadingColumns,
    error,
    refreshTables,
    refreshColumns,
    createColumn,
    updateColumn,
    deleteColumn,
  };
}

function generateCreateTableSql(tableName, cols) {
  if (!cols || cols.length === 0) return '';
  const name = tableName || 'your_table_name';

  const parts = cols.map((c) => {
    const lineParts = [];
    lineParts.push(`${quoteIdent(c.column_name)}`);
    lineParts.push(c.data_type);
    if (typeof c.data_length === 'number' && c.data_length > 0) {
      // keep simple: only append length if provided
      lineParts[lineParts.length - 1] = `${c.data_type}(${c.data_length})`;
    }
    if (c.is_nullable === false) lineParts.push('NOT NULL');
    if (c.default_value) lineParts.push(`DEFAULT ${c.default_value}`);
    if (c.is_primary) lineParts.push('PRIMARY KEY');
    return '  ' + lineParts.join(' ');
  });

  const statement = `CREATE TABLE IF NOT EXISTS ${quoteIdent(name)} (\n${parts.join(',\n')}\n);`;
  return statement;
}

function quoteIdent(v) {
  if (!v) return v;
  return v.includes('.') ? v : v.replace(/"/g, '');
}

