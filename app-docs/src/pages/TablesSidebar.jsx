import React from "react";

const TablesSidebar = ({
  isBusy,
  formData,
  formDataColumn,
  columnList,
  isSideBar,
  onInputChange,
  onInputChangeColumn,
  onEditColumn,
  onCloseSidebar,
  onDelete,
  onDeleteColumn,
  onSave,
  onSaveColumn,
}) => {
  if (!isSideBar) return null;

  const handleSaveClick = () => {
    if (!formData.table_name || formData.table_name.trim() === "") {
      alert("Please enter a table name");
      return;
    }
    onSave(formData);
  };

  const handleDeleteClick = () => {
    if (
      formData.id &&
      window.confirm("Are you sure you want to delete this table?")
    ) {
      onDelete(formData.id);
    }
  };

  return (
    <div className="sidebar-overlay" onClick={onCloseSidebar}>
      <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="sidebar-title-section">
            <h3 className="sidebar-title">Table Details</h3>
          </div>
          <button
            className="sidebar-close-btn"
            onClick={onCloseSidebar}
            disabled={isBusy}
            aria-label="Close panel"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="sidebar-content">
          {/* Table Basic Info Section */}
          <section className="form-section">
            <div className="form-grid form-grid-2">
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
          </section>

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
              <section className="form-section">
                <div className="form-grid form-grid-5">
                  <div className="form-group">
                    <label className="form-label">Column Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      name="column_name"
                      value={formDataColumn.column_name || ""}
                      onChange={(e) => {
                        onInputChangeColumn("column_name", e.target.value);
                      }}
                      placeholder="Name"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data Type</label>
                    <input
                      className="form-input"
                      type="text"
                      name="data_type"
                      value={formDataColumn.data_type || ""}
                      onChange={(e) => {
                        onInputChangeColumn("data_type", e.target.value);
                      }}
                      placeholder="Type"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data Length</label>
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
                      placeholder="Length"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Serial #</label>
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
                      placeholder="Order"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nullable</label>
                    <select
                      className="form-select"
                      value={
                        formDataColumn.is_nullable === undefined
                          ? "true"
                          : String(formDataColumn.is_nullable)
                      }
                      onChange={(e) => {
                        onInputChangeColumn(
                          "is_nullable",
                          e.target.value === "true",
                        );
                      }}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid form-grid-4">
                  <div className="form-group">
                    <label className="form-label">Primary Key</label>
                    <select
                      className="form-select"
                      value={String(formDataColumn.is_primary || false)}
                      onChange={(e) => {
                        onInputChangeColumn(
                          "is_primary",
                          e.target.value === "true",
                        );
                      }}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Foreign Key</label>
                    <select
                      className="form-select"
                      value={String(formDataColumn.is_foreign || false)}
                      onChange={(e) => {
                        onInputChangeColumn(
                          "is_foreign",
                          e.target.value === "true",
                        );
                      }}
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ref. Table</label>
                    <input
                      className="form-input"
                      type="text"
                      name="references_table"
                      value={formDataColumn.references_table || ""}
                      onChange={(e) => {
                        onInputChangeColumn("references_table", e.target.value);
                      }}
                      placeholder="Table ID"
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
                        onInputChangeColumn("references_column", e.target.value);
                      }}
                      placeholder="Column ID"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-textarea"
                    name="column_description"
                    value={formDataColumn.column_description || ""}
                    onChange={(e) => {
                      onInputChangeColumn("column_description", e.target.value);
                    }}
                    placeholder="Enter column description"
                    rows="2"
                  />
                </div>

                <div className="button-group button-group-full">
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => {
                      if (!formDataColumn.column_name || !formDataColumn.column_name.trim()) {
                        alert("Please enter a column name.");
                        return;
                      }
                      onSaveColumn(formDataColumn);
                    }}
                    disabled={isBusy}
                  >
                    {formDataColumn.id ? "Save Column" : "Add Column"}
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => onInputChangeColumn("clear")}
                    disabled={isBusy}
                  >
                    Clear
                  </button>
                  {formDataColumn.id && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onDeleteColumn(formDataColumn.id)}
                      disabled={isBusy}
                    >
                      Delete Column
                    </button>
                  )}
                </div>
              </section>

              {/* Columns List */}
              <section className="form-section">
                <h4 className="section-title">Existing Columns</h4>
                <div className="columns-list">
                  {columnList && columnList.length > 0 ? (
                    columnList.map((column) => (
                      <div key={column.id} className="column-item">
                        <div className="column-info">
                          <div>
                            <strong className="column-name">{column.column_name}</strong>
                            <div className="column-meta">
                              {column.data_type || "Unknown type"}
                              {column.is_nullable === false ? " · NOT NULL" : ""}
                              {column.is_primary ? " · PK" : ""}
                              {column.is_foreign ? " · FK" : ""}
                            </div>
                          </div>
                        </div>
                        <div className="column-actions">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => onEditColumn(column)}
                            disabled={isBusy}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => onDeleteColumn(column.id)}
                            disabled={isBusy}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="empty-list-text">No columns found for this table.</p>
                  )}
                </div>
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
              onClick={handleDeleteClick}
              disabled={isBusy}
            >
              Delete
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={handleSaveClick}
            disabled={isBusy}
          >
            {isBusy ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TablesSidebar;
