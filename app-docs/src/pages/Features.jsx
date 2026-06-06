import { useMemo } from "react";
import useFeatures from "../hooks/useFeatures.js";
import FeatureSidebar from "./FeatureSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyCardsState from "../components/EmptyCardsState";
import {
  formatFeatureTypeLabel,
  formatEndDateRemaining,
  slugify,
} from "../utils/featureFormat.js";

const EMPTY = "—";

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
    handleAddClick,
    handleEditClick,
    handleCloseSidebarClick,
    handleInputChange,
    handleDeleteClick,
    handleSaveClick,
    formatDateInput,
    handleDateChange,
    selectedTableId,
    handleInputChangeTable,
    handleAddFeatureTableClick,
    tableList,
    featureTableList,
    handleDeleteFeatureTableClick,
    formDataTask,
    handleInputChangeTask,
    handleAddTask,
    handleTaskKeyDown,
    taskList,
    handleDoneTaskClick,
    handleDeleteTaskClick,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    typeFilter,
    setTypeFilter,
    hasActiveFilters,
    clearFilters,
    featureTypeFilters,
    expandedRows,
    toggleExpand,
    rootRows,
    getChildrenByFeatureId,
    hasVisibleTreeRows,
  } = useFeatures();

  const treeRows = useMemo(() => {
    const rows = [];

    const renderRows = (items, depth = 0) => {
      items.forEach((data) => {
        const children = getChildrenByFeatureId(data.id);
        const hasChildren = children.length > 0;
        const isExpanded = expandedRows[data.id];
        const endDateLabel = formatEndDateRemaining(data.end_date);
        const description = data.feature_description?.trim() || "";
        const status =
          data.feature_status && data.feature_status !== "-"
            ? data.feature_status
            : null;
        const priority =
          data.feature_priority && data.feature_priority !== "-"
            ? data.feature_priority
            : null;
        const workType =
          data.work_type && data.work_type !== "-" ? data.work_type : null;

        rows.push(
          <tr
            key={data.id}
            className={`feature-tree-row feature-tree-depth-${Math.min(depth, 3)}`}
          >
            <td className="feature-tree-col-name">
              <div className="feature-tree-name-cell">
                {hasChildren ? (
                  <button
                    type="button"
                    className="expand-button"
                    onClick={() => toggleExpand(data.id)}
                    aria-label={isExpanded ? "Collapse" : "Expand"}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded ? "\u25BC" : "\u25B7"}
                  </button>
                ) : (
                  <span
                    className="feature-tree-expand-spacer"
                    aria-hidden="true"
                  />
                )}
                <span className="feature-tree-num">
                  {data.serial_number ?? "·"}
                </span>
                <span
                  className={`feature-tree-name`}
                  onClick={() => handleEditClick(data)}
                  style={{ cursor: "pointer" }}
                >
                  {data.feature_name}
                </span>
                <span
                  className={`feature-type-badge feature-type-${data.feature_type || "default"}`}
                >
                  {formatFeatureTypeLabel(data.feature_type)}
                </span>
                <a
                  href={data.url_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`feature-tree-name ${data.url_link ? "url-link" : ""}`}
                >
                  {data.url_link}
                </a>
              </div>
            </td>
            <td className="feature-tree-col-desc">
              <span
                className="feature-tree-desc"
                title={description || undefined}
              >
                {description || EMPTY}
              </span>
            </td>
            <td className="feature-tree-col-status">
              {status ? (
                <span
                  className={`feature-meta-badge feature-status-${slugify(status)}`}
                >
                  {status}
                </span>
              ) : (
                EMPTY
              )}
            </td>
            <td className="feature-tree-col-priority">
              {priority ? (
                <span
                  className={`feature-meta-badge feature-priority-${slugify(priority)}`}
                >
                  {priority}
                </span>
              ) : (
                EMPTY
              )}
            </td>
            <td className="feature-tree-col-work">
              <span className="feature-tree-work">{workType || EMPTY}</span>
            </td>
            <td className="feature-tree-col-date">{endDateLabel || EMPTY}</td>
            <td className="feature-tree-col-actions">
              <button
                type="button"
                className="feature-row-btn"
                onClick={() => handleEditClick(data)}
                title="Edit"
                disabled={isBusy}
              >
                Edit
              </button>
              {data.feature_type !== "feature" && (
                <button
                  type="button"
                  className="feature-row-btn feature-row-btn-add"
                  onClick={() =>
                    handleAddClick({
                      id: data.id,
                      type: data.feature_type,
                    })
                  }
                  title="Add child"
                  disabled={isBusy}
                >
                  +
                </button>
              )}
            </td>
          </tr>,
        );

        if (hasChildren && isExpanded) {
          renderRows(children, depth + 1);
        }
      });
    };

    renderRows(rootRows);
    return rows;
  }, [
    rootRows,
    expandedRows,
    getChildrenByFeatureId,
    isBusy,
    handleEditClick,
    handleAddClick,
    toggleExpand,
  ]);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Features List</h2>
          <p className="page-subtitle">
            Manage and organize your project features
          </p>
        </div>

        <div className="page-header-actions">
          <div className="page-filters">
            <input
              type="search"
              className="form-input page-filter-search"
              placeholder="Search features..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search features"
            />
            <select
              className="form-select page-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter by type"
            >
              {featureTypeFilters.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              className="form-select page-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              aria-label="Filter by status"
            >
              <option value="">All statuses</option>
              {feature_status_options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </select>
            <select
              className="form-select page-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter by priority"
            >
              <option value="">All priorities</option>
              {feature_priority_options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.name}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary btn-sm page-filter-clear"
                onClick={clearFilters}
              >
                Clear
              </button>
            )}
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleAddClick({ id: "", type: "-" })}
            disabled={isBusy}
          >
            + Add Project
          </button>
        </div>
      </div>

      <div className="features-compact-wrap">
        {isBusy && dataList.length === 0 ? (
          <LoadingSpinner label="Loading features..." />
        ) : hasVisibleTreeRows ? (
          <table className="features-compact-table">
            <colgroup>
              <col className="features-col-name" />
              <col className="features-col-desc" />
              <col className="features-col-status" />
              <col className="features-col-priority" />
              <col className="features-col-work" />
              <col className="features-col-date" />
              <col className="features-col-actions" />
            </colgroup>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Work</th>
                <th className="feature-tree-col-date">End</th>
                <th className="feature-tree-col-actions">Actions</th>
              </tr>
            </thead>
            <tbody>{treeRows}</tbody>
          </table>
        ) : (
          <EmptyCardsState
            title={dataList.length === 0 ? "No features yet" : "No matching features"}
            text={
              dataList.length === 0
                ? "Create projects and features to manage and organize your project details."
                : "Try different filters or clear them to see more features."
            }
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            }
          >
            {dataList.length === 0 ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => handleAddClick({ id: "", type: "-" })}
                disabled={isBusy}
              >
                + Add first project
              </button>
            ) : (
              hasActiveFilters && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )
            )}
          </EmptyCardsState>
        )}
      </div>

      <FeatureSidebar
        isBusy={isBusy}
        dataList={dataList}
        formData={formData}
        isSideBar={isSideBar}
        feature_status_options={feature_status_options}
        feature_priority_options={feature_priority_options}
        work_type_options={work_type_options}
        work_user_options={work_user_options}
        formatDateInput={formatDateInput}
        onCloseSidebarClick={handleCloseSidebarClick}
        onInputChange={handleInputChange}
        onDateChange={handleDateChange}
        onDeleteClick={handleDeleteClick}
        onSaveClick={handleSaveClick}
        selectedTableId={selectedTableId}
        onInputChangeTable={handleInputChangeTable}
        onAddFeatureTableClick={handleAddFeatureTableClick}
        tableList={tableList}
        featureTableList={featureTableList}
        onDeleteFeatureTableClick={handleDeleteFeatureTableClick}
        formDataTask={formDataTask}
        onInputChangeTask={handleInputChangeTask}
        onAddTask={handleAddTask}
        onTaskKeyDown={handleTaskKeyDown}
        taskList={taskList}
        onDoneTaskClick={handleDoneTaskClick}
        onDeleteTaskClick={handleDeleteTaskClick}
      />
    </div>
  );
};

export default Features;
