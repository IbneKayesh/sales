import { useEffect, useState } from "react";
import { formatColumnType, formatColumnTooltip } from "../utils/columnFormat.js";
import SqlPreviewModal, { SqlViewButton } from "../components/SqlPreviewModal";

const TablesSidebar = ({
  isBusy,
  formData,
  formDataColumn,
  columnList,
  isSideBar,
  dataTypeOptions,
  createTableSql,
  copied,
  onInputChange,
  onInputChangeColumn,
  onEditColumn,
  onCopyColumn,
  onCloseSidebar,
  onDeleteClick,
  onDeleteColumn,
  onSaveClick,
  onSaveColumnClick,
  onCopySql,
}) => {
  const [isSqlPreviewOpen, setIsSqlPreviewOpen] = useState(false);

  useEffect(() => {
    if (!isSideBar) {
      setIsSqlPreviewOpen(false);
    }
  }, [isSideBar]);

  if (!isSideBar) return null;

  return (
    <div className="sidebar-overlay" onClick={onCloseSidebar}>
      <div
        className="sidebar-panel tables-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="tables-sidebar-header-grid">
            <div className="form-grid form-grid-10-90">
              <div className="form-group">
                <label className="form-label">Serial No.</label>
                <input
                  className="form-input"
                  type="number"
                  name="serial_number"
                  value={formData.serial_number || ""}
                  onChange={(e) => {
                    onInputChange("serial_number", e.target.value);
                  }}
                  placeholder="Enter serial number"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Table Name *</label>
                <input
                  className="form-input"
                  type="text"
                  name="table_name"
                  value={formData.table_name || ""}
                  onChange={(e) => {
                    onInputChange("table_name", e.target.value);
                  }}
                  placeholder="Enter table name"
                  required
                />
              </div>
            </div>

            <div className="tables-sidebar-close-wrap">
              <button
                className="sidebar-close-btn"
                onClick={onCloseSidebar}
                disabled={isBusy}
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="sidebar-content">
          {/* Description Section */}
          <section className="form-section">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="table_description"
                value={formData.table_description || ""}
                onChange={(e) => {
                  onInputChange("table_description", e.target.value);
                }}
                placeholder="Enter table description"
                rows="2"
              />
            </div>
          </section>

          {/* Columns Section */}
          {formData.id && (
            <>
              {/* Add/Edit Column Form */}
              <section className="form-section tables-sidebar-column-form">
                <h4 className="section-title section-title-compact">
                  {formDataColumn.id ? "Edit Column" : "Add Column"}
                </h4>
                <div className="form-grid form-grid-4 tables-sidebar-form-grid">
                  <div className="form-group">
                    <label className="form-label">Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      name="column_name"
                      value={formDataColumn.column_name || ""}
                      onChange={(e) => {
                        onInputChangeColumn("column_name", e.target.value);
                      }}
                      placeholder="column_name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select
                      name="data_type"
                      className="form-select"
                      value={formDataColumn.data_type}
                      onChange={(e) => {
                        onInputChangeColumn("data_type", e.target.value);
                      }}
                    >
                      <option value="-">--</option>
                      {dataTypeOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Length</label>
                    <input
                      className="form-input"
                      type="number"
                      name="data_length"
                      value={formDataColumn.data_length || ""}
                      onChange={(e) => {
                        onInputChangeColumn(
                          "data_length",
                          e.target.value ? parseInt(e.target.value, 10) : "",
                        );
                      }}
                      placeholder="—"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">#</label>
                    <input
                      className="form-input"
                      type="number"
                      name="serial_number"
                      value={formDataColumn.serial_number || ""}
                      onChange={(e) => {
                        onInputChangeColumn(
                          "serial_number",
                          e.target.value ? parseInt(e.target.value, 10) : "",
                        );
                      }}
                      placeholder="—"
                    />
                  </div>
                </div>

                <div className="form-grid form-grid-4 tables-sidebar-form-grid">
                  <div className="form-group">
                    <label className="form-label">Default</label>
                    <input
                      className="form-input"
                      type="text"
                      name="default_value"
                      value={formDataColumn.default_value || ""}
                      onChange={(e) => {
                        onInputChangeColumn(
                          "default_value",
                          e.target.value || "",
                        );
                      }}
                      placeholder="optional"
                    />
                  </div>
                  <div className="form-group form-checkbox-group tables-sidebar-checks">
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formDataColumn.is_nullable}
                        onChange={(e) =>
                          onInputChangeColumn("is_nullable", e.target.checked)
                        }
                      />
                      Null
                    </label>
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formDataColumn.is_primary}
                        onChange={(e) =>
                          onInputChangeColumn("is_primary", e.target.checked)
                        }
                      />
                      PK
                    </label>
                    <label className="form-checkbox-label">
                      <input
                        type="checkbox"
                        className="form-checkbox"
                        checked={formDataColumn.is_foreign}
                        onChange={(e) =>
                          onInputChangeColumn("is_foreign", e.target.checked)
                        }
                      />
                      FK
                    </label>
                  </div>
                </div>

                {formDataColumn.is_foreign && (
                  <div className="form-grid form-grid-2 tables-sidebar-form-grid">
                    <div className="form-group">
                      <label className="form-label">Ref. Table</label>
                      <input
                        className="form-input"
                        type="text"
                        name="references_table"
                        value={formDataColumn.references_table || ""}
                        onChange={(e) => {
                          onInputChangeColumn(
                            "references_table",
                            e.target.value,
                          );
                        }}
                        placeholder="table_id"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ref. Column</label>
                      <input
                        className="form-input"
                        type="text"
                        name="references_column"
                        value={formDataColumn.references_column || ""}
                        onChange={(e) => {
                          onInputChangeColumn(
                            "references_column",
                            e.target.value,
                          );
                        }}
                        placeholder="column_id"
                      />
                    </div>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <input
                    className="form-input"
                    type="text"
                    name="column_description"
                    value={formDataColumn.column_description || ""}
                    onChange={(e) => {
                      onInputChangeColumn("column_description", e.target.value);
                    }}
                    placeholder="optional"
                  />
                </div>

                <div className="button-group button-group-compact">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={onSaveColumnClick}
                    disabled={isBusy}
                  >
                    {formDataColumn.id ? "Save" : "Add"}
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onInputChangeColumn("clear")}
                    disabled={isBusy}
                  >
                    Clear
                  </button>
                  {formDataColumn.id && (
                    <>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => onCopyColumn(formDataColumn)}
                        disabled={isBusy}
                        title="Copy as new column"
                      >
                        Copy
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDeleteColumn(formDataColumn.id)}
                        disabled={isBusy}
                      >
                        Del
                      </button>
                    </>
                  )}
                </div>
              </section>

              {/* Columns List */}
              <section className="form-section">
                <div className="section-header-compact">
                  <div className="section-header-compact-main">
                    <h4 className="section-title section-title-compact">
                      Columns
                    </h4>
                    {columnList?.length > 0 && (
                      <span className="section-count">{columnList.length}</span>
                    )}
                  </div>
                  <SqlViewButton
                    onClick={() => setIsSqlPreviewOpen(true)}
                    disabled={isBusy}
                  />
                </div>
                {columnList && columnList.length > 0 ? (
                  <div className="sidebar-columns-compact">
                    {columnList.map((column) => (
                      <div
                        key={column.id}
                        className={`sidebar-col-chip${
                          formDataColumn.id === column.id
                            ? " sidebar-col-chip-active"
                            : ""
                        }`}
                        title={formatColumnTooltip(column)}
                      >
                        <button
                          type="button"
                          className="sidebar-col-chip-main"
                          onClick={() => onEditColumn(column)}
                          disabled={isBusy}
                        >
                          <div className="card-col-chip-row">
                            <span className="card-col-num">
                              {column.serial_number ?? "·"}
                            </span>
                            <span className="card-col-name">{column.column_name}</span>
                          </div>
                          <div className="card-col-chip-meta">
                            <code className="card-col-type">
                              {formatColumnType(column)}
                            </code>
                            {column.is_nullable === false && (
                              <span className="flag flag-nn" title="Not Null">
                                NN
                              </span>
                            )}
                            {column.default_value && (
                              <span
                                className="card-col-default"
                                title={`Default: ${column.default_value}`}
                              >
                                ={column.default_value}
                              </span>
                            )}
                            {column.is_primary && (
                              <span className="flag flag-pk" title="Primary Key">
                                PK
                              </span>
                            )}
                            {column.is_foreign && (
                              <span className="flag flag-fk" title="Foreign Key">
                                FK
                              </span>
                            )}
                          </div>
                        </button>
                        <button
                          type="button"
                          className="sidebar-col-btn sidebar-col-btn-copy"
                          onClick={(e) => {
                            e.stopPropagation();
                            onCopyColumn(column);
                          }}
                          disabled={isBusy}
                          title="Copy as new column"
                          aria-label={`Copy ${column.column_name}`}
                        >
                          ⧉
                        </button>
                        <button
                          type="button"
                          className="sidebar-col-btn sidebar-col-btn-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteColumn(column.id);
                          }}
                          disabled={isBusy}
                          title="Delete column"
                          aria-label={`Delete ${column.column_name}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="empty-list-text empty-list-text-compact">
                    No columns yet.
                  </p>
                )}
              </section>

            </>
          )}
        </div>

        {/* Footer Section */}
        <div className="sidebar-footer">
          <button
            className="btn btn-secondary"
            onClick={onCloseSidebar}
            disabled={isBusy}
          >
            Cancel
          </button>
          {formData.id && (
            <button
              className="btn btn-danger"
              onClick={onDeleteClick}
              disabled={isBusy}
            >
              Delete
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={onSaveClick}
            disabled={isBusy}
          >
            {isBusy ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      {isSqlPreviewOpen && (
        <SqlPreviewModal
          tableName={formData.table_name}
          sql={createTableSql}
          copied={copied}
          onClose={() => setIsSqlPreviewOpen(false)}
          onCopy={onCopySql}
        />
      )}
    </div>
  );
};

export default TablesSidebar;
