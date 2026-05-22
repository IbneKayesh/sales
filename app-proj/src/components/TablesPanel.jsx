import { Fragment, useMemo, useState } from "react";
import { useNotification } from "../context/NotificationContext";
import { useConfirm } from "./ConfirmModal";
import { preserveScroll } from "../utils/scrollPreserver";
import FeaturesListModal from "./FeaturesListModal.jsx";
import CreateTableSQLModal from "./CreateTableSQLModal.jsx";

const DATA_TYPES = [
  "SERIAL",
  "BIGSERIAL",
  "INTEGER",
  "BIGINT",
  "VARCHAR",
  "TEXT",
  "BOOLEAN",
  "NUMERIC",
  "DECIMAL",
  "TIMESTAMP",
  "DATE",
  "JSONB",
];

const blankTable = { table_name: "", description: "", sequence: 0 };
const blankColumn = {
  table_id: "",
  column_name: "",
  data_type: "VARCHAR",
  length: "",
  nullable: true,
  default_value: "",
  is_primary: false,
  is_foreign: false,
  references_table: "",
  sequence: 0,
};

export default function TablesPanel({
  modules,
  submodules,
  features,
  tables,
  columns,
  tableFeatures,
  selectedTableId,
  setSelectedTableId,
  expandedTableIds,
  setExpandedTableIds,
  refreshForAddEditDeleteTable,
  refreshForAddEditDeleteColumn,
  // refreshForAddEditDeleteFeature, // unused (removed by targeted props)
}) {
  const { addNotification } = useNotification();
  const { confirm, confirmModal } = useConfirm();

  const expandedTables = expandedTableIds;
  const setExpandedTables = setExpandedTableIds;

  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({});
  const [saving, setSaving] = useState(false);

  const [featuresModal, setFeaturesModal] = useState({
    open: false,
    table: null,
  });

  const [createSqlModal, setCreateSqlModal] = useState({
    open: false,
    table: null,
  });

  const visibleTables = useMemo(
    () =>
      [...tables].sort(
        (a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id,
      ),
    [tables],
  );

  const request = async (url, options) => {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });
    if (!res.ok) throw new Error((await res.json()).error || "Request failed");
    return res.json();
  };

  const toggleTable = (id) => {
    setExpandedTables((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const beginAddTable = () => {
    setEditing({ type: "table", mode: "add" });
    setDraft(blankTable);
  };

  const beginEditTable = (table) => {
    setEditing({ type: "table", mode: "edit", id: table.id });
    setDraft({
      table_name: table.table_name,
      description: table.description || "",
      sequence: table.sequence || 0,
    });
  };

  const beginAddColumn = (tableId) => {
    setEditing({ type: "column", mode: "add", parentTableId: tableId });
    setDraft({ ...blankColumn, table_id: tableId });
    setExpandedTables((prev) => new Set(prev).add(tableId));
  };

  const beginEditColumn = (column) => {
    setEditing({
      type: "column",
      mode: "edit",
      id: column.id,
      parentTableId: column.table_id,
    });
    setDraft({
      table_id: column.table_id,
      column_name: column.column_name,
      data_type: column.data_type,
      length: column.length || "",
      nullable: column.nullable !== false,
      default_value: column.default_value || "",
      is_primary: column.is_primary === true,
      is_foreign: column.is_foreign === true,
      references_table: column.references_table || "",
      sequence: column.sequence || 0,
    });
    setExpandedTables((prev) => new Set(prev).add(column.table_id));
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft({});
  };

  const saveTable = async () => {
    if (!draft.table_name?.trim()) {
      addNotification("Table name is required", "warning");
      return;
    }

    setSaving(true);
    try {
      const url =
        editing.mode === "edit" ? `/api/tables/${editing.id}` : "/api/tables";
      const method = editing.mode === "edit" ? "PUT" : "POST";
      const table = await request(url, { method, body: JSON.stringify(draft) });
      setSelectedTableId(table.id);
      setExpandedTables((prev) => new Set(prev).add(table.id));
      cancelEdit();
      addNotification("Table saved", "success");
      const restore = preserveScroll();
      await refreshForAddEditDeleteTable();
      restore();
    } catch (err) {
      addNotification(err.message || "Failed to save table", "error");
    } finally {
      setSaving(false);
    }
  };

  const saveColumn = async () => {
    if (!draft.table_id || !draft.column_name?.trim() || !draft.data_type) {
      addNotification("Column name, type, and table are required", "warning");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...draft,
        length: draft.length || null,
        references_table: draft.is_foreign ? draft.references_table : null,
      };
      const url =
        editing.mode === "edit" ? `/api/columns/${editing.id}` : "/api/columns";
      const method = editing.mode === "edit" ? "PUT" : "POST";
      const column = await request(url, {
        method,
        body: JSON.stringify(payload),
      });
      setSelectedTableId(column.table_id);
      setExpandedTables((prev) => new Set(prev).add(column.table_id));
      cancelEdit();
      addNotification("Column saved", "success");
      const restore = preserveScroll();
      await refreshForAddEditDeleteColumn();
      restore();
    } catch (err) {
      addNotification(err.message || "Failed to save column", "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteRow = async (type, id) => {
    const ok = await confirm({
      title: "Delete item",
      message: `Delete this ${type}?`,
      confirmText: "Yes",
      cancelText: "No",
    });

    if (!ok) return;

    try {
      await request(
        type === "table" ? `/api/tables/${id}` : `/api/columns/${id}`,
        { method: "DELETE" },
      );
      if (type === "table" && selectedTableId === id) setSelectedTableId(null);
      addNotification(`${type} deleted`, "success");
      const restore = preserveScroll();
      if (type === "table") await refreshForAddEditDeleteTable();
      else await refreshForAddEditDeleteColumn();
      restore();
    } catch (err) {
      addNotification(err.message || "Delete failed", "error");
    }
  };

  const renderTableEditor = () => (
    <tr className="grid-edit-row">
      <td colSpan={7}>
        <div className="inline-editor">
          <input
            className="form-input"
            placeholder="table_name"
            value={draft.table_name || ""}
            onChange={(e) => setDraft({ ...draft, table_name: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Description"
            value={draft.description || ""}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
          />
          <input
            className="form-input seq-input"
            type="number"
            value={draft.sequence ?? 0}
            onChange={(e) => setDraft({ ...draft, sequence: Number(e.target.value) })}
          />
          <button
            className="btn btn-primary btn-xs"
            onClick={saveTable}
            disabled={saving}
          >
            {saving ? "Saving" : "Save"}
          </button>
          <button className="btn btn-secondary btn-xs" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );

  const renderColumnEditor = () => (
    <tr className="grid-edit-row">
      <td colSpan={7}>
        <div className="inline-editor column-editor">
          <input
            className="form-input"
            placeholder="column_name"
            value={draft.column_name || ""}
            onChange={(e) => setDraft({ ...draft, column_name: e.target.value })}
          />
          <select
            className="form-select"
            value={draft.data_type || "VARCHAR"}
            onChange={(e) => setDraft({ ...draft, data_type: e.target.value })}
          >
            {DATA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          <input
            className="form-input seq-input"
            type="number"
            placeholder="Len"
            value={draft.length || ""}
            onChange={(e) => setDraft({ ...draft, length: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Default"
            value={draft.default_value || ""}
            onChange={(e) => setDraft({ ...draft, default_value: e.target.value })}
          />
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={draft.nullable !== false}
              onChange={(e) => setDraft({ ...draft, nullable: e.target.checked })}
            />
            Nullable
          </label>
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={draft.is_primary === true}
              onChange={(e) => setDraft({ ...draft, is_primary: e.target.checked })}
            />
            PK
          </label>
          <label className="form-checkbox">
            <input
              type="checkbox"
              checked={draft.is_foreign === true}
              onChange={(e) => setDraft({ ...draft, is_foreign: e.target.checked })}
            />
            FK
          </label>
          {draft.is_foreign && (
            <select
              className="form-select"
              value={draft.references_table || ""}
              onChange={(e) => setDraft({ ...draft, references_table: e.target.value })}
            >
              <option value="">References</option>
              {tables.map((table) => (
                <option key={table.id} value={table.table_name}>
                  {table.table_name}
                </option>
              ))}
            </select>
          )}
          <input
            className="form-input seq-input"
            type="number"
            value={draft.sequence ?? 0}
            onChange={(e) => setDraft({ ...draft, sequence: Number(e.target.value) })}
          />
          <button
            className="btn btn-primary btn-xs"
            onClick={saveColumn}
            disabled={saving}
          >
            {saving ? "Saving" : "Save"}
          </button>
          <button className="btn btn-secondary btn-xs" onClick={cancelEdit}>
            Cancel
          </button>
        </div>
      </td>
    </tr>
  );

  const usedBy = (tableId) => {
    const links = tableFeatures.filter((link) => link.table_id === tableId);
    const featureById = new Map((features || []).map((f) => [f.id ?? f.feature_id, f]));
    const submoduleById = new Map((submodules || []).map((s) => [s.id, s]));

    return links.map((link) => {
      const feature = featureById.get(link.feature_id) || featureById.get(link.feature_id ?? link.id);
      const submodule = feature ? submoduleById.get(feature.submodule_id) : null;

      const moduleName =
        submodule?.module_name ||
        submodule?.module?.name ||
        submodule?.module?.module_name ||
        (submodule && modules ? (modules.find((m) => m.id === submodule.module_id) || {}).name : undefined);

      const submoduleName = submodule?.name || "-";

      return {
        feature_id: link.feature_id,
        feature_name: link.feature_name,
        module_name: moduleName || "-",
        submodule_name: submoduleName,
      };
    });
  };

  return (
    <div className="grid-workspace fade-in">
      {confirmModal}

      {featuresModal.open && (
        <FeaturesListModal
          title={`Features using ${featuresModal.table?.table_name || "table"}`}
          features={usedBy(featuresModal.table.id)}
          onClose={() => setFeaturesModal({ open: false, table: null })}
        />
      )}

      <CreateTableSQLModal
        open={createSqlModal.open}
        table={createSqlModal.table}
        columns={columns}
        onClose={() => setCreateSqlModal({ open: false, table: null })}
      />

      <div className="card grid-card">
        <div className="card-header toolbar-header">
          <span className="card-title">Database Features</span>
          <button className="btn btn-primary btn-xs" onClick={beginAddTable}>
            Add Table
          </button>
        </div>

        <div className="grid-scroll">
          <table className="data-table tree-grid">
            <thead>
              <tr>
                <th>Table / Column</th>
                <th>Type</th>
                <th>Constraints</th>
                <th>Default</th>
                <th>Seq</th>
                <th>Used By</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tables.length === 0 && editing?.type !== "table" && (
                <tr className="empty-grid-row">
                  <td colSpan={7}>
                    <div className="empty-row-action">
                      <span>No tables yet.</span>
                      <button className="btn btn-primary btn-xs" onClick={beginAddTable}>
                        Add Table
                      </button>
                    </div>
                  </td>
                </tr>
              )}

              {editing?.type === "table" && editing.mode === "add" && renderTableEditor()}

              {visibleTables.map((table) => {
                const tableOpen = expandedTables.has(table.id);
                const tableColumns = columns
                  .filter((column) => column.table_id === table.id)
                  .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0) || a.id - b.id);

                const featureCount = tableFeatures.filter((link) => link.table_id === table.id).length;

                return (
                  <Fragment key={table.id}>
                    <tr className={selectedTableId === table.id ? "selected-row" : ""}>
                      <td>
                        <button className="tree-toggle" onClick={() => toggleTable(table.id)}>
                          {tableOpen ? "-" : "+"}
                        </button>
                        <span className="sql-name">{table.table_name}</span>
                        <span className="badge badge-neutral">Table</span>
                      </td>
                      <td>table</td>
                      <td>{table.description || "-"}</td>
                      <td>-</td>
                      <td className="mono">{table.sequence || 0}</td>
                      <td>
                        <button
                          className="btn btn-link"
                          style={{ padding: 0, textDecoration: "underline", cursor: "pointer" }}
                          onClick={() => setFeaturesModal({ open: true, table })}
                        >
                          {featureCount} feature{featureCount !== 1 ? "s" : ""}
                        </button>
                      </td>
                      <td>
                        <div className="action-row right">
                          <button className="btn btn-secondary btn-xs" onClick={() => beginAddColumn(table.id)}>
                            Add Column
                          </button>
                          <button
                            className="btn btn-secondary btn-xs"
                            onClick={() => setCreateSqlModal({ open: true, table })}
                          >
                            SQL
                          </button>
                          <button className="btn-icon" onClick={() => beginEditTable(table)}>
                            Edit
                          </button>
                          <button className="btn-icon danger" onClick={() => deleteRow("table", table.id)}>
                            Del
                          </button>
                        </div>
                      </td>
                    </tr>

                    {editing?.type === "table" && editing.mode === "edit" && editing.id === table.id && renderTableEditor()}

                    {tableOpen && editing?.type === "column" && editing.mode === "add" && editing.parentTableId === table.id && renderColumnEditor()}

                    {tableOpen &&
                      tableColumns.map((column) => (
                        <Fragment key={column.id}>
                          <tr>
                            <td className="level-1">
                              <span className="sql-name">{column.column_name}</span>
                              {column.is_primary && <span className="badge badge-warning">PK</span>}
                              {column.is_foreign && <span className="badge badge-primary">FK</span>}
                            </td>
                            <td className="mono">
                              {column.data_type.toLowerCase()}
                              {column.length ? `(${column.length})` : ""}
                            </td>
                            <td>
                              {column.nullable === false ? (
                                <span className="badge badge-danger">NOT NULL</span>
                              ) : (
                                <span className="badge badge-neutral">nullable</span>
                              )}
                              {column.references_table && (
                                <span className="badge badge-primary">to {column.references_table}</span>
                              )}
                            </td>
                            <td className="mono">{column.default_value || "-"}</td>
                            <td className="mono">{column.sequence || 0}</td>
                            <td>-</td>
                            <td>
                              <div className="action-row right">
                                <button className="btn-icon" onClick={() => beginEditColumn(column)}>
                                  Edit
                                </button>
                                <button className="btn-icon danger" onClick={() => deleteRow("column", column.id)}>
                                  Del
                                </button>
                              </div>
                            </td>
                          </tr>
                          {editing?.type === "column" && editing.mode === "edit" && editing.id === column.id && renderColumnEditor()}
                        </Fragment>
                      ))}

                    {tableOpen &&
                      tableColumns.length === 0 &&
                      editing?.parentTableId !== table.id && (
                        <tr className="empty-grid-row">
                          <td colSpan={7}>
                            <div className="empty-row-action nested">
                              <span>No columns under {table.table_name}.</span>
                              <button className="btn btn-primary btn-xs" onClick={() => beginAddColumn(table.id)}>
                                Add Column
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

