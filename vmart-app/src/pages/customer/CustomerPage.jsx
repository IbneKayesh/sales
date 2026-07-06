import { useState, useEffect } from "react";
import { FiUsers, FiTrash2, FiPlus, FiEdit2, FiX } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function CustomerPage() {
  const { showToast, showConfirm } = useUI();
  const [form, setForm] = useState({ name: "", contact: "", address: "" });
  const [customers, setCustomers] = useState(() => load(KEYS.CUSTOMERS));
  const [editingIdx, setEditingIdx] = useState(null);
  const [modal, setModal] = useState(false);

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

  const openAdd = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (idx) => {
    setForm(customers[idx]);
    setEditingIdx(idx);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    resetForm();
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
    closeModal();
    showToast(isEdit ? "Customer updated successfully" : "Customer added successfully");
  };

  const deleteCustomer = async (idx) => {
    const confirmed = await showConfirm(`Delete ${customers[idx].name}?`);
    if (!confirmed) return;
    setCustomers((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) closeModal();
    showToast("Customer deleted", "error");
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Management</p>
          <h1 className="page-heading">Customers ({customers.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ui-btn ui-btn-primary" onClick={openAdd}
            style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
            <FiPlus /> Add
          </button>
          <div className="ui-badge"><FiUsers /></div>
        </div>
      </div>

      {customers.length === 0 ? (          <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
              <FiUsers />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>No customers yet</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>Tap "Add" to create your first customer.</p>
            </div>
          </div>
      ) : (
        <div className="ui-card">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {customers.map((c, idx) => (
              <div key={idx}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                onClick={() => openEdit(idx)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{c.name}</div>
                  {c.contact && <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>{c.contact}</div>}
                  {c.address && <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)" }}>{c.address}</div>}
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(idx); }}
                    style={{ border: "none", background: "var(--accent-soft)", color: "var(--accent)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}
                    aria-label="Edit customer"><FiEdit2 /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteCustomer(idx); }}
                    style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                    aria-label="Delete customer"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div style={{
          position: "fixed", inset: 0, background: "var(--overlay-bg)", zIndex: 100,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "var(--space-4)",
          animation: "modal-fade-in 0.2s ease",
        }} onClick={closeModal}>
          <div style={{
            background: "var(--bg-surface)", width: "100%", maxWidth: 420,
            borderRadius: "var(--radius-2xl)", padding: "var(--space-6) var(--space-5)",
            maxHeight: "90vh", overflowY: "auto",
            animation: "modal-scale-in 0.25s ease",
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-4)" }}>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>
                {editingIdx !== null ? "Edit Customer" : "Add Customer"}
              </h3>
              <button onClick={closeModal}
                style={{ border: "none", background: "var(--bg-disabled)", width: 32, height: 32, borderRadius: "var(--radius-full)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                <FiX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="customer-name">Customer Name</label>
                <input type="text" id="customer-name" name="customer-name" className="ui-input" placeholder="Full name"
                  value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="customer-contact">Contact No</label>
                <input type="tel" id="customer-contact" name="customer-contact" className="ui-input" placeholder="Phone number"
                  value={form.contact} onChange={(e) => handleChange("contact", e.target.value)} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="customer-address">Address</label>
                <textarea id="customer-address" name="customer-address" className="ui-textarea" placeholder="Address" rows={2}
                  value={form.address} onChange={(e) => handleChange("address", e.target.value)} />
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <button className="ui-btn ui-btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="ui-btn ui-btn-primary" onClick={saveCustomer} disabled={!form.name.trim()} style={{ flex: 1 }}>
                  {editingIdx !== null ? "Update Customer" : "Add Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
