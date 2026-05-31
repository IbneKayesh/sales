import { useState, useMemo } from "react";
import { apiRequest } from "../utils/api";
import { sortColumnsErdOrder } from "../utils/schemaErd.js";
import ColumnChipRows from "../components/ColumnChipRows";

const FeatureSidebar = ({
  isBusy,
  dataList,
  formData,
  isSideBar,
  feature_status_options,
  feature_priority_options,
  work_type_options,
  work_user_options,
  formatDateInput,
  onCloseSidebarClick,
  onInputChange,
  onDateChange,
  onDeleteClick,
  onSaveClick,
  selectedTableId,
  onInputChangeTable,
  onAddFeatureTableClick,
  tableList,
  featureTableList,
  onDeleteFeatureTableClick,
  formDataTask,
  onInputChangeTask,
  onAddTask,
  onTaskKeyDown,
  taskList,
  onDoneTaskClick,
  onDeleteTaskClick,
}) => {
  if (!isSideBar) return null;

  const [selectedRowsTableId, setSelectedRowsTableId] = useState("");
  const [columnList, setColumnList] = useState([]);
  const sortedColumnList = useMemo(
    () => sortColumnsErdOrder(columnList),
    [columnList],
  );

  const getParentOptions = useMemo(() => {
    if (!formData.feature_type || formData.feature_type === "project" || !dataList) {
      return [];
    }

    let targetType = "";
    if (formData.feature_type === "feature") {
      targetType = "submodule";
    } else if (formData.feature_type === "submodule") {
      targetType = "module";
    } else if (formData.feature_type === "module") {
      targetType = "project";
    }

    if (!targetType) return [];

    const targetItems = dataList.filter(
      (item) => item.feature_type === targetType && item.id !== formData.id
    );

    const itemMap = new Map(dataList.map((i) => [i.id, i]));
    
    return targetItems.map((item) => {
      const path = [];
      let current = item;
      while (current) {
        const parentId = current.feature_id;
        const parent = parentId ? itemMap.get(parentId) : null;
        if (parent) {
          path.push(parent.feature_name);
          current = parent;
        } else {
          break;
        }
      }

      const ancestry = path.length > 0 ? ` (${path.reverse().join(" > ")})` : "";
      return {
        id: item.id,
        label: `${item.feature_name}${ancestry}`,
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, [formData.feature_type, formData.id, dataList]);

  const handleGetTableColumns = async (table_id) => {
    if (selectedRowsTableId === table_id) {
      setSelectedRowsTableId("");
      setColumnList([]);
      return;
    }
    setColumnList([]);
    const resp = await apiRequest("api/columns/get-by-table", {
      body: { table_id: table_id },
    });
    setColumnList(sortColumnsErdOrder(resp.data || []));
    setSelectedRowsTableId(table_id);
  };

  return (
    <div className="sidebar-overlay" onClick={onCloseSidebarClick}>
      <div
        className="sidebar-panel features-sidebar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sidebar-header">
          <div className="tables-sidebar-header-grid">
            <div className="form-grid form-grid-10-90">
              <div className="form-group">
                <label className="form-label">Sl.</label>
                <input
                  className="form-input"
                  type="text"
                  name="serial_number"
                  value={formData.serial_number || ""}
                  onChange={(e) =>
                    onInputChange("serial_number", e.target.value)
                  }
                  placeholder="No."
                />
              </div>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input
                  className="form-input"
                  type="text"
                  name="feature_name"
                  value={formData.feature_name || ""}
                  onChange={(e) =>
                    onInputChange("feature_name", e.target.value)
                  }
                  placeholder="Feature name"
                  required
                />
              </div>
            </div>
            <div className="tables-sidebar-close-wrap">
              <button
                className="sidebar-close-btn"
                onClick={onCloseSidebarClick}
                disabled={isBusy}
                aria-label="Close panel"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="sidebar-content">
          <section className="form-section">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                name="feature_description"
                value={formData.feature_description || ""}
                onChange={(e) =>
                  onInputChange("feature_description", e.target.value)
                }
                placeholder="optional"
                rows="2"
              />
            </div>
          </section>

          {getParentOptions.length > 0 && (
            <section className="form-section">
              <div className="form-group">
                <label className="form-label">
                  {formData.feature_type === "feature"
                    ? "Parent Submodule"
                    : formData.feature_type === "submodule"
                      ? "Parent Module"
                      : "Parent Project"} *
                </label>
                <select
                  className="form-select"
                  name="feature_id"
                  value={formData.feature_id || ""}
                  onChange={(e) => onInputChange("feature_id", e.target.value)}
                  required
                >
                  <option value="" disabled>Select parent...</option>
                  {getParentOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </section>
          )}

          <section className="form-section">
            <div className="form-grid form-grid-4 features-sidebar-form-grid">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="feature_status"
                  value={formData.feature_status || ""}
                  onChange={(e) =>
                    onInputChange("feature_status", e.target.value)
                  }
                >
                  <option value="-">—</option>
                  {feature_status_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  name="feature_priority"
                  value={formData.feature_priority || ""}
                  onChange={(e) =>
                    onInputChange("feature_priority", e.target.value)
                  }
                >
                  <option value="-">—</option>
                  {feature_priority_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Work Type</label>
                <select
                  className="form-select"
                  name="work_type"
                  value={formData.work_type || ""}
                  onChange={(e) => onInputChange("work_type", e.target.value)}
                >
                  <option value="-">—</option>
                  {work_type_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">User</label>
                <select
                  className="form-select"
                  name="work_user"
                  value={formData.work_user || ""}
                  onChange={(e) => onInputChange("work_user", e.target.value)}
                >
                  <option value="-">—</option>
                  {work_user_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="form-section">
            <div className="form-grid form-grid-4 features-sidebar-form-grid">
              <div className="form-group">
                <label className="form-label">Start</label>
                <input
                  className="form-input"
                  type="date"
                  name="start_date"
                  value={formatDateInput(formData.start_date)}
                  onChange={(e) => onDateChange("start_date", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End</label>
                <input
                  className="form-input"
                  type="date"
                  name="end_date"
                  value={formatDateInput(formData.end_date)}
                  onChange={(e) => onDateChange("end_date", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  Progress {formData.progress_percent || 0}%
                </label>
                <input
                  className="form-input"
                  type="range"
                  name="progress_percent"
                  min="0"
                  max="100"
                  step="5"
                  value={formData.progress_percent || 0}
                  onChange={(e) => {
                    onInputChange(
                      "progress_percent",
                      parseInt(e.target.value, 10) || 0,
                    );
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">
                  {formData.url_link ? "URL/Link" : "No URL/Link"}
                </label>
                <input
                  className="form-input"
                  type="text"
                  name="url_link"
                  value={formData.url_link || ""}
                  onChange={(e) => onInputChange("url_link", e.target.value)}
                  placeholder="URL/Link"
                  required
                />
              </div>
            </div>
          </section>

          {formData.id && formData.feature_type === "feature" && (
            <section className="form-section">
              <div className="section-header-compact">
                <h4 className="section-title section-title-compact">
                  Linked Tables
                </h4>
                {featureTableList?.length > 0 && (
                  <span className="section-count">
                    {featureTableList.length}
                  </span>
                )}
              </div>
              <div className="form-input-with-btn features-link-table-row">
                <select
                  className="form-select"
                  value={selectedTableId || ""}
                  onChange={(e) => onInputChangeTable(e.target.value)}
                >
                  <option value="">Select table…</option>
                  {tableList.map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.table_name}
                    </option>
                  ))}
                </select>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={onAddFeatureTableClick}
                  disabled={isBusy || !selectedTableId}
                >
                  Link
                </button>
              </div>

              {featureTableList && featureTableList.length > 0 ? (
                <div className="sidebar-chips-grid">
                  {featureTableList.map((mapping) => (
                    <div
                      key={mapping.id}
                      className={`sidebar-chip ${mapping.table_id === selectedRowsTableId && "active"}`}
                    >
                      <span
                        className="sidebar-chip-label"
                        title={mapping.table_name || mapping.table_id}
                        onClick={(e) => {
                          handleGetTableColumns(mapping.table_id);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {mapping.table_name || mapping.table_id}
                      </span>
                      <button
                        type="button"
                        className="sidebar-col-btn sidebar-col-btn-delete"
                        onClick={() =>
                          onDeleteFeatureTableClick(formData.id, mapping.id)
                        }
                        disabled={isBusy}
                        title="Unlink table"
                        aria-label={`Unlink ${mapping.table_name || mapping.table_id}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-list-text empty-list-text-compact">
                  No linked tables yet.
                </p>
              )}

              {sortedColumnList && sortedColumnList.length > 0 && (
                <div style={{ marginTop: "3px" }}>
                  {sortedColumnList.map((column) => (
                    <ColumnChipRows
                      column={column}
                      fkLookup={{}}
                      showMeta={false}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {formData.id && (
            <section className="form-section">
              <div className="section-header-compact">
                <h4 className="section-title section-title-compact">Tasks</h4>
                {taskList?.length > 0 && (
                  <span className="section-count">{taskList.length}</span>
                )}
              </div>
              <div className="features-task-add-row">
                <input
                  className="form-input"
                  type="text"
                  name="task_name"
                  value={formDataTask.task_name || ""}
                  onChange={(e) =>
                    onInputChangeTask("task_name", e.target.value)
                  }
                  placeholder="New task…"
                  onKeyDown={onTaskKeyDown}
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={onAddTask}
                  disabled={isBusy || !formDataTask.task_name?.trim()}
                >
                  Add
                </button>
              </div>

              {taskList && taskList.length > 0 ? (
                <div className="sidebar-tasks-compact">
                  {taskList.map((task) => (
                    <div key={task.id} className="sidebar-task-chip">
                      <label className="sidebar-task-check">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          checked={task.is_done || false}
                          onChange={(e) =>
                            onDoneTaskClick(task.id, e.target.checked)
                          }
                          disabled={isBusy}
                        />
                        <span
                          className={`sidebar-task-name${task.is_done ? " task-done" : ""}`}
                        >
                          {task.task_name}
                        </span>
                      </label>
                      <button
                        type="button"
                        className="sidebar-col-btn sidebar-col-btn-delete"
                        onClick={() => onDeleteTaskClick(task.id)}
                        disabled={isBusy}
                        title="Delete task"
                        aria-label={`Delete ${task.task_name}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-list-text empty-list-text-compact">
                  No tasks yet.
                </p>
              )}
            </section>
          )}
        </div>

        <div className="sidebar-footer">
          <button
            className="btn btn-secondary"
            onClick={onCloseSidebarClick}
            disabled={isBusy}
          >
            Cancel
          </button>
          {formData.id && (
            <button
              className="btn btn-danger"
              onClick={() => onDeleteClick(formData.id)}
              disabled={isBusy}
            >
              Delete
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => onSaveClick(formData)}
            disabled={isBusy}
          >
            {isBusy ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeatureSidebar;
