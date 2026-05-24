import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import ColumnChipRows from "./ColumnChipRows";
import { SqlViewButton } from "./SqlPreviewModal";
import { formatColumnTooltip } from "../utils/columnFormat.js";
import {
  getOutgoingRelationships,
  sortColumnsErdOrder,
} from "../utils/schemaErd.js";

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
  const [showColumnMeta, setShowColumnMeta] = useState(false);

  useEffect(() => {
    if (!isColumnsExpanded) {
      setShowColumnMeta(false);
    }
  }, [isColumnsExpanded]);

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
      className={`erd-entity table-card${highlighted ? " erd-entity-highlight" : ""}${showColumnMeta ? " erd-entity-meta-visible" : ""}`}
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
                  title={
                    showColumnMeta
                      ? "Click to hide type and keys"
                      : "Click to show type, length, and keys"
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    if (e.target.closest(".erd-fk-link")) return;
                    setShowColumnMeta((prev) => !prev);
                  }}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" && e.key !== " ") return;
                    e.stopPropagation();
                    if (e.target.closest(".erd-fk-link")) return;
                    e.preventDefault();
                    setShowColumnMeta((prev) => !prev);
                  }}
                  tabIndex={0}
                >
                  {!showColumnMeta && (
                    <p className="erd-columns-meta-hint">
                      Click list to show type and keys under name / description
                    </p>
                  )}
                  {sortedColumns.map((col) => (
                      <div
                        key={col.id}
                        className="erd-column-block"
                        title={formatColumnTooltip(col, fkLookup)}
                      >
                        <ColumnChipRows
                          column={col}
                          fkLookup={fkLookup}
                          showMeta={showColumnMeta}
                          onFkNavigate={onFocusTable}
                          fkLinkAsButton
                        />
                      </div>
                  ))}
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
