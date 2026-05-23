// FeatureSidebar.jsx
import React, { useState, useEffect } from "react";

const FeatureSidebar = ({
  isBusy,
  formData,
  isSideBar,
  feature_status_options,
  feature_priority_options,
  work_type_options,
  work_user_options,
  onInputChange,
  onRowClick,
  onCloseSidebar,
  onDelete,
  onSave,
  //task
  taskList,
  formDataTask,
  onGetTaskByFeature,
  onInputChangeTask,
  onSaveTask,
  onDoneTask,
  onDeleteTask,
  //feature table
  tableList,
  featureTableList,
  selectedTableId,
  onInputChangeTable,
  onAddFeatureTable,
  onDeleteFeatureTable,
}) => {
  useEffect(() => {
    if (formData.id && isSideBar) {
      onGetTaskByFeature(formData.id);
    }
  }, [formData.id, isSideBar]);
  if (!isSideBar) return null;

  return (
    <div className="sidebar-overlay" onClick={onCloseSidebar}>
      <div className="sidebar-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header Section */}
        <div className="sidebar-header">
          <div className="sidebar-title-section">
            <h3 className="sidebar-title">Feature Details</h3>
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
          {/* Basic Info Section */}
          <section className="form-section">
            <div className="form-grid form-grid-10-90">
              <div className="form-group">
                <label className="form-label">Serial No.</label>
                <input
                  className="form-input"
                  type="text"
                  name="serial_number"
                  value={formData.serial_number || ""}
                  onChange={(e) => {
                    onInputChange("serial_number", e.target.value);
                  }}
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
                  onChange={(e) => {
                    onInputChange("feature_name", e.target.value);
                  }}
                  placeholder="Enter feature name"
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
                name="feature_description"
                value={formData.feature_description || ""}
                onChange={(e) => {
                  onInputChange("feature_description", e.target.value);
                }}
                placeholder="Enter description"
                rows="2"
              />
            </div>
          </section>

          {/* Combined Status, Priority, Work Type, Assigned User Section */}
          <section className="form-section">
            <div className="form-grid form-grid-4">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="feature_status"
                  value={formData.feature_status || ""}
                  onChange={(e) => {
                    onInputChange("feature_status", e.target.value);
                  }}
                >
                  <option value="">Select status</option>
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
                  onChange={(e) => {
                    onInputChange("feature_priority", e.target.value);
                  }}
                >
                  <option value="">Select priority</option>
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
                  onChange={(e) => {
                    onInputChange("work_type", e.target.value);
                  }}
                >
                  <option value="">Select work type</option>
                  {work_type_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Assigned User</label>
                <select
                  className="form-select"
                  name="work_user"
                  value={formData.work_user || ""}
                  onChange={(e) => {
                    onInputChange("work_user", e.target.value);
                  }}
                >
                  <option value="">Select user</option>
                  {work_user_options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Timeline Section */}
          <section className="form-section">
            <div className="form-grid form-grid-3">
              <div className="form-group">
                <label className="form-label">Start Date</label>
                <input
                  className="form-input"
                  type="date"
                  name="start_date"
                  value={
                    formData.start_date
                      ? new Date(formData.start_date)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    onInputChange(
                      "start_date",
                      new Date(e.target.value).toISOString(),
                    );
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">End Date</label>
                <input
                  className="form-input"
                  type="date"
                  name="end_date"
                  value={
                    formData.end_date
                      ? new Date(formData.end_date).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    onInputChange(
                      "end_date",
                      new Date(e.target.value).toISOString(),
                    );
                  }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Progress (%)</label>
                <input
                  className="form-input"
                  type="number"
                  name="progress_percent"
                  min="0"
                  max="100"
                  value={formData.progress_percent || 0}
                  onChange={(e) => {
                    onInputChange(
                      "progress_percent",
                      parseInt(e.target.value) || 0,
                    );
                  }}
                />
              </div>
            </div>
          </section>

          {/* Tasks Section */}
          {formData.id && (
            <section className="form-section">
              <h4 className="section-title">Tasks</h4>
              <div className="task-input-group">
                <input
                  className="form-input"
                  type="text"
                  name="task_name"
                  value={formDataTask.task_name || ""}
                  onChange={(e) => {
                    onInputChangeTask("task_name", e.target.value);
                  }}
                  placeholder="Add a new task"
                />
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() =>
                    onSaveTask({
                      ...formDataTask,
                      feature_id: formData.id,
                    })
                  }
                  disabled={isBusy || !formDataTask.task_name}
                >
                  Add
                </button>
              </div>

              <div className="task-list">
                {taskList && taskList.length > 0 ? (
                  taskList.map((task) => (
                    <div key={task.id} className="task-item">
                      <div className="task-checkbox-group">
                        <input
                          className="form-checkbox"
                          type="checkbox"
                          checked={task.is_done || false}
                          onChange={(e) => {
                            onDoneTask(task.id, e.target.checked);
                          }}
                          disabled={isBusy}
                        />
                        <span className={`task-name ${task.is_done ? "task-done" : ""}`}>
                          {task.task_name}
                        </span>
                      </div>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDeleteTask(task.id)}
                        disabled={isBusy}
                      >
                        Delete
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="empty-list-text">No tasks yet</p>
                )}
              </div>
            </section>
          )}

          {/* Linked Tables Section */}
          {formData.id && formData.feature_type === "feature" && (
            <section className="form-section">
              <h4 className="section-title">Linked Tables</h4>
              <div className="form-group">
                <label className="form-label">Select Table</label>
                <div className="form-input-with-btn">
                  <select
                    className="form-select"
                    value={selectedTableId || ""}
                    onChange={(e) => onInputChangeTable(e.target.value)}
                  >
                    <option value="">Select a table to link</option>
                    {tableList
                      .filter(
                        (table) =>
                          !featureTableList.some(
                            (mapping) => mapping.table_id === table.id,
                          ),
                      )
                      .map((table) => (
                        <option key={table.id} value={table.id}>
                          {table.table_name}
                        </option>
                      ))}
                  </select>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={onAddFeatureTable}
                    disabled={isBusy || !selectedTableId}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="linked-tables-list">
                {featureTableList && featureTableList.length > 0 ? (
                  featureTableList.map((mapping) => {
                    const table = tableList.find(
                      (item) => item.id === mapping.table_id,
                    );
                    return (
                      <div key={mapping.id} className="linked-table-item">
                        <div className="linked-table-info">
                          <div className="linked-table-name">
                            {table?.table_name || "Unknown table"}
                          </div>
                          <div className="linked-table-desc">
                            {table?.table_description || "No description"}
                          </div>
                        </div>
                        <button
                          className="btn-sm btn-danger"
                          onClick={() => onDeleteFeatureTable(mapping.id)}
                          disabled={isBusy}
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="empty-list-text">No linked tables yet.</p>
                )}
              </div>
            </section>
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
              onClick={() => onDelete(formData.id)}
              disabled={isBusy}
            >
              Delete
            </button>
          )}
          <button
            className="btn btn-primary"
            onClick={() => onSave(formData)}
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
