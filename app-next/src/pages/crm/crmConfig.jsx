import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const contacts = [
  { id: 'CON-001', name: 'Sarah Johnson', company: 'Acme Corp', email: 'sarah@acme.com', phone: '+1-555-1001', status: 'customer', deals: 5, lastContact: '2026-07-10' },
  { id: 'CON-002', name: 'Michael Chen', company: 'TechStart Inc', email: 'michael@techstart.io', phone: '+1-555-1002', status: 'lead', deals: 1, lastContact: '2026-07-08' },
  { id: 'CON-003', name: 'Emily Davis', company: 'DataFlow Ltd', email: 'emily@dataflow.com', phone: '+1-555-1003', status: 'customer', deals: 3, lastContact: '2026-07-11' },
  { id: 'CON-004', name: 'James Wilson', company: 'NexGen Solutions', email: 'james@nexgen.com', phone: '+1-555-1004', status: 'lead', deals: 0, lastContact: '2026-07-05' },
  { id: 'CON-005', name: 'Lisa Anderson', company: 'CloudBase Systems', email: 'lisa@cloudbase.com', phone: '+1-555-1005', status: 'customer', deals: 8, lastContact: '2026-07-12' },
];

export const opportunities = [
  { id: 'OPP-001', name: 'Enterprise Software Deal', contact: 'Sarah Johnson', company: 'Acme Corp', value: 75000, stage: 'negotiation', probability: 70, expectedClose: '2026-08-15' },
  { id: 'OPP-002', name: 'Cloud Migration Project', contact: 'Michael Chen', company: 'TechStart Inc', value: 45000, stage: 'proposal', probability: 45, expectedClose: '2026-09-01' },
  { id: 'OPP-003', name: 'Data Analytics Platform', contact: 'Emily Davis', company: 'DataFlow Ltd', value: 120000, stage: 'discovery', probability: 25, expectedClose: '2026-10-01' },
  { id: 'OPP-004', name: 'Infrastructure Upgrade', contact: 'James Wilson', company: 'NexGen Solutions', value: 95000, stage: 'qualification', probability: 15, expectedClose: '2026-11-01' },
  { id: 'OPP-005', name: 'Managed Services Contract', contact: 'Lisa Anderson', company: 'CloudBase Systems', value: 60000, stage: 'negotiation', probability: 80, expectedClose: '2026-08-01' },
];

export const contactFormFields = [
  { key: 'name', label: 'Contact Name', type: 'text', required: true },
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['customer', 'lead', 'partner'] },
];

export const opportunityFormFields = [
  { key: 'name', label: 'Opportunity Name', type: 'text', required: true },
  { key: 'contact', label: 'Contact', type: 'text', required: true },
  { key: 'company', label: 'Company', type: 'text', required: true },
  { key: 'value', label: 'Value ($)', type: 'number', required: true, min: 1 },
  { key: 'stage', label: 'Stage', type: 'select', required: true, options: ['discovery', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost'] },
  { key: 'probability', label: 'Probability (%)', type: 'number', required: true, min: 0, max: 100 },
  { key: 'expectedClose', label: 'Expected Close', type: 'date', required: true },
];

export function getContactColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Name' },
    { key: 'company', label: 'Company' }, { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'deals', label: 'Deals', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'lastContact', label: 'Last Contact' },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export function getOpportunityColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Opportunity' },
    { key: 'company', label: 'Company' },
    { key: 'value', label: 'Value', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'stage', label: 'Stage', render: (val) => <Badge variant={val}>{val.replace('_', ' ')}</Badge> },
    { key: 'probability', label: 'Prob.', render: (val) => <span style={{ fontWeight: 600, color: val > 50 ? '#059669' : '#d97706' }}>{val}%</span> },
    { key: 'expectedClose', label: 'Close Date' },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export const crmStats = () => {
  const pipeline = opportunities.reduce((s, o) => s + o.value, 0);
  const weighted = opportunities.reduce((s, o) => s + (o.value * o.probability / 100), 0);
  return [
    { title: 'Pipeline Value', value: pipeline, change: 18.5, prefix: '$', color: '#6366f1', icon: '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>' },
    { title: 'Weighted Pipeline', value: Math.round(weighted), change: 12.3, prefix: '$', color: '#8b5cf6', icon: '<path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>' },
    { title: 'Active Customers', value: contacts.filter(c => c.status === 'customer').length, change: 15.7, color: '#059669', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>' },
    { title: 'New Leads', value: contacts.filter(c => c.status === 'lead').length, change: 22.5, color: '#d97706', icon: '<path d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>' },
  ];
};

export function renderContactCard(contact, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={contact.status}>{contact.status}</Badge>
        <span className="grid-card-id">{contact.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{contact.name}</h4>
        <span className="grid-card-sub">{contact.company}</span>
        <div className="grid-card-meta" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{contact.email}</span>
          <span>{contact.deals} deals</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(contact)} onDelete={() => handleDelete(contact)} compact />
      </div>
    </div>
  );
}

export function renderOpportunityCard(opp, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={opp.stage}>{opp.stage.replace('_', ' ')}</Badge>
        <span className="grid-card-id">{opp.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{opp.name}</h4>
        <span className="grid-card-sub">{opp.company}</span>
        <div className="grid-card-meta">
          <span className="grid-card-amount">${opp.value.toLocaleString()}</span>
          <span style={{ fontWeight: 600, color: opp.probability > 50 ? '#059669' : '#d97706' }}>{opp.probability}%</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(opp)} onDelete={() => handleDelete(opp)} compact />
      </div>
    </div>
  );
}
