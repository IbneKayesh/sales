export function DataTable({
  columns,
  rows,
  rowKey,
  loading = false,
  loadingText = "Loading…",
  empty = null,
  onRowClick,
  footer = null,
}) {
  if (loading) {
    return (
      <div className="loading-state">
        <span className="spinner" aria-hidden="true" />
        {loadingText}
      </div>
    );
  }

  if (!rows.length) return empty;

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key} scope="col" className={column.className}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              className={onRowClick ? "is-clickable" : undefined}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        {footer ? <tfoot>{footer}</tfoot> : null}
      </table>
    </div>
  );
}
