import Badge from '../../components/ui/Badge';
import ErpPage from '../../components/erp/ErpPage';
import { accounts, journalEntries, invoices, invoiceFormFields, accountingStats, renderInvoiceCard } from './accountingConfig';

const tabs = [
  { key: 'accounts', label: 'Chart of Accounts' },
  { key: 'journal', label: 'Journal' },
  { key: 'invoices', label: 'Invoices', editable: true },
];

export default function Accounting() {
  return (
    <ErpPage
      title="Invoice"
      data={invoices}
      idPrefix="INV"
      onTransformNew={(data, id) => ({ id, ...data, date: new Date().toISOString().slice(0, 10) })}
      tabs={tabs}
      stats={accountingStats()}
      renderCard={renderInvoiceCard}
      getColumns={(tab, handleEdit, handleDelete) => {
        if (tab === 'accounts') return [
          { key: 'code', label: 'Code' }, { key: 'name', label: 'Account Name' },
          { key: 'type', label: 'Type', render: (val) => <Badge variant={val}>{val}</Badge> },
          { key: 'balance', label: 'Balance', render: (val) => <span style={{ fontWeight: 600 }}>${Math.abs(val).toLocaleString()}</span> },
        ];
        if (tab === 'journal') return [
          { key: 'id', label: 'JE #' }, { key: 'date', label: 'Date' }, { key: 'description', label: 'Description' },
          { key: 'account', label: 'Account' },
          { key: 'debit', label: 'Debit', render: (val) => val > 0 ? <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> : '—' },
          { key: 'credit', label: 'Credit', render: (val) => val > 0 ? <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> : '—' },
          { key: 'reference', label: 'Reference' },
        ];
        return [
          { key: 'id', label: 'Invoice #' }, { key: 'customer', label: 'Customer' },
          { key: 'amount', label: 'Amount', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
          { key: 'dueDate', label: 'Due Date' },
          { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
          { key: 'actions', label: '', sortable: false, render: (_, row) => (
            <div className="action-btns">
              <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); handleEdit(row); }}>Edit</button>
              <button className="action-btn delete" onClick={(e) => { e.stopPropagation(); handleDelete(row); }}>Delete</button>
            </div>
          )},
        ];
      }}
      formFieldsByTab={(tab) => tab === 'invoices' ? invoiceFormFields : []}
      dataByTab={(tab) => tab === 'accounts' ? accounts : tab === 'journal' ? journalEntries : undefined}
    />
  );
}
