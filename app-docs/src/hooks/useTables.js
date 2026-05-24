import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { generateGuid } from "../utils/guid";
import { useToast } from "../contexts/ToastContext";
import { useConfirm } from "../contexts/ConfirmContext";
import {
  prepareColumnPayload,
  prepareTablePayload,
} from "../utils/schemaValidation.js";
import {
  resolveRefColumnName,
  resolveRefTableName,
} from "../utils/columnFormat.js";
import {
  buildReferencedByIndex,
  computeSchemaStats,
} from "../utils/schemaErd.js";

const DATA_TYPE_OPTIONS = [
  "VARCHAR",
  "INTEGER",
  "DATE",
  "TIMESTAMP",
  "BOOLEAN",
  "DECIMAL",
];

function quoteIdent(v) {
  if (!v) return v;
  return v.includes(".") ? v : v.replace(/"/g, "");
}

function fkConstraintName(tableName, columnName) {
  return `fk_${tableName}_${columnName}`.replace(/\W+/g, "_").toLowerCase();
}

function generateCreateTableSql(tableName, cols, lookup = {}) {
  if (!cols || cols.length === 0) return "";
  const name = tableName || "your_table_name";
  const { tablesById = {}, columnsById = {} } = lookup;

  const columnLines = cols.map((c) => {
    const lineParts = [];
    lineParts.push(`${quoteIdent(c.column_name)}`);
    lineParts.push(c.data_type);
    if (typeof c.data_length === "number" && c.data_length > 0) {
      lineParts[lineParts.length - 1] = `${c.data_type}(${c.data_length})`;
    }
    if (c.is_nullable === false) lineParts.push("NOT NULL");
    if (c.default_value) lineParts.push(`DEFAULT ${c.default_value}`);
    if (c.is_primary) lineParts.push("PRIMARY KEY");
    return "  " + lineParts.join(" ");
  });

  const fkLines = cols
    .filter((c) => c.is_foreign && c.references_table && c.references_column)
    .map((c) => {
      const refTable = resolveRefTableName(c.references_table, tablesById);
      const refCol = resolveRefColumnName(c.references_column, columnsById);
      const constraint = fkConstraintName(name, c.column_name);
      return `  CONSTRAINT ${constraint} FOREIGN KEY (${quoteIdent(c.column_name)}) REFERENCES ${quoteIdent(refTable)} (${quoteIdent(refCol)})`;
    });

  const parts = [...columnLines, ...fkLines];

  return `CREATE TABLE IF NOT EXISTS ${quoteIdent(name)} (\n${parts.join(",\n")}\n);`;
}

const useTables = () => {
  const { success, error, warning } = useToast();
  const { confirm } = useConfirm();

  const [isBusy, setIsBusy] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [formData, setFormData] = useState({});
  const [isSideBar, setIsSideBar] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [submoduleFilter, setSubmoduleFilter] = useState("");
  const [featureFilter, setFeatureFilter] = useState("");
  const [featuresList, setFeaturesList] = useState([]);
  const [featureFilterTableIds, setFeatureFilterTableIds] = useState(null);
  const [loadingFeatureFilter, setLoadingFeatureFilter] = useState(false);
  const [expandedCardIds, setExpandedCardIds] = useState([]);
  const [cardColumns, setCardColumns] = useState({});
  const [loadingColumns, setLoadingColumns] = useState({});
  const [highlightTableId, setHighlightTableId] = useState(null);
  const [expandedFeatureCardIds, setExpandedFeatureCardIds] = useState([]);
  const [tableCardFeatures, setTableCardFeatures] = useState({});
  const [loadingTableFeatures, setLoadingTableFeatures] = useState({});

  const [columnList, setColumnList] = useState([]);
  const [formDataColumn, setFormDataColumn] = useState({});
  const [createTableSql, setCreateTableSql] = useState("");
  const [copied, setCopied] = useState(false);
  const [sqlPreview, setSqlPreview] = useState(null);

  const sortFeatures = (a, b) => {
    const serialA = Number(a.serial_number) || 0;
    const serialB = Number(b.serial_number) || 0;
    if (serialA !== serialB) return serialA - serialB;
    return String(a.feature_name || "").localeCompare(
      String(b.feature_name || ""),
    );
  };

  const projectOptions = useMemo(
    () =>
      featuresList
        .filter((f) => f.feature_type === "project")
        .sort(sortFeatures),
    [featuresList],
  );

  const moduleOptions = useMemo(() => {
    if (!projectFilter) return [];
    return featuresList
      .filter(
        (f) => f.feature_type === "module" && f.feature_id === projectFilter,
      )
      .sort(sortFeatures);
  }, [featuresList, projectFilter]);

  const submoduleOptions = useMemo(() => {
    if (!moduleFilter) return [];
    return featuresList
      .filter(
        (f) => f.feature_type === "submodule" && f.feature_id === moduleFilter,
      )
      .sort(sortFeatures);
  }, [featuresList, moduleFilter]);

  const featureOptions = useMemo(() => {
    if (!submoduleFilter) return [];
    return featuresList
      .filter(
        (f) => f.feature_type === "feature" && f.feature_id === submoduleFilter,
      )
      .sort(sortFeatures);
  }, [featuresList, submoduleFilter]);

  const hasFeatureScopeFilter = Boolean(
    projectFilter || moduleFilter || submoduleFilter || featureFilter,
  );

  const filteredTables = useMemo(() => {
    let list = dataList;

    if (hasFeatureScopeFilter) {
      if (featureFilterTableIds === null) {
        return [];
      }
      list = list.filter((table) => featureFilterTableIds.has(table.id));
    }

    const q = searchQuery.trim().toLowerCase();
    if (!q) return list;

    return list.filter((table) => {
      const name = String(table.table_name || "").toLowerCase();
      const desc = String(table.table_description || "").toLowerCase();
      const serial = String(table.serial_number ?? "");
      return name.includes(q) || desc.includes(q) || serial.includes(q);
    });
  }, [dataList, searchQuery, featureFilterTableIds, hasFeatureScopeFilter]);

  const hasActiveFilters = Boolean(
    searchQuery.trim() || hasFeatureScopeFilter,
  );

  const tablesById = useMemo(
    () => Object.fromEntries(dataList.map((t) => [t.id, t])),
    [dataList],
  );

  const columnsById = useMemo(() => {
    const map = {};
    for (const cols of Object.values(cardColumns)) {
      for (const c of cols || []) {
        map[c.id] = c;
      }
    }
    for (const c of columnList || []) {
      map[c.id] = c;
    }
    return map;
  }, [cardColumns, columnList]);

  const fkLookup = useMemo(
    () => ({ tablesById, columnsById }),
    [tablesById, columnsById],
  );

  const referencedByIndex = useMemo(
    () => buildReferencedByIndex(cardColumns, tablesById),
    [cardColumns, tablesById],
  );

  const schemaStats = useMemo(
    () => computeSchemaStats(filteredTables, cardColumns),
    [filteredTables, cardColumns],
  );

  const fetchColumnsForTable = async (tableId) => {
    const resp = await apiRequest("api/columns/get-by-table", {
      body: { table_id: tableId },
    });
    return resp.data || [];
  };

  const handleGetAll = async () => {
    try {
      const resp = await apiRequest("api/tables/get-all", { body: {} });
      setDataList(resp.data);
    } catch (err) {
      error("Error loading tables");
    }
  };

  useEffect(() => {
    handleGetAll();
  }, []);

  useEffect(() => {
    const loadFeatures = async () => {
      try {
        const resp = await apiRequest("api/features/get-all", { body: {} });
        setFeaturesList(resp.data || []);
      } catch {
        error("Error loading feature filters");
      }
    };
    loadFeatures();
  }, []);

  useEffect(() => {
    if (!hasFeatureScopeFilter) {
      setFeatureFilterTableIds(null);
      return;
    }

    let cancelled = false;
    setFeatureFilterTableIds(null);
    setLoadingFeatureFilter(true);

    const loadFilteredTableIds = async () => {
      try {
        const resp = await apiRequest(
          "api/feature-table/get-table-ids-by-feature-filter",
          {
            body: {
              project_id: projectFilter || undefined,
              module_id: moduleFilter || undefined,
              submodule_id: submoduleFilter || undefined,
              feature_id: featureFilter || undefined,
            },
          },
        );
        if (!cancelled) {
          setFeatureFilterTableIds(new Set(resp.data || []));
        }
      } catch {
        if (!cancelled) {
          error("Error filtering tables by feature");
          setFeatureFilterTableIds(new Set());
        }
      } finally {
        if (!cancelled) {
          setLoadingFeatureFilter(false);
        }
      }
    };

    loadFilteredTableIds();
    return () => {
      cancelled = true;
    };
  }, [
    projectFilter,
    moduleFilter,
    submoduleFilter,
    featureFilter,
    hasFeatureScopeFilter,
  ]);

  const handleRowClick = (data) => {
    setFormData(data);
    setIsSideBar(true);
  };

  const handleCloseSidebar = () => {
    setFormData({});
    setIsSideBar(false);
  };

  const handleDelete = async (id) => {
    const ok = await confirm("Are you sure you want to delete this table?");
    if (ok) {
      setIsBusy(true);
      try {
        await apiRequest("api/tables/delete", { body: { id: id } });
        success("Table deleted");
        handleGetAll();
        handleCloseSidebar();
      } catch (err) {
        error("Error deleting table");
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleSave = async (data) => {
    const prepared = prepareTablePayload(data);
    if (prepared.error) {
      warning(prepared.error);
      return;
    }

    const { payload } = prepared;

    setIsBusy(true);
    try {
      if (payload.id) {
        await apiRequest("api/tables/edit", { body: payload });
        success("Table updated");
      } else {
        await apiRequest("api/tables/add", {
          body: { ...payload, id: generateGuid() },
        });
        success("Table created");
      }
      handleGetAll();
      handleCloseSidebar();
    } catch (err) {
      error("Error saving table");
    } finally {
      setIsBusy(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNew = () => {
    setFormData({
      id: "",
      table_name: "",
      table_description: "",
      serial_number: "",
    });
    setIsSideBar(true);
  };

  const handleSaveClick = () => {
    handleSave(formData);
  };

  const handleDeleteClick = () => {
    if (formData.id) {
      handleDelete(formData.id);
    }
  };

  useEffect(() => {
    if (formData.id && isSideBar) {
      handleGetColumnsByTable(formData.id);
    } else {
      setColumnList([]);
      setFormDataColumn({});
    }
  }, [formData.id, isSideBar]);

  useEffect(() => {
    if (columnList) {
      const cols = Array.isArray(columnList) ? columnList : [];
      setCreateTableSql(
        generateCreateTableSql(formData.table_name, cols, fkLookup),
      );
    }
  }, [columnList, formData.table_name, fkLookup]);

  useEffect(() => {
    if (!formData.id || !columnList) return;
    if (expandedCardIds.includes(formData.id)) {
      setCardColumns((prev) => ({
        ...prev,
        [formData.id]: columnList,
      }));
    }
  }, [columnList, formData.id, expandedCardIds]);

  const handleGetColumnsByTable = async (table_id) => {
    try {
      const cols = await fetchColumnsForTable(table_id);
      setColumnList(cols);
    } catch (err) {
      error("Error fetching columns");
    }
  };

  const handleInputChangeColumn = (name, value) => {
    if (name === "clear") {
      setFormDataColumn({});
      return;
    }

    setFormDataColumn((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditColumn = (column) => {
    setFormDataColumn({
      ...column,
      is_nullable: column.is_nullable ?? true,
      is_primary: column.is_primary ?? false,
      is_foreign: column.is_foreign ?? false,
    });
  };

  const suggestCopyColumnName = (baseName) => {
    const root = (baseName || "column").trim() || "column";
    const existing = new Set(
      columnList.map((c) => String(c.column_name || "").toLowerCase()),
    );
    let candidate = `${root}_copy`;
    let n = 2;
    while (existing.has(candidate.toLowerCase())) {
      candidate = `${root}_copy${n}`;
      n += 1;
    }
    return candidate;
  };

  const handleCopyColumn = (column) => {
    const maxSerial = columnList.reduce(
      (max, c) => Math.max(max, Number(c.serial_number) || 0),
      0,
    );
    const nextSerial =
      column.serial_number != null && column.serial_number !== ""
        ? Number(column.serial_number) + 1
        : maxSerial + 1;

    const { id: _id, table_id: _tableId, ...rest } = column;
    setFormDataColumn({
      ...rest,
      id: "",
      column_name: suggestCopyColumnName(column.column_name),
      serial_number: nextSerial,
      is_nullable: column.is_nullable ?? true,
      is_primary: false,
      is_foreign: column.is_foreign ?? false,
    });
  };

  const handleSaveColumn = async (data) => {
    const prepared = prepareColumnPayload(data, formData.id);
    if (prepared.error) {
      warning(prepared.error);
      return;
    }

    const { payload } = prepared;

    setIsBusy(true);
    try {
      if (payload.id) {
        await apiRequest("api/columns/edit", { body: payload });
        success("Column updated");
      } else {
        await apiRequest("api/columns/add", {
          body: { ...payload, id: generateGuid() },
        });
        success("Column created");
      }

      setFormDataColumn({});
      await handleGetColumnsByTable(formData.id);
    } catch (err) {
      error("Error saving column");
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveColumnClick = () => {
    handleSaveColumn(formDataColumn);
  };

  const handleDeleteColumn = async (columnId) => {
    const ok = await confirm("Are you sure you want to delete this column?");
    if (ok) {
      setIsBusy(true);
      try {
        await apiRequest("api/columns/delete", { body: { id: columnId } });
        success("Column deleted");
        await handleGetColumnsByTable(formData.id);
        setFormDataColumn((prev) => (prev.id === columnId ? {} : prev));
      } catch (err) {
        error("Error deleting column");
      } finally {
        setIsBusy(false);
      }
    }
  };

  const handleCopySql = () => {
    if (createTableSql) {
      navigator.clipboard.writeText(createTableSql).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handleViewSql = async (table) => {
    setSqlPreview({
      tableName: table.table_name,
      sql: "",
      loading: true,
    });

    let cols = cardColumns[table.id];
    if (!(table.id in cardColumns)) {
      try {
        cols = await fetchColumnsForTable(table.id);
        setCardColumns((prev) => ({
          ...prev,
          [table.id]: cols,
        }));
      } catch (err) {
        error("Error fetching columns for SQL preview");
        setSqlPreview(null);
        return;
      }
    }

    setSqlPreview({
      tableName: table.table_name,
      sql: generateCreateTableSql(table.table_name, cols, fkLookup),
      loading: false,
    });
  };

  const handleCloseSqlPreview = () => {
    setSqlPreview(null);
    setCopied(false);
  };

  const handleCopySqlPreview = () => {
    if (sqlPreview?.sql) {
      navigator.clipboard.writeText(sqlPreview.sql).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const loadColumnsForCard = async (tableId) => {
    if (tableId in cardColumns || loadingColumns[tableId]) return;

    setLoadingColumns((prev) => ({ ...prev, [tableId]: true }));
    try {
      const cols = await fetchColumnsForTable(tableId);
      setCardColumns((prev) => ({ ...prev, [tableId]: cols }));
    } catch {
      error("Error loading columns");
      setCardColumns((prev) => ({ ...prev, [tableId]: [] }));
    } finally {
      setLoadingColumns((prev) => ({ ...prev, [tableId]: false }));
    }
  };

  const handleFocusTable = async (tableId) => {
    if (!tableId) return;

    if (!expandedCardIds.includes(tableId)) {
      setExpandedCardIds((prev) => [...prev, tableId]);
      await loadColumnsForCard(tableId);
    }

    setHighlightTableId(tableId);
    requestAnimationFrame(() => {
      document
        .getElementById(`erd-entity-${tableId}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
    window.setTimeout(() => setHighlightTableId(null), 2200);
  };

  const handleToggleColumns = async (tableId) => {
    if (expandedCardIds.includes(tableId)) {
      setExpandedCardIds((prev) => prev.filter((id) => id !== tableId));
      return;
    }

    setExpandedCardIds((prev) => [...prev, tableId]);
    await loadColumnsForCard(tableId);
  };

  const handleToggleFeatures = async (tableId) => {
    if (expandedFeatureCardIds.includes(tableId)) {
      setExpandedFeatureCardIds((prev) => prev.filter((id) => id !== tableId));
      return;
    }

    setExpandedFeatureCardIds((prev) => [...prev, tableId]);

    if (!tableCardFeatures[tableId]) {
      setLoadingTableFeatures((prev) => ({ ...prev, [tableId]: true }));
      try {
        const resp = await apiRequest("api/feature-table/get-by-table", {
          body: { table_id: tableId },
        });
        setTableCardFeatures((prev) => ({
          ...prev,
          [tableId]: resp.data || [],
        }));
      } catch (err) {
        error("Error fetching features for table");
        setTableCardFeatures((prev) => ({
          ...prev,
          [tableId]: [],
        }));
      } finally {
        setLoadingTableFeatures((prev) => ({ ...prev, [tableId]: false }));
      }
    }
  };

  const handleProjectFilterChange = (value) => {
    setProjectFilter(value);
    setModuleFilter("");
    setSubmoduleFilter("");
    setFeatureFilter("");
  };

  const handleModuleFilterChange = (value) => {
    setModuleFilter(value);
    setSubmoduleFilter("");
    setFeatureFilter("");
  };

  const handleSubmoduleFilterChange = (value) => {
    setSubmoduleFilter(value);
    setFeatureFilter("");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setProjectFilter("");
    setModuleFilter("");
    setSubmoduleFilter("");
    setFeatureFilter("");
  };

  return {
    isBusy,
    dataList,
    formData,
    isSideBar,
    handleInputChange,
    handleRowClick,
    handleCloseSidebar,
    handleDelete,
    handleSave,
    handleAddNew,
    handleSaveClick,
    handleDeleteClick,
    columnList,
    formDataColumn,
    handleInputChangeColumn,
    handleEditColumn,
    handleCopyColumn,
    handleSaveColumn,
    handleSaveColumnClick,
    handleDeleteColumn,
    dataTypeOptions: DATA_TYPE_OPTIONS,
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
    dataList,
  };
};

export default useTables;
