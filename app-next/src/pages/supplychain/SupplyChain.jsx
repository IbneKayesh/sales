import ErpPage from '../../components/erp/ErpPage';
import { suppliers as initSuppliers, rfqs, supplierFormFields, rfqFormFields, getSupplierColumns, getRFQColumns, supplyChainStats, renderSupplierCard } from './supplyChainConfig';

const tabs = [{ key: 'suppliers', label: 'Suppliers', editable: true }, { key: 'rfqs', label: 'RFQs' }];

export default function SupplyChain() {
  return (
    <ErpPage
      title="Supplier"
      data={initSuppliers}
      idPrefix="SUP"
      tabs={tabs}
      renderCard={renderSupplierCard}
      getColumns={(tab, handleEdit, handleDelete) => tab === 'suppliers' ? getSupplierColumns(handleEdit, handleDelete) : getRFQColumns(handleEdit, handleDelete)}
      formFieldsByTab={(tab) => tab === 'suppliers' ? supplierFormFields : rfqFormFields}
      dataByTab={(tab) => tab === 'suppliers' ? undefined : rfqs}
      stats={supplyChainStats().stats}
      onTransformNew={(data, id) => ({ id, ...data, orders: 0, rating: 0 })}
    />
  );
}
