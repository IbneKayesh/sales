import createDataHook from './createDataHook';

const INITIAL_CONTACTS = [
  { id: 'CON-001', name: 'Acme Corp', contact: 'John Doe', email: 'john@acme.com', stage: 'Customer', value: '$12,000', deals: 3, createdAt: '2026-06-01T08:00:00.000Z' },
  { id: 'CON-002', name: 'Globex Inc', contact: 'Jane Roe', email: 'jane@globex.com', stage: 'Lead', value: '$3,000', deals: 1, createdAt: '2026-06-05T10:30:00.000Z' },
  { id: 'CON-003', name: 'Initech LLC', contact: 'Samir N.', email: 'samir@initech.com', stage: 'Prospect', value: '$5,500', deals: 0, createdAt: '2026-06-10T12:15:00.000Z' },
  { id: 'CON-004', name: 'Umbrella Corp', contact: 'Alice W.', email: 'alice@umbrella.com', stage: 'Customer', value: '$8,900', deals: 2, createdAt: '2026-06-15T14:45:00.000Z' },
  { id: 'CON-005', name: 'Stark Industries', contact: 'Tony S.', email: 'tony@stark.com', stage: 'Lead', value: '$15,000', deals: 0, createdAt: '2026-06-20T09:00:00.000Z' },
  { id: 'CON-006', name: 'Wayne Enterprises', contact: 'Bruce W.', email: 'bruce@wayne.com', stage: 'Prospect', value: '$22,000', deals: 0, createdAt: '2026-06-25T16:20:00.000Z' },
];

const useCRM = createDataHook({
  key: 'crm_data',
  initialData: INITIAL_CONTACTS,
  dataKey: 'contacts',
  idFn: (items) => `CON-${String(items.length + 1).padStart(3, '0')}`,
  onCreate: (input) => ({ ...input, deals: 0 }),
});

export default useCRM;
