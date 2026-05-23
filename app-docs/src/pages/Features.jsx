// Features.jsx
import React, { useState } from "react";
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
    //task
    taskList,
    formDataTask,
    handleGetTaskByFeature,
    handleInputChangeTask,
    handleSaveTask,
    handleDoneTask,
    handleDeleteTask,
    //feature table
    tableList,
    featureTableList,
    selectedTableId,
    handleInputChangeTable,
    handleAddFeatureTable,
    handleDeleteFeatureTable,
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
    return dataList.filter(
      (item) => !item.feature_id || item.feature_id === "",
    );
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
            <td>
              <div className={`level-${level}`}>
                {hasChildren ? (
                  <button
                    className="expand-button"
                    onClick={() => toggleExpand(feature.id)}
                    aria-label={isExpanded ? "Collapse row" : "Expand row"}
                  >
                    {isExpanded ? "▼" : "▶"}
                  </button>
                ) : (
                  <span style={{ display: "inline-block", width: "18px" }} />
                )}
                <span>{feature.feature_name}</span>
              </div>
            </td>
            <td>{feature.feature_description || "-"}</td>
            <td>{feature.feature_status}</td>
            <td>{feature.feature_priority}</td>
            <td>{feature.work_type || "-"}</td>
            <td>{feature.work_user || "-"}</td>
            <td>
              {feature.end_date
                ? new Date(feature.end_date).toLocaleDateString()
                : "-"}
            </td>
            <td>
              <div style={{ display: "flex", gap: "4px" }}>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={(e) => handleRowClick(feature)}
                  title="Edit feature"
                >
                  / Edit
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={(e) =>
                    handleAddNew({
                      id: feature.id,
                      type: feature.feature_type,
                    })
                  }
                  title="Add sub-feature"
                >
                  + Add
                </button>
              </div>
            </td>
          </tr>,
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
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Features List</h2>
          <p className="page-subtitle">
            Manage and organize your project features
          </p>
        </div>
        <button
          className="btn btn-primary"
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
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Work Type</th>
              <th>Assigned User</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{buildTableRows().length > 0 && buildTableRows()}</tbody>
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
        //task
        taskList={taskList}
        formDataTask={formDataTask}
        onGetTaskByFeature={handleGetTaskByFeature}
        onInputChangeTask={handleInputChangeTask}
        onSaveTask={handleSaveTask}
        onDoneTask={handleDoneTask}
        onDeleteTask={handleDeleteTask}
        //feature table
        tableList={tableList}
        featureTableList={featureTableList}
        selectedTableId={selectedTableId}
        onInputChangeTable={handleInputChangeTable}
        onAddFeatureTable={handleAddFeatureTable}
        onDeleteFeatureTable={handleDeleteFeatureTable}
      />
    </div>
  );
};

export default Features;
