import DataTable from '../../components/ui/DataTable';
import { invoiceColumns } from './salesConfig';

export default function InvoicesView({ invoices }) {
  return (
    <DataTable
      columns={invoiceColumns}
      data={invoices}
      searchable
      searchPlaceholder="Search invoices..."
    />
  );
}
