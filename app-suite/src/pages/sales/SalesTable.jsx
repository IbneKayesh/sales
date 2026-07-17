
import { fmtCurrency, fmtDate } from '@/utils/dataFormat';
import { IconEdit, IconDelete } from '@/assets/icons';
import DataTable from '../../components/DataTable/DataTable';
import './SalesTable.css';
const SalesTable = ({ sales, onEdit, onDelete, deletingId }) => {
  const columns = [
    {
      key: 'customerName',
      label: 'Customer',
      sortable: true,
      render: (val) => <span className="customerName">{val}</span>,
    },
    {
      key: 'product',
      label: 'Product',
      sortable: true,
    },
    {
      key: 'quantity',
      label: 'Qty',
      align: 'right',
      sortable: true,
    },
    {
      key: 'unitPrice',
      label: 'Unit Price',
      align: 'right',
      sortable: true,
      render: (val) => fmtCurrency(val),
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right',
      sortable: true,
      render: (val) => <span className="total">{fmtCurrency(val)}</span>,
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (val) => <span className="muted">{fmtDate(val)}</span>,
    },
    {
      key: 'actions',
      label: '',
      width: 80,
      render: (_, row) => (
        <div className="actionsCell">
          <button className="editBtn" onClick={() => onEdit(row.id)} aria-label="Edit sale">
            <IconEdit />
          </button>
          <button
            className="deleteBtn"
            onClick={() => onDelete(row.id, row.customerName)}
            disabled={deletingId === row.id}
            aria-label="Delete sale"
          >
            {deletingId === row.id ? (
              <span className="deleteSpinner" />
            ) : (
              <IconDelete />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={sales}
      keyField="id"
      sortable
      paginated
      pageSize={15}
    />
  );
};

export default SalesTable;
