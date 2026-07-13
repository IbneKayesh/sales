import ErpPage from '../../components/erp/ErpPage';
import { workOrders, bomItems, mfgFormFields, getWorkOrderColumns, getBOMColumns, manufacturingStats, renderWorkOrderCard } from './manufacturingConfig';

const tabs = [{ key: 'orders', label: 'Work Orders', editable: true }, { key: 'bom', label: 'Bill of Materials' }];

export default function Manufacturing() {
  return (
    <ErpPage
      title="Work Order"
      data={workOrders}
      idPrefix="WO"
      tabs={tabs}
      stats={manufacturingStats()}
      renderCard={renderWorkOrderCard}
      getColumns={(tab, handleEdit, handleDelete) => tab === 'orders' ? getWorkOrderColumns(handleEdit, handleDelete) : getBOMColumns()}
      formFieldsByTab={(tab) => tab === 'orders' ? mfgFormFields : []}
      dataByTab={(tab) => tab === 'orders' ? undefined : bomItems}
    />
  );
}
