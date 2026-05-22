import React from "react";
import "./FeatureSidebar.css";

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
    <div className="sidebar-backdrop" onClick={onCloseSidebar}>
      <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-header">
          <div className="header-field">
            <label>Serial No.</label>
            <input
              type="number"
              name="serial_number"
              value={formData.serial_number || ""}
              onChange={(e) => {
                onInputChange("serial_number", e.target.value);
              }}
              placeholder="Enter serial number"
            />
          </div>
          <div className="header-field">
            <label>Table Name *</label>
            <input
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
          <button
            className="close-button"
            onClick={onCloseSidebar}
            disabled={isBusy}
          >
            &times;
          </button>
        </div>
        <div className="sidebar-body">
          <div className="detail-group">
            <label>Description</label>
            <textarea
              name="table_description"
              value={formData.table_description || ""}
              onChange={(e) => {
                onInputChange("table_description", e.target.value);
              }}
              placeholder="Enter table description"
              rows="3"
            />
          </div>

          {formData.id && (
            <>
              <div className="detail-group">
                <label>Columns</label>
                <div className="detail-row detail-row-3col">
                  <div className="detail-group">
                    <label>Column Name *</label>
                    <input
                      type="text"
                      name="column_name"
                      value={formDataColumn.column_name || ""}
                      onChange={(e) => {
                        onInputChangeColumn("column_name", e.target.value);
                      }}
                      placeholder="Column name"
                    />
                  </div>
                  <div className="detail-group">
                    <label>Data Type</label>
                    <input
                      type="text"
                      name="data_type"
                      value={formDataColumn.data_type || ""}
                      onChange={(e) => {
                        onInputChangeColumn("data_type", e.target.value);
                      }}
                      placeholder="Data type"
                    />
                  </div>
                  <div className="detail-group">
                    <label>Serial #</label>
                    <input
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
                </div>
                <div className="detail-row detail-row-3col">
                  <div className="detail-group">
                    <label>Data Length</label>
                    <input
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
                  <div className="detail-group">
                    <label>Nullable</label>
                    <select
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
                  <div className="detail-group">
                    <label>Primary Key</label>
                    <select
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
                </div>
                <div className="detail-row detail-row-3col">
                  <div className="detail-group">
                    <label>Foreign Key</label>
                    <select
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
                  <div className="detail-group">
                    <label>References Table</label>
                    <input
                      type="text"
                      name="references_table"
                      value={formDataColumn.references_table || ""}
                      onChange={(e) => {
                        onInputChangeColumn("references_table", e.target.value);
                      }}
                      placeholder="Referenced table id"
                    />
                  </div>
                  <div className="detail-group">
                    <label>References Column</label>
                    <input
                      type="text"
                      name="references_column"
                      value={formDataColumn.references_column || ""}
                      onChange={(e) => {
                        onInputChangeColumn("references_column", e.target.value);
                      }}
                      placeholder="Referenced column id"
                    />
                  </div>
                </div>
                <div className="detail-group">
                  <label>Description</label>
                  <textarea
                    name="column_description"
                    value={formDataColumn.column_description || ""}
                    onChange={(e) => {
                      onInputChangeColumn("column_description", e.target.value);
                    }}
                    placeholder="Enter column description"
                    rows="3"
                  />
                </div>
                <div className="detail-row" style={{ gap: "8px" }}>
                  <button
                    className="btn btn-primary"
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
                    className="btn btn-secondary"
                    onClick={() => onInputChangeColumn("clear")}
                    disabled={isBusy}
                  >
                    Clear
                  </button>
                  {formDataColumn.id && (
                    <button
                      className="btn btn-danger"
                      onClick={() => onDeleteColumn(formDataColumn.id)}
                      disabled={isBusy}
                    >
                      Delete Column
                    </button>
                  )}
                </div>
              </div>

              <div className="detail-group">
                <label>Existing Columns</label>
                <div className="task-list">
                  {columnList && columnList.length > 0 ? (
                    columnList.map((column) => (
                      <div key={column.id} className="task-item">
                        <div className="task-content">
                          <div className="task-name">
                            <strong>{column.column_name}</strong>
                            <div style={{ color: "#555", fontSize: "12px", marginTop: "4px" }}>
                              {column.data_type || "Unknown type"}
                              {column.is_nullable === false ? " · NOT NULL" : ""}
                              {column.is_primary ? " · PK" : ""}
                              {column.is_foreign ? " · FK" : ""}
                            </div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "8px" }}>
                          <button
                            className="btn btn-sm btn-secondary"
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
                    <p className="task-empty">No columns found for this table.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="sidebar-footer">
          <button
            className="btn-secondary"
            onClick={onCloseSidebar}
            disabled={isBusy}
          >
            Cancel
          </button>
          {formData.id && (
            <button
              className="btn-danger"
              onClick={handleDeleteClick}
              disabled={isBusy}
            >
              Delete
            </button>
          )}
          <button
            className="btn-primary"
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
