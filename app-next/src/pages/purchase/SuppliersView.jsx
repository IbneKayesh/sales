import DataTable from '../../components/ui/DataTable';
import { supplierColumns } from './purchaseConfig';

export default function SuppliersView({ suppliers }) {
  return (
    <DataTable
      columns={supplierColumns}
      data={suppliers}
      searchable
      searchPlaceholder="Search suppliers..."
    />
  );
}
