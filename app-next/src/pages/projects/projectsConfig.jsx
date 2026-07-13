import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const projects = [
  { id: 'PRJ-001', name: 'ERP Implementation', lead: 'Alice Johnson', team: 6, budget: 250000, spent: 185000, deadline: '2026-09-30', status: 'in_progress', priority: 'high' },
  { id: 'PRJ-002', name: 'Mobile App v2', lead: 'Grace Kim', team: 4, budget: 120000, spent: 45000, deadline: '2026-08-15', status: 'in_progress', priority: 'high' },
  { id: 'PRJ-003', name: 'Data Migration', lead: 'Daniel Lee', team: 3, budget: 80000, spent: 80000, deadline: '2026-07-01', status: 'completed', priority: 'medium' },
  { id: 'PRJ-004', name: 'Cloud Infrastructure', lead: 'Henry Brown', team: 5, budget: 180000, spent: 92000, deadline: '2026-10-15', status: 'planning', priority: 'medium' },
  { id: 'PRJ-005', name: 'Security Audit', lead: 'Alice Johnson', team: 2, budget: 45000, spent: 12000, deadline: '2026-08-01', status: 'in_progress', priority: 'critical' },
];

export const tasks = [
  { id: 'TSK-001', project: 'ERP Implementation', title: 'Setup database schema', assignee: 'Alice Johnson', status: 'completed', priority: 'high', deadline: '2026-07-10' },
  { id: 'TSK-002', project: 'ERP Implementation', title: 'Implement authentication', assignee: 'Grace Kim', status: 'in_progress', priority: 'high', deadline: '2026-07-20' },
  { id: 'TSK-003', project: 'ERP Implementation', title: 'Create API endpoints', assignee: 'Bob Smith', status: 'todo', priority: 'medium', deadline: '2026-07-25' },
  { id: 'TSK-004', project: 'Mobile App v2', title: 'Design new UI screens', assignee: 'Grace Kim', status: 'in_progress', priority: 'high', deadline: '2026-07-15' },
  { id: 'TSK-005', project: 'Mobile App v2', title: 'Implement push notifications', assignee: 'Daniel Lee', status: 'todo', priority: 'medium', deadline: '2026-07-30' },
  { id: 'TSK-006', project: 'Security Audit', title: 'Penetration testing', assignee: 'Alice Johnson', status: 'in_progress', priority: 'critical', deadline: '2026-07-18' },
];

export const projectFormFields = [
  { key: 'name', label: 'Project Name', type: 'text', required: true },
  { key: 'lead', label: 'Project Lead', type: 'text', required: true },
  { key: 'team', label: 'Team Size', type: 'number', required: true, min: 1 },
  { key: 'budget', label: 'Budget ($)', type: 'number', required: true, min: 1 },
  { key: 'deadline', label: 'Deadline', type: 'date', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['planning', 'in_progress', 'completed', 'on_hold'] },
  { key: 'priority', label: 'Priority', type: 'select', required: true, options: ['low', 'medium', 'high', 'critical'] },
];

export function getProjectColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Project' },
    { key: 'lead', label: 'Lead' }, { key: 'team', label: 'Team', render: (val) => <span style={{ fontWeight: 600 }}>{val}</span> },
    { key: 'budget', label: 'Budget', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'spent', label: 'Spent', render: (val) => <span style={{ color: '#d97706' }}>${val.toLocaleString()}</span> },
    { key: 'deadline', label: 'Deadline' },
    { key: 'priority', label: 'Priority', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val.replace('_', ' ')}</Badge> },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export const projectsStats = () => {
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent = projects.reduce((s, p) => s + p.spent, 0);
  return [
    { title: 'Active Projects', value: projects.filter(p => p.status === 'in_progress').length, change: 2, color: '#6366f1', icon: '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>' },
    { title: 'Total Budget', value: totalBudget, change: 8.5, prefix: '$', color: '#059669', icon: '<path d="M12 1v22M17 7H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
    { title: 'Spent', value: totalSpent, change: 5.2, prefix: '$', color: '#d97706', icon: '<path d="M17 9V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M23 13v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2z"/>' },
    { title: 'Tasks Due', value: tasks.filter(t => t.status !== 'completed').length, change: -12.3, color: '#dc2626', icon: '<path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>' },
  ];
};

export function renderProjectCard(project, handleEdit, handleDelete) {
  const pct = Math.round((project.spent / project.budget) * 100);
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={project.status}>{project.status.replace('_', ' ')}</Badge>
        <Badge variant={project.priority}>{project.priority}</Badge>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{project.name}</h4>
        <span className="grid-card-sub">Lead: {project.lead}</span>
        <div className="grid-card-meta" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{project.team} members</span>
          <span>Due: {project.deadline}</span>
        </div>
        <div className="stock-bar-wrapper" style={{ marginTop: 8 }}>
          <div className="stock-bar" style={{ width: `${pct}%`, background: pct > 90 ? '#dc2626' : pct > 70 ? '#d97706' : '#6366f1' }} />
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(project)} onDelete={() => handleDelete(project)} compact />
      </div>
    </div>
  );
}
