import React, { useState } from 'react';
import useHR from '../../hooks/useHR';
import { useToast, useConfirm } from '@/context/FeedbackContext';
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
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button style={deleteBtnStyle} onClick={() => handleDelete(row.id, row.name)} disabled={deletingId === row.id} aria-label="Delete employee">
            {deletingId === row.id ? (
              <span style={{ width:13, height:13, border:'2px solid rgba(248,113,113,0.2)', borderTopColor:'#f87171', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }} />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ display:'flex', flexDirection:'column', height:'100%', color:'var(--color-text-primary)', fontFamily:'var(--font-body)' }}>
      {view === 'list' ? (
        <>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, padding:'14px 20px', borderBottom:'1px solid rgba(255,255,255,0.06)', backgroundColor:'rgba(0,0,0,0.15)' }}>
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, margin:0 }}>HR Management</h2>
              <p style={{ fontSize:11, color:'var(--color-text-muted)', margin:'2px 0 0' }}>Manage employees and departments</p>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ position:'relative' }}>
                <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', width:14, height:14, color:'var(--color-text-muted)', pointerEvents:'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input style={{ padding:'7px 10px 7px 32px', borderRadius:6, border:'1px solid var(--glass-border)', backgroundColor:'rgba(255,255,255,0.05)', color:'var(--color-text-primary)', fontFamily:'inherit', fontSize:12, outline:'none', width:200 }} placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
              <button onClick={startAdd} style={{ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 12px', borderRadius:6, border:'1px solid rgba(255,255,255,0.1)', backgroundColor:'var(--accent-color)', color:'white', fontFamily:'inherit', fontSize:12, fontWeight:600, cursor:'pointer' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                Add Employee
              </button>
            </div>
          </div>
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto', padding:20, gap:16 }}>
            <div style={{ display:'flex', gap:12 }}>
              {[
                { label: 'Total Employees', value: employees.length },
                { label: 'Departments', value: depts.length },
                { label: 'Active', value: employees.filter(e => e.status === 'Active').length },
              ].map((s, i) => (
                <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', gap:2, padding:'12px 16px', borderRadius:8, backgroundColor:'rgba(0,0,0,0.15)', border:'1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize:10, color:'var(--color-text-muted)', textTransform:'uppercase', letterSpacing:'0.4px' }}>{s.label}</span>
                  <span style={{ fontSize:18, fontWeight:700, color:'var(--color-text-primary)', fontFamily:'var(--font-display)' }}>{s.value}</span>
                </div>
              ))}
            </div>
            <DataTable columns={columns} data={filtered} keyField="id" sortable paginated pageSize={15} emptyMessage="No employees found" emptyAction={{ label: 'Add Employee', onClick: startAdd }} />
          </div>
        </>
      ) : (
        <div style={{ padding:20, overflow:'auto' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:16, fontWeight:600, margin:0 }}>{view === 'add' ? 'Add Employee' : 'Edit Employee'}</h2>
            <button onClick={cancelForm} style={{ padding:'6px 14px', borderRadius:6, border:'1px solid rgba(255,255,255,0.08)', backgroundColor:'rgba(255,255,255,0.05)', color:'var(--color-text-primary)', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>Cancel</button>
          </div>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:600 }}>
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
            <div style={{ display:'flex', justifyContent:'flex-end' }}>
              <button type="submit" disabled={submitting} style={{ padding:'9px 20px', borderRadius:7, fontSize:13, fontWeight:600, color:'white', backgroundColor:'var(--accent-color)', border:'1px solid rgba(255,255,255,0.1)', cursor:'pointer', display:'flex', alignItems:'center', gap:8, minWidth:120, justifyContent:'center', opacity: submitting ? 0.7 : 1 }}>
                {submitting ? (
                  <span style={{ width:16, height:16, border:'2px solid rgba(255,255,255,0.2)', borderTopColor:'white', borderRadius:'50%', animation:'spin 0.7s linear infinite', display:'block' }} />
                ) : (view === 'add' ? 'Add Employee' : 'Save Changes')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
    </>
  );
}
