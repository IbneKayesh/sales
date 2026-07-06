import { useState, useEffect } from "react";
import { FiUsers, FiTrash2 } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function CustomerPage() {
  const { showToast, showConfirm } = useUI();
  const [form, setForm] = useState({ name: "", contact: "", address: "" });
  const [customers, setCustomers] = useState(() => load(KEYS.CUSTOMERS));
  const [editingIdx, setEditingIdx] = useState(null);

  /* Persist to localStorage whenever list changes */
  useEffect(() => {
    save(KEYS.CUSTOMERS, customers);
  }, [customers]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", contact: "", address: "" });
    setEditingIdx(null);
  };

  const saveCustomer = () => {
    if (!form.name.trim()) return;
    const isEdit = editingIdx !== null;
    if (isEdit) {
      setCustomers((prev) => {
        const next = [...prev];
        next[editingIdx] = { ...form };
        return next;
      });
    } else {
      setCustomers((prev) => [...prev, { ...form }]);
    }
    resetForm();
    showToast(isEdit ? "Customer updated successfully" : "Customer added successfully");
  };

  const editCustomer = (idx) => {
    setForm(customers[idx]);
    setEditingIdx(idx);
  };

  const deleteCustomer = async (idx) => {
    const confirmed = await showConfirm(`Delete ${customers[idx].name}?`);
    if (!confirmed) return;
    setCustomers((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) resetForm();
    showToast("Customer deleted", "error");
  };

  return (
    <section className="page-section">
      {/* ── Header ── */}
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Management</p>
          <h1 className="page-heading">Customers</h1>
        </div>
        <div className="ui-badge">
          <FiUsers />
        </div>
      </div>

      {/* ── Form ── */}
      <div className="ui-card">
        <h3 className="ui-card-title">{editingIdx !== null ? "Edit Customer" : "Add Customer"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="ui-form-field">
            <label className="ui-form-label">Customer Name</label>
            <input
              type="text"
              className="ui-input"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div className="ui-form-field">
            <label className="ui-form-label">Contact No</label>
            <input
              type="tel"
              className="ui-input"
              placeholder="Phone number"
              value={form.contact}
              onChange={(e) => handleChange("contact", e.target.value)}
            />
          </div>

          <div className="ui-form-field">
            <label className="ui-form-label">Address</label>
            <textarea
              className="ui-textarea"
              placeholder="Address"
              rows={2}
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button className="ui-btn ui-btn-primary" onClick={saveCustomer} style={{ flex: 1 }}>
              {editingIdx !== null ? "Update Customer" : "Add Customer"}
            </button>
            {editingIdx !== null && (
              <button className="ui-btn ui-btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── List ── */}
      {customers.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Customer List ({customers.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {customers.map((c, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  padding: "var(--space-3)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "background var(--transition)",
                }}
                onClick={() => editCustomer(idx)}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{c.name}</div>
                  {c.contact && (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                      {c.contact}
                    </div>
                  )}
                  {c.address && (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>{c.address}</div>
                  )}
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); deleteCustomer(idx); }}
                  style={{
                    border: "none",
                    background: "var(--error-bg)",
                    color: "var(--error)",
                    width: "var(--touch-target)",
                    height: "var(--touch-target)",
                    borderRadius: "var(--radius-md)",
                    display: "grid",
                    placeItems: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                  }}
                  aria-label="Delete customer"
                >
                  <FiTrash2 />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Empty state ── */}
      {customers.length === 0 && (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          No customers yet. Add your first customer above.
        </p>
      )}
    </section>
  );
}
