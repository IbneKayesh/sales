import { Button } from "primereact/button";

/**
 * CSVExport — downloads the provided data as a CSV file.
 *
 * Props:
 *  data     {Array}   - Array of objects to export (required)
 *  fileName {string}  - Output file name (default: "export-data"); .csv is always appended
 *  columns  {Array}   - Optional column config: [{ header: string, accessor: string | fn }]
 *                       When omitted, all keys of the first data object are used as headers.
 */
const CSVExport = ({ data = [], fileName = "export-data", columns = [] }) => {
  /** Map raw data rows → plain objects using the column config (or pass through as-is). */
  const formatData = () => {
    if (!data.length) return [];

    if (columns.length) {
      return data.map((item) => {
        const row = {};
        columns.forEach((col) => {
          row[col.header] =
            typeof col.accessor === "function"
              ? col.accessor(item)
              : item[col.accessor] ?? "";
        });
        return row;
      });
    }

    // Fallback: export raw object keys
    return data;
  };

  /** Convert an array of plain objects to a CSV string. */
  const convertToCSV = (rows) => {
    if (!rows.length) return "";

    const headers = Object.keys(rows[0]);
    const csvRows = rows.map((row) =>
      headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
    );

    return [headers.join(","), ...csvRows].join("\n");
  };

  const handleExport = () => {
    const formatted = formatData();
    if (!formatted.length) return;

    const csv = convertToCSV(formatted);

    // Prepend UTF-8 BOM so Excel opens the file correctly
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Ensure the file always has a .csv extension
    const safeFileName = fileName.endsWith(".csv") ? fileName : `${fileName}.csv`;

    const link = document.createElement("a");
    link.href = url;
    link.download = safeFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Release the object URL to free memory
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      label="Export CSV"
      icon="pi pi-file-export"
      size="small"
      severity="secondary"
      outlined
      tooltip={data.length === 0 ? "No data to export" : `Export ${data.length} rows`}
      tooltipOptions={{ position: "bottom" }}
      onClick={handleExport}
      disabled={data.length === 0}
    />
  );
};

export default CSVExport;
