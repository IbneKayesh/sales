import { useState, useEffect, useCallback } from "react";
import { filebase } from "../api/filebase";

const STATUS_BADGE = {
  active:   <span className="badge badge-green">● Active</span>,
  inactive: <span className="badge badge-dim">○ Inactive</span>,
};

const EMPTY_FORM = {
  name: "", contact: "", phone: "", email: "",
  address: "", city: "", country: "", status: "active", notes: "",
};

function CustomerModal({ customer, onClose, onSaved, toast }) {
  const isEdit = !!customer;
  const [form, setForm] = useState(
    isEdit
      ? { name: customer.name || "", contact: customer.contact || "", phone: customer.phone || "", email: customer.email || "", address: customer.address || "", city: customer.city || "", country: customer.country || "", status: customer.status || "active", notes: customer.notes || "" }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    try {
      if (isEdit) {
        const r = await filebase.update("customers", customer._id, form);
        toast.success("Customer updated");
        onSaved(r.data);
      } else {
        const r = await filebase.insert("customers", form);
        toast.success("Customer added");
        onSaved(r.data);
      }
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>{isEdit ? "✏️" : "👤"}</span>
          <span className="modal-title">{isEdit ? "Edit Customer" : "Add Customer"}</span>
          <button className="btn btn-ghost btn-icon ml-auto" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group form-full">
                <label className="form-label">Full Name <span className="form-required">*</span></label>
                <input id="cust-name" className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. John Smith or Acme Corp" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Contact Person</label>
                <input id="cust-contact" className="input" value={form.contact} onChange={(e) => set("contact", e.target.value)} placeholder="Primary contact name" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input id="cust-phone" className="input" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input id="cust-email" className="input" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="email@example.com" />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select id="cust-status" className="select" value={form.status} onChange={(e) => set("status", e.target.value)}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <div className="form-group form-full">
                <label className="form-label">Address</label>
                <input id="cust-address" className="input" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="Street address" />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input id="cust-city" className="input" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="City" />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input id="cust-country" className="input" value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="Country" />
              </div>
              <div className="form-group form-full">
                <label className="form-label">Notes</label>
                <textarea id="cust-notes" className="textarea" value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Additional notes…" rows={3} />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="save-customer-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" />Saving…</> : isEdit ? "Save Changes" : "Add Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ customer, onClose, onDeleted, toast }) {
  const [deleting, setDeleting] = useState(false);
  async function handleDelete() {
    setDeleting(true);
    try {
      await filebase.delete("customers", customer._id);
      toast.success("Customer deleted");
      onDeleted(customer._id);
      onClose();
    } catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  }
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <span className="modal-title">Delete Customer</span>
          <button className="btn btn-ghost btn-icon ml-auto" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="confirm-warning">⚠ Delete <strong>{customer.name}</strong>? This cannot be undone.</div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button id="confirm-delete-customer" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

export default function CustomersPage({ toast, onCountChange }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editCustomer, setEditCustomer] = useState(null);
  const [showAdd, setShowAdd]           = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await filebase.find("customers", {}, { createdAt: -1 }, 1000);
      setCustomers(r.data);
      onCountChange?.(r.data.length);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }, [toast, onCountChange]);

  useEffect(() => { load(); }, [load]);

  const filtered = customers.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = !q || [c.name, c.email, c.phone, c.contact, c.city].some((f) => (f || "").toLowerCase().includes(q));
    const matchStatus = statusFilter === "all" || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const total  = Math.ceil(filtered.length / PAGE);
  const paged  = filtered.slice(page * PAGE, page * PAGE + PAGE);

  function handleSaved(doc) {
    setCustomers((prev) => {
      const idx = prev.findIndex((c) => c._id === doc._id);
      if (idx >= 0) { const next = [...prev]; next[idx] = doc; return next; }
      return [doc, ...prev];
    });
    onCountChange?.(customers.length + (editCustomer ? 0 : 1));
  }

  function handleDeleted(id) {
    setCustomers((p) => p.filter((c) => c._id !== id));
    onCountChange?.(customers.length - 1);
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title">Customers</div>
          <div className="page-subtitle">{customers.length} total · {customers.filter((c) => c.status === "active").length} active</div>
        </div>
        <div className="page-actions">
          <button id="add-customer-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>＋ Add Customer</button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{customers.length}</div></div>
        <div className="stat-card"><div className="stat-label">Active</div><div className="stat-value text-green">{customers.filter((c) => c.status === "active").length}</div></div>
        <div className="stat-card"><div className="stat-label">Inactive</div><div className="stat-value text-dim">{customers.filter((c) => c.status === "inactive").length}</div></div>
      </div>

      {/* Table card */}
      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search" style={{ maxWidth: 280 }}>
            <span className="toolbar-search-icon">🔍</span>
            <input id="customer-search" className="input search-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search name, email, phone…" />
          </div>
          <select id="status-filter" className="select" style={{ width: 130 }} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn btn-ghost btn-sm btn-icon ml-auto" onClick={load} title="Refresh">⟳</button>
        </div>

        {loading ? (
          <div className="loading-overlay"><span className="spinner" /> Loading…</div>
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">👥</span>
            <span className="empty-title">{search ? "No customers found" : "No customers yet"}</span>
            <span className="empty-sub">{search ? "Try a different search" : "Add your first customer to get started"}</span>
            {!search && <button className="btn btn-primary mt-8" onClick={() => setShowAdd(true)}>＋ Add Customer</button>}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th style={{ width: 90 }}>ID</th>
                    <th>Name</th>
                    <th>Contact</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Status</th>
                    <th style={{ width: 90 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((c) => (
                    <tr key={c._id}>
                      <td className="td-id">{c._id.slice(0, 8)}</td>
                      <td className="td-name">{c.name}</td>
                      <td className="td-light">{c.contact || "—"}</td>
                      <td className="td-light">{c.phone || "—"}</td>
                      <td className="td-light">{c.email || "—"}</td>
                      <td className="td-light">{[c.city, c.country].filter(Boolean).join(", ") || "—"}</td>
                      <td>{STATUS_BADGE[c.status] || <span className="badge badge-dim">{c.status}</span>}</td>
                      <td className="td-actions">
                        <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditCustomer(c)}>✏</button>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: "var(--red)" }} onClick={() => setDeleteTarget(c)}>🗑</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {total > 1 && (
              <div className="pagination">
                <span>{page * PAGE + 1}–{Math.min(page * PAGE + PAGE, filtered.length)} of {filtered.length}</span>
                <div className="pagination-btns">
                  <button className="btn btn-ghost btn-sm btn-icon" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
                  {Array.from({ length: total }, (_, i) => (
                    <button key={i} className={`btn btn-sm btn-icon${i === page ? " btn-primary" : " btn-ghost"}`} onClick={() => setPage(i)}>{i + 1}</button>
                  ))}
                  <button className="btn btn-ghost btn-sm btn-icon" disabled={page >= total - 1} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(showAdd || editCustomer) && (
        <CustomerModal customer={editCustomer} onClose={() => { setShowAdd(false); setEditCustomer(null); }} onSaved={handleSaved} toast={toast} />
      )}
      {deleteTarget && <DeleteModal customer={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} toast={toast} />}
    </div>
  );
}
