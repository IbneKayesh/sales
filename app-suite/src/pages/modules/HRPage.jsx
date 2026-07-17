import { useState } from 'react';

import useHR from '../../hooks/useHR';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { IconSearch, IconPlus, IconEdit, IconDelete } from '@/assets/icons';
import PageShell from '@/components/PageShell/PageShell';
import DataTable from '../../components/DataTable/DataTable';

const statusStyles = {
  Active: { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  'On Leave': { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
};

const StatusBadge = ({ status }) => (
  <span style={{ fontSize:10, fontWeight:600, padding:'2px 8px', borderRadius:4, ...statusStyles[status] }}>{status}</span>
);

const EMPTY_FORM = { name: '', dept: '', role: '', salary: '' };

const btnStyle = {
  display:'inline-flex', alignItems:'center', justifyContent:'center',
  width:28, height:28, borderRadius:6, border:'1px solid transparent',
  cursor:'pointer', transition:'all 0.12s ease', background:'transparent', padding:0,
};
const editBtnStyle = { ...btnStyle, color:'#60a5fa', backgroundColor:'rgba(59,130,246,0.08)' };
const deleteBtnStyle = { ...btnStyle, color:'#f87171', backgroundColor:'rgba(239,68,68,0.08)' };

const fieldStyle = (hasError) => ({
  padding:'9px 12px', borderRadius:7, border:`1px solid ${hasError ? '#f87171' : 'var(--glass-border)'}`,
  backgroundColor:'rgba(255,255,255,0.05)', color:'var(--color-text-primary)',
  fontFamily:'inherit', fontSize:13, outline:'none', width:'100%', boxSizing:'border-box',
});

export default function HRPage() {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useHR();
  const { addToast, addActionToast } = useToast();
  const { confirmWithAction } = useConfirm();

  const [view, setView] = useState('list');
  const [currentId, setCurrentId] = useState(null);
  const [search, setSearch] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const filtered = employees.filter(
    (e) => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())
  );

  const depts = [...new Set(employees.map(e => e.dept))];

  const field = (name) => ({
    value: form[name],
    onChange: (e) => setForm((p) => ({ ...p, [name]: e.target.value })),
  });

  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.dept.trim()) errs.dept = 'Department is required';
    if (!form.role.trim()) errs.role = 'Role is required';
    if (!form.salary.trim()) errs.salary = 'Salary is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm();
    setFormErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));

    const data = { name: form.name.trim(), dept: form.dept.trim(), role: form.role.trim(), salary: form.salary.trim() };

    if (view === 'add') {
      addEmployee(data);
      addToast({ message: `Employee "${data.name}" added`, type: 'success' });
      await addActionToast(`"${data.name}" has been added to HR`, 'success', 'hr');
    } else {
      updateEmployee(currentId, data);
      addToast({ message: `Employee "${data.name}" updated`, type: 'success' });
      await addActionToast(`"${data.name}" has been updated`, 'success', 'hr');
    }

    setSubmitting(false);
    setView('list');
    setCurrentId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  };

  const startAdd = () => {
    setForm(EMPTY_FORM);
    setFormErrors({});
    setView('add');
  };

  const startEdit = (id) => {
    const emp = employees.find((e) => e.id === id);
    if (!emp) return;
    setForm({ name: emp.name, dept: emp.dept, role: emp.role, salary: emp.salary });
    setFormErrors({});
    setCurrentId(id);
    setView('edit');
  };

  const handleDelete = async (id, name) => {
    await confirmWithAction(
      'Delete Employee',
      `Are you sure you want to permanently remove "${name}" from HR?`,
      async () => {
        setDeletingId(id);
        await new Promise((r) => setTimeout(r, 500));
        deleteEmployee(id);
        setDeletingId(null);
        await addActionToast(`"${name}" has been removed from HR`, 'info', 'hr');
      },
      { confirmLabel: 'Delete', cancelLabel: 'Keep', danger: true, windowId: 'hr' }
    );
  };

  const cancelForm = () => {
    setView('list'); setCurrentId(null); setForm(EMPTY_FORM); setFormErrors({});
  };

  const columns = [
    { key: 'id', label: 'ID', sortable: true, render: (val) => <code style={{ fontSize:11, color:'var(--color-text-muted)', backgroundColor:'rgba(255,255,255,0.05)', padding:'2px 6px', borderRadius:4 }}>{val}</code> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'dept', label: 'Department', sortable: true },
    { key: 'role', label: 'Role', sortable: true },
    { key: 'status', label: 'Status', sortable: true, render: (val) => <StatusBadge status={val} /> },
    { key: 'salary', label: 'Salary', sortable: true },
    {
      key: 'actions', label: '', width: 80,
      render: (_, row) => (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6 }}>
          <button style={editBtnStyle} onClick={() => startEdit(row.id)} aria-label="Edit employee">
            <IconEdit width="13" height="13" />
          </button>
          <button style={deleteBtnStyle} onClick={() => handleDelete(row.id, row.name)} disabled={deletingId === row.id} aria-label="Delete employee">
            {deletingId === row.id ? (
              <span style={{ width:13, height:13, border:'2px solid rgba(248,113,113,0.2)', borderTopColor:'#f87171', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }} />
            ) : (
              <IconDelete width="13" height="13" />
            )}
          </button>
        </div>
      ),
    },
  ];

  const isListView = view === 'list';

  return (
    <PageShell
      title={isListView ? 'HR Management' : (view === 'add' ? 'Add Employee' : 'Edit Employee')}
      subtitle={isListView ? 'Manage employees and departments' : undefined}
      compact
    >
      <PageShell.Actions>
        {isListView ? (
          <>
            <div style={{ position:'relative' }}>
              <IconSearch style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'var(--color-text-muted)', pointerEvents:'none' }} width="14" height="14" />
              <input style={{ padding:'7px 10px 7px 32px', borderRadius:6, border:'1px solid var(--glass-border)', backgroundColor:'rgba(255,255,255,0.05)', color:'var(--color-text-primary)', fontFamily:'inherit', fontSize:12, outline:'none', width:200 }} placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <button onClick={startAdd} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'var(--accent-color)', color:'white', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>
              <IconPlus width="14" height="14" />
              Add Employee
            </button>
          </>
        ) : (
          <button onClick={cancelForm} style={{ padding:'6px 14px', borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.05)', color:'var(--color-text-primary)', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>Cancel</button>
        )}
      </PageShell.Actions>

      {isListView && (
        <PageShell.Stats>
          <PageShell.Stat label="Total Employees" value={employees.length} />
          <PageShell.Stat label="Departments" value={depts.length} />
          <PageShell.Stat label="Active" value={employees.filter(e => e.status === 'Active').length} />
        </PageShell.Stats>
      )}

      <PageShell.Body>
        {isListView ? (
          <DataTable columns={columns} data={filtered} keyField="id" sortable paginated pageSize={15} emptyMessage="No employees found" emptyAction={{ label: 'Add Employee', onClick: startAdd }} />
        ) : (
          <form onSubmit={handleSubmit} id="hr-form" style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:600 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { label: 'Full Name *', key: 'name', placeholder: 'e.g. Jane Smith' },
                { label: 'Department *', key: 'dept', placeholder: 'e.g. Engineering' },
                { label: 'Role *', key: 'role', placeholder: 'e.g. Senior Developer' },
                { label: 'Salary *', key: 'salary', placeholder: 'e.g. $85,000' },
              ].map((f) => (
                <div key={f.key} style={{ display:'flex', flexDirection:'column', gap:5 }}>
                  <label style={{ fontSize:11, fontWeight:600, color:'var(--color-text-secondary)', letterSpacing:'0.3px', textTransform:'uppercase' }}>{f.label}</label>
                  <input type="text" style={fieldStyle(formErrors[f.key])} placeholder={f.placeholder} {...field(f.key)} />
                  {formErrors[f.key] && <span style={{ fontSize:10, color:'#f87171' }}>{formErrors[f.key]}</span>}
                </div>
              ))}
            </div>
          </form>
        )}
      </PageShell.Body>

      {!isListView && (
        <PageShell.Footer>
          <button type="submit" form="hr-form" disabled={submitting} style={{ padding:'9px 20px', borderRadius:7, fontSize:13, fontWeight:600, color:'white', backgroundColor:'var(--accent-color)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', display:'flex', alignItems:'center', gap:8, minWidth:120, justifyContent:'center', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? (
              <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }} />
            ) : (view === 'add' ? 'Add Employee' : 'Save Changes')}
          </button>
        </PageShell.Footer>
      )}
    </PageShell>
  );
}
