import useTables from "../hooks/useTables.js";
import TablesSidebar from "./TablesSidebar";
import LoadingSpinner from "../components/LoadingSpinner";
import SqlPreviewModal from "../components/SqlPreviewModal";
import TableErdCard from "../components/TableErdCard";

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
    clearFilters,
    projectFilter,
    moduleFilter,
    submoduleFilter,
    featureFilter,
    setFeatureFilter,
    handleProjectFilterChange,
    handleModuleFilterChange,
    handleSubmoduleFilterChange,
    projectOptions,
    moduleOptions,
    submoduleOptions,
    featureOptions,
    loadingFeatureFilter,
    expandedCardIds,
    cardColumns,
    loadingColumns,
    handleToggleColumns,
    expandedFeatureCardIds,
    tableCardFeatures,
    loadingTableFeatures,
    handleToggleFeatures,
    fkLookup,
    referencedByIndex,
    schemaStats,
    highlightTableId,
    handleFocusTable,
  } = useTables();

  return (
    <div className="page-container schema-erd-page">
      <div className="page-header">
        <div className="page-title-section">
          <h2 className="page-title">Database Schema</h2>
          <p className="page-subtitle">
            ERD-style entity view — tables, keys, and relationships
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
            <select
              className="form-select page-filter-select"
              value={projectFilter}
              onChange={(e) => handleProjectFilterChange(e.target.value)}
              aria-label="Filter by project"
            >
              <option value="">All projects</option>
              <option value="NM">Non matched</option>
              {projectOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.feature_name}
                </option>
              ))}
            </select>
            <select
              className="form-select page-filter-select"
              value={moduleFilter}
              onChange={(e) => handleModuleFilterChange(e.target.value)}
              disabled={!projectFilter}
              aria-label="Filter by module"
            >
              <option value="">All modules</option>
              {moduleOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.feature_name}
                </option>
              ))}
            </select>
            <select
              className="form-select page-filter-select"
              value={submoduleFilter}
              onChange={(e) => handleSubmoduleFilterChange(e.target.value)}
              disabled={!moduleFilter}
              aria-label="Filter by submodule"
            >
              <option value="">All submodules</option>
              {submoduleOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.feature_name}
                </option>
              ))}
            </select>
            <select
              className="form-select page-filter-select"
              value={featureFilter}
              onChange={(e) => setFeatureFilter(e.target.value)}
              disabled={!submoduleFilter}
              aria-label="Filter by feature"
            >
              <option value="">All features</option>
              {featureOptions.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.feature_name}
                </option>
              ))}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                className="btn btn-secondary btn-sm page-filter-clear"
                onClick={clearFilters}
                disabled={loadingFeatureFilter}
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
            + Add Entity
          </button>
        </div>
      </div>

      {dataList && dataList.length > 0 && filteredTables.length > 0 && (
        <div className="schema-erd-toolbar" aria-label="Schema summary">
          <div className="schema-stat">
            <span className="schema-stat-value">{schemaStats.tableCount}</span>
            <span className="schema-stat-label">Tables</span>
          </div>
          <div className="schema-stat">
            <span className="schema-stat-value">{schemaStats.columnCount}</span>
            <span className="schema-stat-label">Columns</span>
          </div>
          <div className="schema-stat">
            <span className="schema-stat-value">
              {schemaStats.relationshipCount}
            </span>
            <span className="schema-stat-label">Relationships</span>
          </div>
          <div className="erd-legend" aria-label="Legend">
            <span className="erd-legend-item">
              <span className="erd-key-icon erd-key-pk">🔑</span> Primary key
            </span>
            <span className="erd-legend-item">
              <span className="erd-key-icon erd-key-fk">⧉</span> Foreign key
            </span>
            <span className="erd-legend-item">
              <span className="flag flag-nn">NN</span> Not null
            </span>
          </div>
        </div>
      )}

      <div className="cards-grid erd-grid">
        {dataList && dataList.length > 0 ? (
          loadingFeatureFilter ? (
            <LoadingSpinner label="Filtering schema..." />
          ) : filteredTables.length > 0 ? (
            filteredTables.map((table) => (
              <TableErdCard
                key={table.id}
                table={table}
                columns={cardColumns[table.id] || []}
                columnsLoaded={table.id in cardColumns}
                isColumnsExpanded={expandedCardIds.includes(table.id)}
                loading={Boolean(loadingColumns[table.id])}
                fkLookup={fkLookup}
                incomingRefs={referencedByIndex[table.id] || []}
                highlighted={highlightTableId === table.id}
                isBusy={isBusy}
                expandedFeatureCardIds={expandedFeatureCardIds}
                tableCardFeatures={tableCardFeatures}
                loadingTableFeatures={loadingTableFeatures}
                onEdit={handleRowClick}
                onViewSql={handleViewSql}
                onFocusTable={handleFocusTable}
                onToggleColumns={handleToggleColumns}
                onToggleFeatures={handleToggleFeatures}
              />
            ))
          ) : (
            <div className="empty-cards-state">
              <h3 className="empty-state-title">No matching tables</h3>
              <p className="empty-state-text">
                Try different filters or clear them to see more of the schema.
              </p>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={clearFilters}
              >
                Clear filters
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
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
              </svg>
            </div>
            <h3 className="empty-state-title">No entities yet</h3>
            <p className="empty-state-text">
              Create tables to model your database schema with primary keys,
              foreign keys, and relationships.
            </p>
            <button
              className="btn btn-primary"
              onClick={handleAddNew}
              disabled={isBusy}
            >
              + Create first table
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
        fkLookup={fkLookup}
        allTables={dataList}
        currentTableId={formData.id}
      />
    </div>
  );
};

export default Tables;
