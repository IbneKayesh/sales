import ErpPage from '../../components/erp/ErpPage';
import { contacts, opportunities, contactFormFields, getContactColumns, crmStats, renderContactCard } from './crmConfig';

const tabs = [{ key: 'contacts', label: 'Contacts' }, { key: 'opportunities', label: 'Opportunities' }];

export default function Crm() {
  return (
    <ErpPage
      title="Contact"
      data={contacts}
      idPrefix="CON"
      tabs={tabs}
      stats={crmStats()}
      renderCard={renderContactCard}
      getColumns={(tab, handleEdit, handleDelete) => {
        if (tab === 'contacts') return getContactColumns(handleEdit, handleDelete);
        return [
          { key: 'id', label: 'ID' }, { key: 'name', label: 'Opportunity' }, { key: 'company', label: 'Company' },
          { key: 'value', label: 'Value', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
          { key: 'stage', label: 'Stage' }, { key: 'expectedClose', label: 'Close' },
        ];
      }}
      formFieldsByTab={(tab) => tab === 'contacts' ? contactFormFields : [
        { key: 'name', label: 'Name', type: 'text', required: true },
        { key: 'company', label: 'Company', type: 'text', required: true },
        { key: 'value', label: 'Value ($)', type: 'number', required: true, min: 1 },
        { key: 'stage', label: 'Stage', type: 'select', required: true, options: ['discovery', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] },
      ]}
      dataByTab={(tab) => tab === 'contacts' ? undefined : opportunities}
    />
  );
}
