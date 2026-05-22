// Features.jsx
import React, { useState, useMemo } from "react";
import "./Features.css";
import useFeatures from "../hooks/useFeatures.js";
import FeatureSidebar from "./FeatureSidebar";

const Features = () => {
  const {
    isBusy,
    dataList,
    formData,
    isSideBar,
    feature_status_options,
    feature_priority_options,
    work_type_options,
    work_user_options,
    handleInputChange,
    handleRowClick,
    handleCloseSidebar,
    handleDelete,
    handleSave,
    handleAddNew,
    taskList,
    formDataTask,
    handleGetTaskByFeature,
    handleInputChangeTask,
    handleSaveTask,
    handleDoneTask,
    handleDeleteTask,
  } = useFeatures();

  const [expandedRows, setExpandedRows] = useState({});

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getChildrenByFeatureId = (parentId) => {
    return dataList.filter((item) => item.feature_id === parentId);
  };

  const getRootRows = () => {
    return dataList.filter((item) => !item.feature_id || item.feature_id === "");
  };

  const buildTableRows = () => {
    const rows = [];

    const renderRows = (items, level = 0) => {
      items.forEach((feature) => {
        const children = getChildrenByFeatureId(feature.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedRows[feature.id];

        rows.push(
          <tr key={feature.id}>
            <td className="font-medium" style={{ paddingLeft: `${level * 20}px` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {hasChildren ? (
                  <button
                    onClick={() => toggleExpand(feature.id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "0",
                      width: "20px",
                      textAlign: "center",
                    }}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                ) : (
                  <span style={{ width: "20px" }}></span>
                )}
                <span>{feature.feature_name}</span>
              </div>
            </td>
            <td>{feature.feature_description || "-"}</td>
            <td>
              <span className={`badge status-${feature.feature_status}`}>
                {feature.feature_status}
              </span>
            </td>
            <td>
              <span
                className={`badge priority-${feature.feature_priority}`}
              >
                {feature.feature_priority}
              </span>
            </td>
            <td>{feature.work_type}</td>
            <td>{feature.work_user}</td>
            <td>
              {feature.end_date
                ? new Date(feature.end_date).toLocaleDateString()
                : "-"}
            </td>
            <td>
              <button onClick={(e) => handleRowClick(feature)}>
                / edit
              </button>

              <button
                onClick={(e) =>
                  handleAddNew({
                    id: feature.id,
                    type: feature.feature_type,
                  })
                }
              >
                + Add
              </button>
            </td>
          </tr>
        );

        if (hasChildren && isExpanded) {
          renderRows(children, level + 1);
        }
      });
    };

    renderRows(getRootRows());
    return rows;
  };

  return (
    <div className="features-container">
      <h2>Features List</h2>
      <button
        className="add-button"
        onClick={(e) => {
          handleAddNew({
            id: "",
            type: "-",
          });
        }}
        disabled={isBusy}
      >
        + Add Project
      </button>
      <div className="table-responsive">
        <table className="features-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Work Type</th>
              <th>Assigned User</th>
              <th>End Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {buildTableRows().length > 0 ? (
              buildTableRows()
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No features found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <FeatureSidebar
        isBusy={isBusy}
        formData={formData}
        isSideBar={isSideBar}
        feature_status_options={feature_status_options}
        feature_priority_options={feature_priority_options}
        work_type_options={work_type_options}
        work_user_options={work_user_options}
        onInputChange={handleInputChange}
        onRowClick={handleRowClick}
        onCloseSidebar={handleCloseSidebar}
        onDelete={handleDelete}
        onSave={handleSave}
        taskList={taskList}
        formDataTask={formDataTask}
        onGetTaskByFeature={handleGetTaskByFeature}
        onInputChangeTask={handleInputChangeTask}
        onSaveTask={handleSaveTask}
        onDoneTask={handleDoneTask}
        onDeleteTask={handleDeleteTask}
      />
    </div>
  );
};

export default Features;
