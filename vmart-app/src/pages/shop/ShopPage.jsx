import { useState, useEffect } from "react";
import { FiStore, FiTrash2 } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function ShopPage() {
  const { showToast, showConfirm } = useUI();
  const [form, setForm] = useState({ name: "", description: "", contact: "", address: "" });
  const [shops, setShops] = useState(() => load(KEYS.SHOPS));
  const [editingIdx, setEditingIdx] = useState(null);

  useEffect(() => {
    save(KEYS.SHOPS, shops);
  }, [shops]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", description: "", contact: "", address: "" });
    setEditingIdx(null);
  };

  const saveShop = () => {
    if (!form.name.trim()) return;
    const isEdit = editingIdx !== null;
    if (isEdit) {
      setShops((prev) => {
        const next = [...prev];
        next[editingIdx] = { ...form };
        return next;
      });
    } else {
      setShops((prev) => [...prev, { ...form }]);
    }
    resetForm();
    showToast(isEdit ? "Shop updated successfully" : "Shop added successfully");
  };

  const editShop = (idx) => {
    setForm(shops[idx]);
    setEditingIdx(idx);
  };

  const deleteShop = async (idx) => {
    const confirmed = await showConfirm(`Delete ${shops[idx].name}?`);
    if (!confirmed) return;
    setShops((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) resetForm();
    showToast("Shop deleted", "error");
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Vendors</p>
          <h1 className="page-heading">Shops</h1>
        </div>
        <div className="ui-badge"><FiStore /></div>
      </div>

      {/* Form */}
      <div className="ui-card">
        <h3 className="ui-card-title">{editingIdx !== null ? "Edit Shop" : "Add Shop / Vendor"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="ui-form-field">
            <label className="ui-form-label">Shop Name</label>
            <input type="text" className="ui-input" placeholder="e.g. Fresh Mart" value={form.name}
              onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div className="ui-form-field">
            <label className="ui-form-label">Description</label>
            <textarea className="ui-textarea" placeholder="What does this shop offer?" rows={2} value={form.description}
              onChange={(e) => handleChange("description", e.target.value)} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div className="ui-form-field">
              <label className="ui-form-label">Contact</label>
              <input type="tel" className="ui-input" placeholder="Phone number" value={form.contact}
                onChange={(e) => handleChange("contact", e.target.value)} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label">Address</label>
              <input type="text" className="ui-input" placeholder="Shop address" value={form.address}
                onChange={(e) => handleChange("address", e.target.value)} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button className="ui-btn ui-btn-primary" onClick={saveShop} style={{ flex: 1 }}>
              {editingIdx !== null ? "Update Shop" : "Add Shop"}
            </button>
            {editingIdx !== null && (
              <button className="ui-btn ui-btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </div>
      </div>

      {/* Shop List */}
      {shops.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">All Shops ({shops.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {shops.map((s, idx) => (
              <div key={idx}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                onClick={() => editShop(idx)}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                  🏪
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{s.name}</div>
                  {s.description && <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>{s.description}</div>}
                  {s.contact && <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>📞 {s.contact}</div>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteShop(idx); }}
                  style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                  aria-label="Delete shop"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {shops.length === 0 && (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          No shops yet. Add your first vendor/shop above.
        </p>
      )}
    </section>
  );
}
