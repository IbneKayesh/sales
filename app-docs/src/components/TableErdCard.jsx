import LoadingSpinner from "./LoadingSpinner";
import { SqlViewButton } from "./SqlPreviewModal";
import {
  formatColumnTooltip,
  formatColumnType,
  formatForeignKeyRef,
  formatForeignKeyTitle,
} from "../utils/columnFormat.js";
import {
  getColumnErdRole,
  getOutgoingRelationships,
  sortColumnsErdOrder,
} from "../utils/schemaErd.js";

const KeyIcon = ({ role }) => {
  if (role === "pk" || role === "pk-fk") {
    return (
      <span className="erd-key-icon erd-key-pk" title="Primary Key" aria-hidden>
        🔑
      </span>
    );
  }
  if (role === "fk") {
    return (
      <span className="erd-key-icon erd-key-fk" title="Foreign Key" aria-hidden>
        ⧉
      </span>
    );
  }
  return <span className="erd-key-icon erd-key-none" aria-hidden />;
};

const TableErdCard = ({
  table,
  columns = [],
  columnsLoaded = false,
  isColumnsExpanded = false,
  loading = false,
  fkLookup = {},
  incomingRefs = [],
  highlighted = false,
  isBusy = false,
  expandedFeatureCardIds = [],
  tableCardFeatures = {},
  loadingTableFeatures = {},
  onEdit,
  onViewSql,
  onFocusTable,
  onToggleColumns,
  onToggleFeatures,
}) => {
  const sortedColumns = sortColumnsErdOrder(columns);
  const outgoing =
    isColumnsExpanded && columnsLoaded
      ? getOutgoingRelationships(columns, fkLookup)
      : [];
  const pkCount = columns.filter((c) => c.is_primary).length;
  const fkCount = columns.filter((c) => c.is_foreign).length;
  const columnCountLabel =
    columnsLoaded && columns.length > 0
      ? `${columns.length} column${columns.length !== 1 ? "s" : ""}`
      : null;

  return (
    <article
      id={`erd-entity-${table.id}`}
      className={`erd-entity table-card${highlighted ? " erd-entity-highlight" : ""}`}
    >
      <header className="erd-entity-header">
        <div className="erd-entity-row-primary">
          <div className="serial-badge">{table.serial_number ?? "·"}</div>
          <h3 className="erd-entity-name" title={table.table_name}>
            {table.table_name}
          </h3>
          {columnsLoaded && columns.length > 0 && (
            <span className="erd-entity-counts" title="Columns / PK / FK">
              {columns.length} col{columns.length !== 1 ? "s" : ""}
              {pkCount > 0 ? ` · ${pkCount} PK` : ""}
              {fkCount > 0 ? ` · ${fkCount} FK` : ""}
            </span>
          )}
        </div>
        <div className="card-header-actions erd-entity-actions">
          <SqlViewButton onClick={() => onViewSql(table)} disabled={isBusy} />
          <button
            type="button"
            className="btn-icon"
            onClick={() => onEdit(table)}
            title="Edit table"
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
        <p
          className="erd-entity-desc"
          title={table.table_description || undefined}
        >
          {table.table_description || "No description provided."}
        </p>
      </header>

      <div className="card-features-footer erd-section-footer">
        <button
          type="button"
          className="btn-features-toggle"
          onClick={() => onToggleColumns(table.id)}
          aria-expanded={isColumnsExpanded}
        >
          <span className="erd-section-label">Columns</span>
          <div className="erd-section-content">
            {isColumnsExpanded ? (
              loading ? (
                <LoadingSpinner label="Loading columns..." />
              ) : sortedColumns.length > 0 ? (
                <div
                  className="erd-columns-list"
                  role="table"
                  aria-label={`${table.table_name} columns`}
                >
                  {sortedColumns.map((col) => {
                    const role = getColumnErdRole(col);
                    const fkRef = formatForeignKeyRef(col, fkLookup);

                    return (
                      <div
                        key={col.id}
                        className={`erd-column-block erd-column-${role}`}
                        title={formatColumnTooltip(col, fkLookup)}
                      >
                        <div className="erd-column-line">
                          <KeyIcon role={role} />
                          <span className="erd-col-serial">
                            {col.serial_number ?? "·"}
                          </span>
                          <span className="erd-col-name">{col.column_name}</span>
                          <code className="erd-col-type">
                            {formatColumnType(col)}
                          </code>
                          <div className="erd-col-constraints">
                            {col.is_nullable === false && (
                              <span className="flag flag-nn" title="NOT NULL">
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
                              <span className="flag flag-pk" title="Primary Key">
                                PK
                              </span>
                            )}
                            {col.is_foreign && (
                              <span
                                className="flag flag-fk"
                                title={formatForeignKeyTitle(col, fkLookup)}
                              >
                                FK
                                {fkRef ? (
                                  <button
                                    type="button"
                                    className="erd-fk-link"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onFocusTable?.(col.references_table);
                                    }}
                                    title={`Go to ${fkRef}`}
                                  >
                                    → {fkRef}
                                  </button>
                                ) : null}
                              </span>
                            )}
                          </div>
                        </div>
                        <p
                          className={`erd-col-description${
                            !col.column_description
                              ? " erd-col-description-empty"
                              : ""
                          }`}
                        >
                          {col.column_description || "—"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : columnsLoaded ? (
                <span className="erd-section-empty">No columns defined.</span>
              ) : null
            ) : (
              <span className="erd-section-empty">
                {columnCountLabel
                  ? `Click to view ${columnCountLabel}`
                  : "Click to view columns"}
              </span>
            )}
          </div>
        </button>

        {isColumnsExpanded &&
          columnsLoaded &&
          (outgoing.length > 0 || incomingRefs.length > 0) && (
            <footer className="erd-relationships">
              {outgoing.length > 0 && (
                <div className="erd-rel-group">
                  <span className="erd-rel-label">References</span>
                  <div className="erd-rel-chips">
                    {outgoing.map((rel) => (
                      <button
                        key={`out-${rel.columnId}`}
                        type="button"
                        className="erd-rel-chip erd-rel-out"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFocusTable?.(rel.refTableId);
                        }}
                        title={`${rel.columnName} → ${rel.refLabel}`}
                      >
                        {rel.columnName} → {rel.refLabel}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {incomingRefs.length > 0 && (
                <div className="erd-rel-group">
                  <span className="erd-rel-label">Referenced by</span>
                  <div className="erd-rel-chips">
                    {incomingRefs.map((rel) => (
                      <button
                        key={`in-${rel.fromTableId}-${rel.fromColumnId}`}
                        type="button"
                        className="erd-rel-chip erd-rel-in"
                        onClick={(e) => {
                          e.stopPropagation();
                          onFocusTable?.(rel.fromTableId);
                        }}
                        title={`${rel.fromTableName}.${rel.fromColumnName}`}
                      >
                        {rel.fromTableName}.{rel.fromColumnName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </footer>
          )}
      </div>

      <div className="card-features-footer erd-section-footer">
        <button
          type="button"
          className="btn-features-toggle"
          onClick={() => onToggleFeatures(table.id)}
          aria-expanded={expandedFeatureCardIds.includes(table.id)}
        >
          <span className="erd-section-label">Linked features</span>
          <div className="erd-section-content">
            {expandedFeatureCardIds.includes(table.id) ? (
              loadingTableFeatures[table.id] ? (
                <LoadingSpinner label="Loading features..." />
              ) : tableCardFeatures[table.id]?.length > 0 ? (
                <div className="erd-features-badges">
                  {tableCardFeatures[table.id].map((ft) => (
                    <span
                      key={ft.id}
                      className="card-feature-badge"
                      title={ft.feature_name}
                    >
                      {ft.feature_name}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="erd-section-empty">None linked</span>
              )
            ) : (
              <span className="erd-section-empty">Click to view</span>
            )}
          </div>
        </button>
      </div>
    </article>
  );
};

export default TableErdCard;
