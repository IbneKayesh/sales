/**
 * Export utility for reports: CSV download and PDF print
 */

/**
 * Download data as a CSV file
 * @param {Array<Object>} data - Array of row objects
 * @param {Array<{key: string, label: string, format?: (val: any) => string}>} columns - Column definitions
 * @param {string} filename - Output filename
 */
export function exportToCSV(data, columns, filename = "export.csv") {
  if (!data || !data.length || !columns || !columns.length) {
    console.warn("No data to export");
    return;
  }

  // Build header row
  const headers = columns.map((col) => {
    const label = col.label || col.header || col.key || "";
    return `"${String(label).replace(/"/g, '""')}"`;
  });

  // Build data rows
  const rows = data.map((row) =>
    columns.map((col) => {
      let val;
      if (col.accessor) {
        val = row[col.accessor];
      } else if (col.key) {
        val = row[col.key];
      } else if (col.getValue) {
        val = col.getValue(row);
      } else {
        val = "";
      }
      // Apply formatter if provided
      if (col.format && val != null) {
        val = col.format(val);
      }
      const str = val != null ? String(val) : "";
      return `"${str.replace(/"/g, '""')}"`;
    })
  );

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  // Add BOM for proper Excel UTF-8 support
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Print the report content using window.print()
 * Hides non-report elements during print via CSS class
 * @param {string} title - Report title for print header
 * @param {string} [target] - Optional print target: "journal" | "invoice" | "" (default: generic report)
 *   When set, only the matching document (e.g. .journal-print-area / .invoice-print-area)
 *   is printed and the others are hidden via the body[data-print-target] CSS rule.
 */
export function printReport(title = "Financial Report", target = "") {
  // Set the print title
  document.title = title;

  // Add title to the targeted print area for CSS to use
  const printArea = document.querySelector(
    target ? `.${target}-print-area` : ".report-print-area",
  );
  if (printArea) {
    printArea.setAttribute("data-report-title", title);
  }

  // Scope the print to a specific document when a target is provided
  const prevTarget = document.body.getAttribute("data-print-target");
  if (target) {
    document.body.setAttribute("data-print-target", target);
  }

  // Trigger print
  window.print();

  // Cleanup - remove the data attributes
  if (printArea && printArea.hasAttribute("data-report-title")) {
    printArea.removeAttribute("data-report-title");
  }
  if (target) {
    if (prevTarget) {
      document.body.setAttribute("data-print-target", prevTarget);
    } else {
      document.body.removeAttribute("data-print-target");
    }
  }
}

/**
 * Build column definitions for exporting table-like data
 * @param {Array<string>} keys - Object keys / column accessors
 * @param {Array<string>} labels - Display labels
 * @returns {Array<{key: string, label: string}>}
 */
export function buildColumns(keys, labels) {
  return keys.map((key, i) => ({
    key,
    label: labels[i] || key,
  }));
}
