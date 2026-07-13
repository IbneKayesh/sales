import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

// ─── Mock Data ──────────────────────────────────────────

export const employees = [
  { id: 'EMP-001', name: 'Alice Johnson', department: 'Engineering', position: 'Senior Developer', email: 'alice@company.com', phone: '+1-555-0101', salary: 95000, status: 'active', joined: '2024-03-15' },
  { id: 'EMP-002', name: 'Bob Smith', department: 'Marketing', position: 'Marketing Manager', email: 'bob@company.com', phone: '+1-555-0102', salary: 78000, status: 'active', joined: '2023-11-01' },
  { id: 'EMP-003', name: 'Carol Davis', department: 'Sales', position: 'Sales Rep', email: 'carol@company.com', phone: '+1-555-0103', salary: 62000, status: 'active', joined: '2024-06-01' },
  { id: 'EMP-004', name: 'Daniel Lee', department: 'Engineering', position: 'DevOps Engineer', email: 'daniel@company.com', phone: '+1-555-0104', salary: 88000, status: 'on_leave', joined: '2023-08-20' },
  { id: 'EMP-005', name: 'Eva Martinez', department: 'HR', position: 'HR Coordinator', email: 'eva@company.com', phone: '+1-555-0105', salary: 55000, status: 'active', joined: '2024-01-10' },
  { id: 'EMP-006', name: 'Frank Wilson', department: 'Finance', position: 'Accountant', email: 'frank@company.com', phone: '+1-555-0106', salary: 67000, status: 'inactive', joined: '2022-09-05' },
  { id: 'EMP-007', name: 'Grace Kim', department: 'Engineering', position: 'Frontend Developer', email: 'grace@company.com', phone: '+1-555-0107', salary: 82000, status: 'active', joined: '2024-07-01' },
  { id: 'EMP-008', name: 'Henry Brown', department: 'Operations', position: 'Operations Lead', email: 'henry@company.com', phone: '+1-555-0108', salary: 72000, status: 'active', joined: '2023-05-12' },
];

export const departments = [
  { id: 'DEPT-001', name: 'Engineering', head: 'Alice Johnson', employees: 3, budget: 500000 },
  { id: 'DEPT-002', name: 'Marketing', head: 'Bob Smith', employees: 5, budget: 300000 },
  { id: 'DEPT-003', name: 'Sales', head: 'Sarah Manager', employees: 8, budget: 400000 },
  { id: 'DEPT-004', name: 'Finance', head: 'Frank Wilson', employees: 4, budget: 250000 },
  { id: 'DEPT-005', name: 'HR', head: 'Eva Martinez', employees: 2, budget: 150000 },
  { id: 'DEPT-006', name: 'Operations', head: 'Henry Brown', employees: 6, budget: 350000 },
];

// ─── Form Fields ────────────────────────────────────────

export const employeeFormFields = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'department', label: 'Department', type: 'select', required: true, options: departments.map(d => d.name) },
  { key: 'position', label: 'Position', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'phone', label: 'Phone', type: 'text' },
  { key: 'salary', label: 'Salary ($)', type: 'number', required: true, min: 1 },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'on_leave', 'inactive'] },
  { key: 'joined', label: 'Join Date', type: 'date', required: true },
];

// ─── Table Columns ──────────────────────────────────────

export function getEmployeeColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'department', label: 'Department' },
    { key: 'position', label: 'Position' },
    { key: 'email', label: 'Email' },
    { key: 'salary', label: 'Salary', render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span> },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val.replace('_', ' ')}</Badge> },
    { key: 'joined', label: 'Joined' },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

// ─── Stats ──────────────────────────────────────────────

export const hrStats = () => [
  { title: 'Total Employees', value: employees.length, change: 12.5, color: '#6366f1', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { title: 'Active', value: employees.filter(e => e.status === 'active').length, change: 8.2, color: '#059669', icon: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>' },
  { title: 'On Leave', value: employees.filter(e => e.status === 'on_leave').length, change: -2.1, color: '#d97706', icon: '<path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>' },
  { title: 'Departments', value: departments.length, change: 0, color: '#a855f7', icon: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
];

// ─── Card Renderer ──────────────────────────────────────

export function renderEmployeeCard(emp, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={emp.status}>{emp.status.replace('_', ' ')}</Badge>
        <span className="grid-card-id">{emp.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{emp.name}</h4>
        <span className="grid-card-sub">{emp.position}</span>
        <div className="grid-card-meta">
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{emp.department}</span>
          <span className="grid-card-amount">${emp.salary.toLocaleString()}</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(emp)} onDelete={() => handleDelete(emp)} compact />
      </div>
    </div>
  );
}
