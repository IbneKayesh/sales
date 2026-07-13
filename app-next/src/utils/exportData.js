/**
 * Export utility — CSV and Excel-compatible export from DataTable data.
 * No external dependencies required.
 */

/**
 * Extract raw cell values from a row based on column definitions.
 * Respects `exportValue` override and falls back to `render` or raw key.
 */
function getCellValue(row, col) {
  // If column has an explicit export value function, use it
  if (col.exportValue) return col.exportValue(row[col.key], row);
  // If column has a render function, try to extract plain text from it
  if (col.render) {
    const rendered = col.render(row[col.key], row);
    // Extract text content if it's a React element or string
    if (typeof rendered === 'string') return rendered;
    if (rendered?.props?.children) {
      const children = rendered.props.children;
      if (typeof children === 'string') return children;
      if (Array.isArray(children)) return children.filter(c => typeof c === 'string').join(' ');
    }
    return String(row[col.key] ?? '');
  }
  return row[col.key] != null ? String(row[col.key]) : '';
}

/**
 * Escape a string for CSV (wrap in quotes if it contains commas, quotes, or newlines).
 */
function escapeCSV(value) {
  const str = String(value ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Export data as CSV file and trigger download.
 *
 * @param {Array} data - Array of row objects
 * @param {Array} columns - Column definitions [{ key, label, render?, exportValue? }]
 * @param {string} filename - Output filename without extension
 */
export function exportCSV(data, columns, filename = 'export') {
  if (!data || data.length === 0) return;

  // Build CSV rows
  const headerRow = columns.map(col => escapeCSV(col.label));
  const dataRows = data.map(row =>
    columns.map(col => escapeCSV(getCellValue(row, col)))
  );

  // Assemble CSV content with BOM for Excel compatibility
  const BOM = '\uFEFF';
  const csvContent = [
    headerRow.join(','),
    ...dataRows.map(r => r.join(',')),
  ].join('\n');

  // Trigger download
  downloadFile(BOM + csvContent, `${filename}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export data as an Excel-compatible HTML table (.xls).
 * Excel can open HTML tables saved as .xls natively.
 *
 * @param {Array} data - Array of row objects
 * @param {Array} columns - Column definitions [{ key, label, render?, exportValue? }]
 * @param {string} filename - Output filename without extension
 */
export function exportExcel(data, columns, filename = 'export') {
  if (!data || data.length === 0) return;

  const cellValue = (val) => {
    const str = String(val ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    // Wrap numeric-looking values to preserve formatting
    if (!isNaN(val) && val !== '' && val !== true && val !== false) {
      return str;
    }
    return str;
  };

  const rows = data.map(row => {
    const cells = columns.map(col => {
      const val = getCellValue(row, col);
      // Check if value is numeric for alignment
      const isNumeric = !isNaN(val) && val !== '' && val !== true && val !== false;
      return `        <td${isNumeric ? ' style="text-align:right;vnd.ms-excel.numberformat:#,##0"' : ''}>${cellValue(val)}</td>`;
    }).join('\n');
    return `      <tr>\n${cells}\n      </tr>`;
  }).join('\n');

  const headerCells = columns.map(col =>
    `        <th style="background:#6366f1;color:#fff;font-weight:600;padding:8px 12px;text-align:left;border:1px solid #e2e8f0">${cellValue(col.label)}</th>`
  ).join('\n');

  const html = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="UTF-8">
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
    <x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions>
  </x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
  <style>
    table { border-collapse: collapse; font-family: -apple-system, sans-serif; font-size: 12px; }
    th, td { padding: 6px 10px; border: 1px solid #cbd5e1; }
    tr:nth-child(even) td { background: #f8fafc; }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>\n${headerCells}\n      </tr>
    </thead>
    <tbody>\n${rows}\n    </tbody>
  </table>
</body>
</html>`;

  downloadFile(html, `${filename}.xls`, 'application/vnd.ms-excel');
}

/**
 * Trigger a file download in the browser.
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
