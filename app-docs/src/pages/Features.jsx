import { useState, useMemo, useCallback, useEffect } from "react";
import useFeatures from "../hooks/useFeatures.js";
import FeatureSidebar from "./FeatureSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import {
  formatFeatureTypeLabel,
  formatEndDateRemaining,
  slugify,
} from "../utils/featureFormat.js";

const EMPTY = "—";

const FEATURE_TYPE_FILTERS = [
  { value: "", label: "All types" },
  { value: "project", label: "Project" },
  { value: "module", label: "Module" },
  { value: "submodule", label: "Submodule" },
  { value: "feature", label: "Feature" },
];

const featureMatchesFilters = (
  item,
  { searchQuery, statusFilter, priorityFilter, typeFilter },
) => {
  if (typeFilter && item.feature_type !== typeFilter) return false;

  if (statusFilter) {
    const status =
      item.feature_status && item.feature_status !== "-"
        ? item.feature_status
        : "";
    if (status !== statusFilter) return false;
  }

  if (priorityFilter) {
    const priority =
      item.feature_priority && item.feature_priority !== "-"
        ? item.feature_priority
        : "";
    if (priority !== priorityFilter) return false;
  }

  const q = searchQuery.trim().toLowerCase();
  if (q) {
    const name = String(item.feature_name || "").toLowerCase();
    const desc = String(item.feature_description || "").toLowerCase();
    const serial = String(item.serial_number ?? "");
    if (!name.includes(q) && !desc.includes(q) && !serial.includes(q)) {
      return false;
    }
  }

  return true;
};

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
    selectedTableId,
    handleInputChangeTable,
    handleAddFeatureTableClick,
    tableList,
    featureTableList,
    handleDeleteFeatureTableClick,
    formDataTask,
    handleInputChangeTask,
    handleSaveTaskClick,
    taskList,
    handleDoneTaskClick,
    handleDeleteTaskClick,
  } = useFeatures();

  const [expandedRows, setExpandedRows] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const hasActiveFilters = Boolean(
    searchQuery.trim() || statusFilter || priorityFilter || typeFilter,
  );

  const visibleIds = useMemo(() => {
    if (!hasActiveFilters) return null;

    const filters = { searchQuery, statusFilter, priorityFilter, typeFilter };
    const byId = new Map(dataList.map((item) => [item.id, item]));
    const ids = new Set();

    for (const item of dataList) {
      if (!featureMatchesFilters(item, filters)) continue;

      let current = item;
      while (current) {
        ids.add(current.id);
        const parentId = current.feature_id;
        current =
          parentId && parentId !== "" ? byId.get(parentId) : null;
      }
    }

    return ids;
  }, [
    dataList,
    hasActiveFilters,
    searchQuery,
    statusFilter,
    priorityFilter,
    typeFilter,
  ]);

  useEffect(() => {
    if (!visibleIds || visibleIds.size === 0) return;

    setExpandedRows((prev) => {
      const next = { ...prev };
      let changed = false;

      for (const id of visibleIds) {
        const hasChildren = dataList.some((item) => item.feature_id === id);
        if (hasChildren && !next[id]) {
          next[id] = true;
          changed = true;
        }
      }

      return changed ? next : prev;
    });
  }, [visibleIds, dataList]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("");
    setPriorityFilter("");
    setTypeFilter("");
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({
      ...prev,

      [id]: !prev[id],
    }));
  };

  const getChildrenByFeatureId = useCallback(
    (parentId) =>
      dataList
        .filter((item) => item.feature_id === parentId)
        .filter((item) => !visibleIds || visibleIds.has(item.id))
        .sort((a, b) => (a.serial_number ?? 0) - (b.serial_number ?? 0)),

    [dataList, visibleIds],
  );

  const rootRows = useMemo(
    () =>
      dataList
        .filter(
          (item) =>
            (!item.feature_id || item.feature_id === "") &&
            item.feature_type === "project",
        )
        .filter((item) => !visibleIds || visibleIds.has(item.id))
        .sort((a, b) => (a.serial_number ?? 0) - (b.serial_number ?? 0)),

    [dataList, visibleIds],
  );

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

                <span className="feature-tree-name">{data.feature_name}</span>

                <span
                  className={`feature-type-badge feature-type-${data.feature_type || "default"}`}
                >
                  {formatFeatureTypeLabel(data.feature_type)}
                </span>
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
              {FEATURE_TYPE_FILTERS.map((opt) => (
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
        ) : treeRows.length > 0 ? (
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
          <p className="empty-list-text">
            {dataList.length === 0
              ? "No features found."
              : hasActiveFilters
                ? "No features match your search or filters."
                : "No features found."}
          </p>
        )}
      </div>

      <FeatureSidebar
        isBusy={isBusy}
        formData={formData}
        isSideBar={isSideBar}
        feature_status_options={feature_status_options}
        feature_priority_options={feature_priority_options}
        work_type_options={work_type_options}
        work_user_options={work_user_options}
        onCloseSidebarClick={handleCloseSidebarClick}
        onInputChange={handleInputChange}
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
        onSaveTaskClick={handleSaveTaskClick}
        taskList={taskList}
        onDoneTaskClick={handleDoneTaskClick}
        onDeleteTaskClick={handleDeleteTaskClick}
      />
    </div>
  );
};

export default Features;
