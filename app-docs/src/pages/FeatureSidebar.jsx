const FeatureSidebar = ({
  isBusy,
  formData,
  isSideBar,
  feature_status_options,
  feature_priority_options,
  work_type_options,
  work_user_options,
  onCloseSidebarClick,
  onInputChange,
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
  onSaveTaskClick,
  taskList,
  onDoneTaskClick,
  onDeleteTaskClick,
}) => {
  if (!isSideBar) return null;

  const formatDateInput = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toISOString().split("T")[0];
    } catch {
      return "";
    }
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
                  onChange={(e) => onInputChange("serial_number", e.target.value)}
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
                  onChange={(e) => onInputChange("feature_name", e.target.value)}
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
              <input
                className="form-input"
                type="text"
                name="feature_description"
                value={formData.feature_description || ""}
                onChange={(e) => onInputChange("feature_description", e.target.value)}
                placeholder="optional"
              />
            </div>
          </section>

          <section className="form-section">
            <div className="form-grid form-grid-4 features-sidebar-form-grid">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="feature_status"
                  value={formData.feature_status || ""}
                  onChange={(e) => onInputChange("feature_status", e.target.value)}
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
                  onChange={(e) => onInputChange("feature_priority", e.target.value)}
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
            <div className="form-grid form-grid-3 features-sidebar-form-grid">
              <div className="form-group">
                <label className="form-label">Start</label>
                <input
                  className="form-input"
                  type="date"
                  name="start_date"
                  value={formatDateInput(formData.start_date)}
                  onChange={(e) => {
                    onInputChange(
                      "start_date",
                      e.target.value ? new Date(e.target.value).toISOString() : "",
                    );
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End</label>
                <input
                  className="form-input"
                  type="date"
                  name="end_date"
                  value={formatDateInput(formData.end_date)}
                  onChange={(e) => {
                    onInputChange(
                      "end_date",
                      e.target.value ? new Date(e.target.value).toISOString() : "",
                    );
                  }}
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
                  step="1"
                  value={formData.progress_percent || 0}
                  onChange={(e) => {
                    onInputChange("progress_percent", parseInt(e.target.value, 10) || 0);
                  }}
                />
              </div>
            </div>
          </section>

          {formData.id && formData.feature_type === "feature" && (
            <section className="form-section">
              <div className="section-header-compact">
                <h4 className="section-title section-title-compact">Linked Tables</h4>
                {featureTableList?.length > 0 && (
                  <span className="section-count">{featureTableList.length}</span>
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
                    <div key={mapping.id} className="sidebar-chip">
                      <span
                        className="sidebar-chip-label"
                        title={mapping.table_name || mapping.table_id}
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
                  onChange={(e) => onInputChangeTask("task_name", e.target.value)}
                  placeholder="New task…"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && formDataTask.task_name?.trim()) {
                      onSaveTaskClick({
                        ...formDataTask,
                        feature_id: formData.id,
                      });
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    onSaveTaskClick({
                      ...formDataTask,
                      feature_id: formData.id,
                    })
                  }
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
                          onChange={(e) => onDoneTaskClick(task.id, e.target.checked)}
                          disabled={isBusy}
                        />
                        <span className={`sidebar-task-name${task.is_done ? " task-done" : ""}`}>
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
                <p className="empty-list-text empty-list-text-compact">No tasks yet.</p>
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
