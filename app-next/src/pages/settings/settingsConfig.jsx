import Badge from '../../components/ui/Badge';
import ActionCell from '../../components/erp/ActionCell';

export const users = [
  { id: 'USR-001', name: 'Admin User', email: 'admin@company.com', role: 'System Manager', department: 'IT', status: 'active', lastLogin: '2026-07-12 09:15' },
  { id: 'USR-002', name: 'Sarah Manager', email: 'sarah@company.com', role: 'Operations Manager', department: 'Operations', status: 'active', lastLogin: '2026-07-12 08:30' },
  { id: 'USR-003', name: 'John Staff', email: 'john@company.com', role: 'Inventory Staff', department: 'Warehouse', status: 'active', lastLogin: '2026-07-11 16:45' },
  { id: 'USR-004', name: 'Alice Johnson', email: 'alice@company.com', role: 'System Manager', department: 'Engineering', status: 'active', lastLogin: '2026-07-12 10:00' },
  { id: 'USR-005', name: 'Bob Smith', email: 'bob@company.com', role: 'Operations Manager', department: 'Marketing', status: 'inactive', lastLogin: '2026-06-28 14:20' },
];

export const roles = [
  { id: 'ROL-001', name: 'System Manager', users: 2, permissions: ['read', 'write', 'delete', 'manage-users', 'manage-roles', 'audit'] },
  { id: 'ROL-002', name: 'Operations Manager', users: 2, permissions: ['read', 'write', 'delete'] },
  { id: 'ROL-003', name: 'Inventory Staff', users: 1, permissions: ['read', 'write'] },
  { id: 'ROL-004', name: 'Viewer', users: 0, permissions: ['read'] },
];

export const auditLogs = [
  { id: 'AUD-001', user: 'Admin User', action: 'User Login', target: 'System', timestamp: '2026-07-12 09:15:22', ip: '192.168.1.100' },
  { id: 'AUD-002', user: 'Sarah Manager', action: 'Create Order', target: 'ORD-009', timestamp: '2026-07-12 09:10:45', ip: '192.168.1.101' },
  { id: 'AUD-003', user: 'Admin User', action: 'Update Product', target: 'PRD-010', timestamp: '2026-07-12 08:55:12', ip: '192.168.1.100' },
  { id: 'AUD-004', user: 'John Staff', action: 'Stock Adjustment', target: 'PRD-007', timestamp: '2026-07-11 16:30:00', ip: '192.168.1.102' },
  { id: 'AUD-005', user: 'Sarah Manager', action: 'Delete Order', target: 'ORD-006', timestamp: '2026-07-11 14:22:33', ip: '192.168.1.101' },
  { id: 'AUD-006', user: 'System', action: 'Backup Completed', target: 'Database', timestamp: '2026-07-11 02:00:00', ip: 'System' },
];

export const userFormFields = [
  { key: 'name', label: 'Full Name', type: 'text', required: true },
  { key: 'email', label: 'Email', type: 'text', required: true },
  { key: 'role', label: 'Role', type: 'select', required: true, options: roles.map(r => r.name) },
  { key: 'department', label: 'Department', type: 'text', required: true },
  { key: 'status', label: 'Status', type: 'select', required: true, options: ['active', 'inactive'] },
];

export function getUserColumns(handleEdit, handleDelete) {
  return [
    { key: 'id', label: 'ID' }, { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' }, { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { key: 'status', label: 'Status', render: (val) => <Badge variant={val}>{val}</Badge> },
    { key: 'lastLogin', label: 'Last Login' },
    { key: 'actions', label: '', sortable: false, render: (_, row) => <ActionCell onEdit={() => handleEdit(row)} onDelete={() => handleDelete(row)} /> },
  ];
}

export function getAuditColumns() {
  return [
    { key: 'id', label: 'ID' }, { key: 'user', label: 'User' },
    { key: 'action', label: 'Action' }, { key: 'target', label: 'Target' },
    { key: 'timestamp', label: 'Timestamp' }, { key: 'ip', label: 'IP Address' },
  ];
}

export function renderUserCard(user, handleEdit, handleDelete) {
  return (
    <div className="grid-card-content">
      <div className="grid-card-top">
        <Badge variant={user.status}>{user.status}</Badge>
        <span className="grid-card-id">{user.id}</span>
      </div>
      <div className="grid-card-body">
        <h4 className="grid-card-title">{user.name}</h4>
        <span className="grid-card-sub">{user.role}</span>
        <div className="grid-card-meta" style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          <span>{user.email}</span>
          <span>{user.department}</span>
        </div>
      </div>
      <div className="grid-card-actions">
        <ActionCell onEdit={() => handleEdit(user)} onDelete={() => handleDelete(user)} compact />
      </div>
    </div>
  );
}
