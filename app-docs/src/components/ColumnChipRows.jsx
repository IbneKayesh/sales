import {
  formatColumnType,
  formatForeignKeyRef,
  formatForeignKeyTitle,
} from "../utils/columnFormat.js";

import {
  getColumnErdRole,
} from "../utils/schemaErd.js";

const ColumnChipMeta = ({ column, fkLookup, onFkNavigate, fkLinkAsButton }) => {
  const fkRef = formatForeignKeyRef(column, fkLookup);

  return (
    <div className="card-col-chip-meta">
      <code className="card-col-type" title={formatColumnType(column)}>
        {column.data_type || "—"}
      </code>
      {column.data_length != null && column.data_length !== "" && (
        <span className="card-col-len" title="Length">
          len:{column.data_length}
        </span>
      )}
      {column.is_nullable === false && (
        <span className="flag flag-nn" title="Not Null">
          NN
        </span>
      )}
      {column.default_value && (
        <span
          className="card-col-default"
          title={`Default: ${column.default_value}`}
        >
          ={column.default_value}
        </span>
      )}
      {column.is_primary && (
        <span className="flag flag-pk" title="Primary Key">
          PK
        </span>
      )}
      {column.is_foreign && (
        <span
          className="flag flag-fk"
          title={formatForeignKeyTitle(column, fkLookup)}
        >
          FK
          {fkRef &&
            (fkLinkAsButton && onFkNavigate ? (
              <button
                type="button"
                className="erd-fk-link"
                onClick={(e) => {
                  e.stopPropagation();
                  onFkNavigate(column.references_table);
                }}
                title={`Go to ${fkRef}`}
              >
                → {fkRef}
              </button>
            ) : (
              <span className="fk-ref">→ {fkRef}</span>
            ))}
        </span>
      )}
    </div>
  );
};


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

/**
 * Plain table row: Sl | Name | Description
 * Meta (optional) spans Name + Description inside the same row block.
 */
const ColumnChipRows = ({
  column,
  fkLookup = {},
  showMeta = true,
  onFkNavigate,
  fkLinkAsButton = false,
}) => {
  const description = column.column_description?.trim() || "";
 const role = getColumnErdRole(column);
  return (
    <div
      className={`card-col-fields-table${showMeta ? " card-col-fields-table--meta" : ""}`}
    >
      <span
        className="card-col-field card-col-field-sl"
        title={`Serial ${column.serial_number ?? "—"}`}
      >
        <KeyIcon role={role} />
        <span className="card-col-num">{column.serial_number ?? "·"}</span>
      </span>
      <span className="card-col-field card-col-field-name" title={column.column_name}>
        <span className="card-col-name">{column.column_name}</span>
      </span>
      <span
        className={`card-col-field card-col-field-desc${
          !description ? " card-col-field-desc-empty" : ""
        }`}
        title={description || undefined}
      >
        <span
          className={`card-col-desc${!description ? " card-col-desc-empty" : ""}`}
        >
          {description || "No description."}
        </span>
      </span>
      {showMeta && (
        <div className="card-col-field card-col-field-meta">
          <ColumnChipMeta
            column={column}
            fkLookup={fkLookup}
            onFkNavigate={onFkNavigate}
            fkLinkAsButton={fkLinkAsButton}
          />
        </div>
      )}
    </div>
  );
};

export default ColumnChipRows;
