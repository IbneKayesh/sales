import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../utils/api";
import { generateGuid } from "../utils/guid";
import { useToast } from "../contexts/ToastContext";
import { useConfirm } from "../contexts/ConfirmContext";

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

function generateCreateTableSql(tableName, cols) {
  if (!cols || cols.length === 0) return "";
  const name = tableName || "your_table_name";

  const parts = cols.map((c) => {
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
  const [expandedCardIds, setExpandedCardIds] = useState([]);
  const [cardColumns, setCardColumns] = useState({});
  const [loadingColumns, setLoadingColumns] = useState({});
  const [expandedFeatureCardIds, setExpandedFeatureCardIds] = useState([]);
  const [tableCardFeatures, setTableCardFeatures] = useState({});
  const [loadingTableFeatures, setLoadingTableFeatures] = useState({});

  const [columnList, setColumnList] = useState([]);
  const [formDataColumn, setFormDataColumn] = useState({});
  const [createTableSql, setCreateTableSql] = useState("");
  const [copied, setCopied] = useState(false);
  const [sqlPreview, setSqlPreview] = useState(null);

  const filteredTables = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return dataList;

    return dataList.filter((table) => {
      const name = String(table.table_name || "").toLowerCase();
      const desc = String(table.table_description || "").toLowerCase();
      const serial = String(table.serial_number ?? "");
      return name.includes(q) || desc.includes(q) || serial.includes(q);
    });
  }, [dataList, searchQuery]);

  const hasActiveFilters = Boolean(searchQuery.trim());

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
    setIsBusy(true);
    try {
      if (data.id) {
        await apiRequest("api/tables/edit", { body: data });
        success("Table updated");
      } else {
        const reqBody = {
          ...data,
          id: generateGuid(),
        };
        await apiRequest("api/tables/add", { body: reqBody });
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
    if (!formData.table_name || formData.table_name.trim() === "") {
      warning("Please enter a table name");
      return;
    }
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
      setCreateTableSql(generateCreateTableSql(formData.table_name, cols));
    }
  }, [columnList, formData.table_name]);

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
      const resp = await apiRequest("api/columns/get-by-table", {
        body: { table_id },
      });
      setColumnList(resp.data || []);
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
    if (!formData.id) {
      warning("Please save the table before adding columns.");
      return;
    }

    setIsBusy(true);
    try {
      const columnData = {
        ...data,
        table_id: formData.id,
      };

      if (data.id) {
        await apiRequest("api/columns/edit", { body: columnData });
        success("Column updated");
      } else {
        const reqBody = {
          ...columnData,
          id: generateGuid(),
          is_nullable:
            columnData.is_nullable === undefined
              ? true
              : columnData.is_nullable,
          is_primary:
            columnData.is_primary === undefined
              ? false
              : columnData.is_primary,
          is_foreign:
            columnData.is_foreign === undefined
              ? false
              : columnData.is_foreign,
        };
        await apiRequest("api/columns/add", { body: reqBody });
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
    if (
      !formDataColumn.column_name ||
      !formDataColumn.column_name.trim()
    ) {
      warning("Please enter a column name.");
      return;
    }
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
    if (!cols) {
      try {
        const resp = await apiRequest("api/columns/get-by-table", {
          body: { table_id: table.id },
        });
        cols = resp.data || [];
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
      sql: generateCreateTableSql(table.table_name, cols),
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

  const toggleCardExpand = async (tableId) => {
    setExpandedCardIds((prev) => {
      if (prev.includes(tableId)) return prev.filter((x) => x !== tableId);
      return [...prev, tableId];
    });

    if (!cardColumns[tableId]) {
      setLoadingColumns((prev) => ({ ...prev, [tableId]: true }));
      try {
        const resp = await apiRequest("api/columns/get-by-table", {
          body: { table_id: tableId },
        });
        setCardColumns((prev) => ({
          ...prev,
          [tableId]: resp.data || [],
        }));
      } catch (err) {
        error("Error fetching columns for card");
      } finally {
        setLoadingColumns((prev) => ({ ...prev, [tableId]: false }));
      }
    }
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

  const clearSearch = () => setSearchQuery("");

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
    clearSearch,
    expandedCardIds,
    cardColumns,
    loadingColumns,
    toggleCardExpand,
    expandedFeatureCardIds,
    tableCardFeatures,
    loadingTableFeatures,
    handleToggleFeatures,
  };
};

export default useTables;
