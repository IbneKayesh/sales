import { useMemo, useState } from 'react';


export default function ColumnsComp({
  columns,
  createTableSql,
  loading,
  selectedTable,
  onCreateColumn,
  onUpdateColumn,
  onDeleteColumn,
  onReload,
}) {
  const [form, setForm] = useState({
    column_name: '',
    data_type: 'VARCHAR',
    data_length: '',
    is_nullable: true,
    default_value: '',
    is_primary: false,
    is_foreign: false,
    references_table: '',
    references_column: '',
    column_description: '',
  });

  const [editing, setEditing] = useState(null);

  const normalizedCols = useMemo(() => (Array.isArray(columns) ? columns : []), [columns]);

  const submit = async () => {
    if (!selectedTable?.id) return;

    const payload = {
      column_name: form.column_name.trim(),
      data_type: form.data_type.trim(),
      data_length: form.data_length === '' ? null : Number(form.data_length),
      is_nullable: !!form.is_nullable,
      default_value: form.default_value.trim() || null,
      is_primary: !!form.is_primary,
      is_foreign: !!form.is_foreign,
      references_table: form.references_table.trim() || null,
      references_column: form.references_column.trim() || null,
      column_description: form.column_description.trim() || null,
    };

    if (!payload.column_name) return;

    if (editing) {
      await onUpdateColumn(editing.id, payload);
      setEditing(null);
    } else {
      await onCreateColumn(selectedTable.id, payload);
    }

    setForm({
      column_name: '',
      data_type: 'VARCHAR',
      data_length: '',
      is_nullable: true,
      default_value: '',
      is_primary: false,
      is_foreign: false,
      references_table: '',
      references_column: '',
      column_description: '',
    });
  };

  return (
    <div>
      <div className="halfPanel">
        <div className="panel__title">Column manager</div>

        {loading ? <div style={{ padding: 8 }}>Loading…</div> : null}

        {!loading && !selectedTable ? <div className="muted">Select a table from the list.</div> : null}

        {selectedTable ? (
          <div className="formGrid">
            <div className="formRow">
              <label className="label">Column name</label>
              <input
                className="input"
                value={form.column_name}
                onChange={(e) => setForm((s) => ({ ...s, column_name: e.target.value }))}
              />
            </div>

            <div className="formRow">
              <label className="label">Data type</label>
              <select
                className="input"
                value={form.data_type}
                onChange={(e) => setForm((s) => ({ ...s, data_type: e.target.value }))}
              >
                <option value="VARCHAR">VARCHAR</option>
                <option value="TEXT">TEXT</option>
                <option value="INT">INT</option>
                <option value="BIGINT">BIGINT</option>
                <option value="BOOLEAN">BOOLEAN</option>
                <option value="DATE">DATE</option>
                <option value="TIMESTAMP">TIMESTAMP</option>
              </select>
            </div>

            <div className="formRow">
              <label className="label">Length (optional)</label>
              <input
                className="input"
                type="number"
                value={form.data_length}
                onChange={(e) => setForm((s) => ({ ...s, data_length: e.target.value }))}
              />
            </div>

            <div className="formRow formRow--checks">
              <label>
                <input type="checkbox" checked={form.is_nullable} onChange={(e) => setForm((s) => ({ ...s, is_nullable: e.target.checked }))} />
                Nullable
              </label>
              <label>
                <input type="checkbox" checked={form.is_primary} onChange={(e) => setForm((s) => ({ ...s, is_primary: e.target.checked }))} />
                Primary
              </label>
              <label>
                <input type="checkbox" checked={form.is_foreign} onChange={(e) => setForm((s) => ({ ...s, is_foreign: e.target.checked }))} />
                Foreign
              </label>
            </div>

            {form.is_foreign ? (
              <>
                <div className="formRow">
                  <label className="label">References table</label>
                  <input
                    className="input"
                    value={form.references_table}
                    onChange={(e) => setForm((s) => ({ ...s, references_table: e.target.value }))}
                  />
                </div>
                <div className="formRow">
                  <label className="label">References column</label>
                  <input
                    className="input"
                    value={form.references_column}
                    onChange={(e) => setForm((s) => ({ ...s, references_column: e.target.value }))}
                  />
                </div>
              </>
            ) : null}

            <div className="formRow">
              <label className="label">Default value (optional)</label>
              <input
                className="input"
                value={form.default_value}
                onChange={(e) => setForm((s) => ({ ...s, default_value: e.target.value }))}
                placeholder="e.g. 0 or 'abc'"
              />
            </div>

            <div className="formRow">
              <label className="label">Description (optional)</label>
              <textarea
                className="textarea"
                value={form.column_description}
                onChange={(e) => setForm((s) => ({ ...s, column_description: e.target.value }))}
              />
            </div>

            <div className="formActions">
              <button type="button" className="btn btn--primary" onClick={submit}>
                {editing ? 'Save column' : 'Add column'}
              </button>
              {editing ? (
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => {
                    setEditing(null);
                    setForm((s) => ({ ...s, column_name: '', default_value: '' }));
                  }}
                >
                  Cancel
                </button>
              ) : null}
              <button type="button" className="btn btn--ghost" onClick={onReload}>
                Refresh
              </button>
            </div>
          </div>
        ) : null}

        <div className="tableSection" style={{ marginTop: 14 }}>
          <div className="panel__title" style={{ marginBottom: 8 }}>Columns list</div>
          {normalizedCols.length ? (
            <div>
              {normalizedCols.map((c) => (
                <div key={c.id} className="listRow listRow--withActions">
                  <div className="listRow__main">
                    <div style={{ fontWeight: 800 }}>{c.column_name}</div>
                    <div className="muted">{c.data_type}{c.data_length ? `(${c.data_length})` : ''}</div>
                  </div>
                  <div className="listRow__actions">
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() => {
                        setEditing(c);
                        setForm({
                          column_name: c.column_name || '',
                          data_type: c.data_type || 'VARCHAR',
                          data_length: c.data_length ?? '',
                          is_nullable: c.is_nullable ?? true,
                          default_value: c.default_value || '',
                          is_primary: !!c.is_primary,
                          is_foreign: !!c.is_foreign,
                          references_table: c.references_table || '',
                          references_column: c.references_column || '',
                          column_description: c.column_description || '',
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="btn btn--danger" onClick={() => onDeleteColumn(c.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="muted">No columns yet.</div>
          )}
        </div>
      </div>

      <div className="createSqlBox">
        <div className="panel__title" style={{ marginBottom: 8 }}>Generated CREATE TABLE</div>
        <pre className="sqlPre">{createTableSql || '-- add columns to generate SQL --'}</pre>
      </div>
    </div>
  );
}

