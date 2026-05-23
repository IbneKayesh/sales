import useTables from "../hooks/useTables.js";
import TablesSidebar from "./TablesSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import SqlPreviewModal, { SqlViewButton } from "../components/SqlPreviewModal";
import {
  formatColumnType,
  formatColumnTooltip,
} from "../utils/columnFormat.js";

const Tables = () => {
  const {
    isBusy,
    dataList,
    formData,
    isSideBar,
    handleInputChange,
    handleRowClick,
    handleCloseSidebar,
    handleAddNew,
    handleSaveClick,
    handleDeleteClick,
    columnList,
    formDataColumn,
    handleInputChangeColumn,
    handleEditColumn,
    handleCopyColumn,
    handleSaveColumnClick,
    handleDeleteColumn,
    dataTypeOptions,
    createTableSql,
    copied,
    handleCopySql,
    sqlPreview,
    handleViewSql,
    handleCloseSqlPreview,
    handleCopySqlPreview,
    searchQuery,
    setSearchQuery,
    filteredTables,
    hasActiveFilters,
    clearSearch,
    expandedCardIds,
    cardColumns,
    loadingColumns,
    toggleCardExpand,
    expandedFeatureCardIds,
    tableCardFeatures,
    loadingTableFeatures,
    handleToggleFeatures,
  } = useTables();

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Tables List</h2>
          <p className="page-subtitle">
            Define and manage your database tables
          </p>
        </div>
        <div className="page-header-actions">
          <div className="page-filters">
            <input
              type="search"
              className="form-input page-filter-search"
              placeholder="Search tables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search tables"
            />
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary btn-sm page-filter-clear"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
          <button
            className="btn btn-primary"
            onClick={handleAddNew}
            disabled={isBusy}
          >
            + Add Table
          </button>
        </div>
      </div>

      <div className="cards-grid">
        {dataList && dataList.length > 0 ? (
          filteredTables.length > 0 ? (
          filteredTables.map((table) => {
            const isExpanded = expandedCardIds.includes(table.id);
            const columns = cardColumns[table.id] || [];
            const isLoading = loadingColumns[table.id];

            return (
              <div key={table.id} className="table-card">
                {/* Header */}
                <div className="card-header">
                  <div className="card-header-left">
                    <div className="serial-badge">
                      {table.serial_number || "-"}
                    </div>
                    <div className="card-title-group">
                      <h3 className="card-title" title={table.table_name}>
                        {table.table_name}
                      </h3>
                      <p
                        className="card-subtitle"
                        title={table.table_description}
                      >
                        {table.table_description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  <div className="card-header-actions">
                    <SqlViewButton
                      onClick={() => handleViewSql(table)}
                      disabled={isBusy}
                    />
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => handleRowClick(table)}
                      title="Edit table details"
                      disabled={isBusy}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Body (Expanded Columns List) */}
                {isExpanded && (
                  <div className="card-body">
                    {isLoading ? (
                      <LoadingSpinner label="Loading columns..." />
                    ) : columns.length > 0 ? (
                      <div className="card-columns-compact">
                        {columns.map((col) => (
                          <div
                            key={col.id}
                            className="card-col-chip"
                            title={formatColumnTooltip(col)}
                          >
                            <div className="card-col-chip-row">
                              <span className="card-col-num">
                                {col.serial_number ?? "·"}
                              </span>
                              <span className="card-col-name">
                                {col.column_name}
                              </span>
                            </div>
                            <div className="card-col-chip-meta">
                              <code className="card-col-type">
                                {formatColumnType(col)}
                              </code>
                              {col.is_nullable === false && (
                                <span className="flag flag-nn" title="Not Null">
                                  NN
                                </span>
                              )}
                              {col.default_value && (
                                <span
                                  className="card-col-default"
                                  title={`Default: ${col.default_value}`}
                                >
                                  ={col.default_value}
                                </span>
                              )}
                              {col.is_primary && (
                                <span
                                  className="flag flag-pk"
                                  title="Primary Key"
                                >
                                  PK
                                </span>
                              )}
                              {col.is_foreign && (
                                <span
                                  className="flag flag-fk"
                                  title="Foreign Key"
                                >
                                  FK
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                        <p className="card-columns-summary">
                          {columns.length} column
                          {columns.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ) : (
                      <p className="empty-columns-text">
                        No columns defined for this table.
                      </p>
                    )}
                  </div>
                )}

                {/* Features Footer */}
                <div className="card-features-footer">
                  <button
                    className="btn-features-toggle"
                    onClick={() => handleToggleFeatures(table.id)}
                    style={{
                      textAlign: "left",
                      width: "100%",
                      padding: 0,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: "var(--font-weight-semibold)",
                        color: "var(--text-secondary)",
                        fontSize: "var(--font-size-sm)",
                        marginBottom: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.3,
                      }}
                    >
                      Linked Features
                    </span>
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      {expandedFeatureCardIds.includes(table.id) ? (
                        loadingTableFeatures[table.id] ? (
                          <LoadingSpinner label="Loading features..." />
                        ) : tableCardFeatures[table.id] &&
                          tableCardFeatures[table.id].length > 0 ? (
                          tableCardFeatures[table.id].map((ft) => (
                            <span
                              key={ft.id}
                              className="card-feature-badge"
                              title={
                                ft.feature_name
                                  ? `${ft.feature_type} - ${ft.feature_name}`
                                  : ft.feature_name
                              }
                            >
                              {ft.feature_name}
                            </span>
                          ))
                        ) : (
                          <span
                            style={{
                              fontSize: "var(--font-size-xs)",
                              color: "var(--text-tertiary)",
                              fontStyle: "italic",
                            }}
                          >
                            No features linked to this table.
                          </span>
                        )
                      ) : (
                        <span
                          style={{
                            fontSize: "var(--font-size-xs)",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          Click to view linked features
                        </span>
                      )}
                    </div>
                  </button>
                </div>

                {/* Bottom Toggle Button */}
                <button
                  className="btn-expand"
                  onClick={() => toggleCardExpand(table.id)}
                  title={
                    isExpanded ? "Collapse column list" : "Expand column list"
                  }
                >
                  <span>
                    {isExpanded
                      ? `Hide Columns (${columns.length})`
                      : `Show Columns${
                          cardColumns[table.id]?.length
                            ? ` (${cardColumns[table.id].length})`
                            : ""
                        }`}
                  </span>
                  <svg
                    className={`chevron-icon ${isExpanded ? "rotated" : ""}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
            );
          })
          ) : (
            <div className="empty-cards-state">
              <h3 className="empty-state-title">No matching tables</h3>
              <p className="empty-state-text">
                Try a different search term or clear the filter.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearSearch}
              >
                Clear search
              </button>
            </div>
          )
        ) : (
          <div className="empty-cards-state">
            <div className="empty-state-icon">
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
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                <path d="M12 8v8" />
                <path d="M8 12h8" />
              </svg>
            </div>
            <h3 className="empty-state-title">No Tables Found</h3>
            <p className="empty-state-text">
              Define your database tables to start managing schema structures,
              keys, and columns.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleAddNew}
              disabled={isBusy}
            >
              + Create First Table
            </button>
          </div>
        )}
      </div>

      {sqlPreview && (
        <SqlPreviewModal
          tableName={sqlPreview.tableName}
          sql={sqlPreview.sql}
          loading={sqlPreview.loading}
          copied={copied}
          onClose={handleCloseSqlPreview}
          onCopy={handleCopySqlPreview}
        />
      )}

      <TablesSidebar
        isBusy={isBusy}
        formData={formData}
        formDataColumn={formDataColumn}
        columnList={columnList}
        isSideBar={isSideBar}
        dataTypeOptions={dataTypeOptions}
        createTableSql={createTableSql}
        copied={copied}
        onInputChange={handleInputChange}
        onInputChangeColumn={handleInputChangeColumn}
        onEditColumn={handleEditColumn}
        onCopyColumn={handleCopyColumn}
        onCloseSidebar={handleCloseSidebar}
        onDeleteClick={handleDeleteClick}
        onDeleteColumn={handleDeleteColumn}
        onSaveClick={handleSaveClick}
        onSaveColumnClick={handleSaveColumnClick}
        onCopySql={handleCopySql}
      />
    </div>
  );
};

export default Tables;
