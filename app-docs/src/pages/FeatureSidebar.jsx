// FeatureSidebar.jsx
import React, { useState, useEffect } from "react";
import "./FeatureSidebar.css";

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
  taskList,
  formDataTask,
  onGetTaskByFeature,
  onInputChangeTask,
  onSaveTask,
  onDoneTask,
  onDeleteTask,
}) => {
  useEffect(() => {
    if (formData.id && isSideBar) {
      onGetTaskByFeature(formData.id);
    }
  }, [formData.id, isSideBar]);
  if (!isSideBar) return null;

  return (
    <div className="sidebar-backdrop" onClick={onCloseSidebar}>
      <div className="sidebar-content" onClick={(e) => e.stopPropagation()}>
        {/* {JSON.stringify(formData)} */}
        <div className="sidebar-header">
          <div className="header-field">
            <label>Serial No.</label>
            <input
              type="text"
              name="serial_number"
              value={formData.serial_number || ""}
              onChange={(e) => {
                onInputChange("serial_number", e.target.value);
              }}
              placeholder="Enter serial number"
            />
          </div>
          <div className="header-field">
            <label>Name *</label>
            <input
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
          <button
            className="close-button"
            onClick={onCloseSidebar}
            disabled={isBusy}
          >
            &times;
          </button>
        </div>
        <div className="sidebar-body">
          <>
            <div className="detail-group">
              <label>Description</label>
              <textarea
                name="feature_description"
                value={formData.feature_description || ""}
                onChange={(e) => {
                  onInputChange("feature_description", e.target.value);
                }}
                placeholder="Enter description"
                rows="3"
              />
            </div>
            <div className="detail-row detail-row-4col">
              <div className="detail-group">
                <label>Status</label>
                <select
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
              <div className="detail-group">
                <label>Priority</label>
                <select
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
              <div className="detail-group">
                <label>Work Type</label>
                <select
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
              <div className="detail-group">
                <label>Assigned User</label>
                <select
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
            <div className="detail-row detail-row-3col">
              <div className="detail-group">
                <label>Start Date</label>
                <input
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
              <div className="detail-group">
                <label>End Date</label>
                <input
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
              <div className="detail-group">
                <label>Progress (%)</label>
                <input
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
          </>

          {formData.id && (
            <div className="detail-group">
              <label>Tasks</label>
              <div className="task-section">
                <div className="task-form">
                  <input
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
                    Add Task
                  </button>
                </div>

                <div className="task-list">
                  {taskList && taskList.length > 0 ? (
                    taskList.map((task) => (
                      <div key={task.id} className="task-item">
                        <div className="task-content">
                          <input
                            type="checkbox"
                            checked={task.is_done || false}
                            onChange={(e) => {
                              onDoneTask(task.id, e.target.checked);
                            }}
                            disabled={isBusy}
                          />
                          <span
                            className={
                              task.is_done ? "task-name task-done" : "task-name"
                            }
                          >
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
                    <p className="task-empty">No tasks yet</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="sidebar-footer">
          <button
            className="btn btn-primary"
            onClick={() => onSave(formData)}
            disabled={isBusy}
          >
            {isBusy ? "Saving..." : "Save"}
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
        </div>
      </div>
    </div>
  );
};

export default FeatureSidebar;
