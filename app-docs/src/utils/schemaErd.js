import { formatForeignKeyRef } from "./columnFormat.js";

/** PK first, then FK, then others — each group by serial_number */
export function sortColumnsErdOrder(columns = []) {
  const pk = [];
  const fk = [];
  const rest = [];

  for (const col of columns) {
    if (col.is_primary) pk.push(col);
    //else if (col.is_foreign) fk.push(col);
    else rest.push(col);
  }

  const bySerial = (a, b) => {
    const sa = Number(a.serial_number) || 0;
    const sb = Number(b.serial_number) || 0;
    if (sa !== sb) return sa - sb;
    return String(a.column_name || "").localeCompare(
      String(b.column_name || ""),
    );
  };

  pk.sort(bySerial);
  fk.sort(bySerial);
  rest.sort(bySerial);
  return [...pk, ...fk, ...rest];
}

export function getOutgoingRelationships(columns = [], fkLookup = {}) {
  return columns
    .filter((c) => c.is_foreign && c.references_table)
    .map((c) => ({
      columnId: c.id,
      columnName: c.column_name,
      refTableId: c.references_table,
      refLabel: formatForeignKeyRef(c, fkLookup) || c.references_table,
    }));
}

/** tableId -> incoming FK references from other tables */
export function buildReferencedByIndex(cardColumns = {}, tablesById = {}) {
  const index = {};

  for (const [fromTableId, cols] of Object.entries(cardColumns)) {
    const fromName = tablesById[fromTableId]?.table_name ?? fromTableId;
    for (const col of cols || []) {
      if (!col.is_foreign || !col.references_table) continue;
      const targetId = col.references_table;
      if (!index[targetId]) index[targetId] = [];
      index[targetId].push({
        fromTableId,
        fromTableName: fromName,
        fromColumnName: col.column_name,
        fromColumnId: col.id,
      });
    }
  }

  return index;
}

export function computeSchemaStats(filteredTables = [], cardColumns = {}) {
  let columnCount = 0;
  let primaryKeyCount = 0;
  let foreignKeyCount = 0;
  let relationshipCount = 0;

  for (const table of filteredTables) {
    const cols = cardColumns[table.id] || [];
    columnCount += cols.length;
    for (const col of cols) {
      if (col.is_primary) primaryKeyCount += 1;
      if (col.is_foreign) {
        foreignKeyCount += 1;
        if (col.references_table && col.references_column) {
          relationshipCount += 1;
        }
      }
    }
  }

  return {
    tableCount: filteredTables.length,
    columnCount,
    primaryKeyCount,
    foreignKeyCount,
    relationshipCount,
  };
}

export function getColumnErdRole(col) {
  if (col.is_primary && col.is_foreign) return "pk-fk";
  if (col.is_primary) return "pk";
  if (col.is_foreign) return "fk";
  return "column";
}
