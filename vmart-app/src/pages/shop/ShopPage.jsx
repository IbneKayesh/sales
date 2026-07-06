import { useState, useEffect } from "react";
import { FiGrid, FiTrash2, FiPlus, FiEdit2, FiX } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

export default function ShopPage() {
  const { showToast, showConfirm } = useUI();
  const [form, setForm] = useState({ name: "", description: "", contact: "", address: "" });
  const [shops, setShops] = useState(() => load(KEYS.SHOPS));
  const [editingIdx, setEditingIdx] = useState(null);
  const [modal, setModal] = useState(false);

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

  const openAdd = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (idx) => {
    setForm(shops[idx]);
    setEditingIdx(idx);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    resetForm();
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
    closeModal();
    showToast(isEdit ? "Shop updated successfully" : "Shop added successfully");
  };

  const deleteShop = async (idx) => {
    const confirmed = await showConfirm(`Delete ${shops[idx].name}?`);
    if (!confirmed) return;
    setShops((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) closeModal();
    showToast("Shop deleted", "error");
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Vendors</p>
          <h1 className="page-heading">Shops ({shops.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ui-btn ui-btn-primary" onClick={openAdd}
            style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
            <FiPlus /> Add
          </button>
          <div className="ui-badge"><FiGrid /></div>
        </div>
      </div>

      {/* Shop List */}
      {shops.length > 0 ? (
        <div className="ui-card">
          <h3 className="ui-card-title">All Shops ({shops.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {shops.map((s, idx) => (
              <div key={idx}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                onClick={() => openEdit(idx)}>
                <div style={{ width: 44, height: 44, borderRadius: "var(--radius-md)", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "1.3rem", flexShrink: 0 }}>
                  🏪
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{s.name}</div>
                  {s.description && <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>{s.description}</div>}
                  {s.contact && <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)" }}>📞 {s.contact}</div>}
                </div>
                <div style={{ display: "flex", gap: "var(--space-2)" }}>
                  <button onClick={(e) => { e.stopPropagation(); openEdit(idx); }}
                    style={{ border: "none", background: "var(--accent-soft)", color: "var(--accent)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}
                    aria-label="Edit shop"><FiEdit2 /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteShop(idx); }}
                    style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                    aria-label="Delete shop"><FiTrash2 /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (          <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
              🏪
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>No shops yet</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>Tap "Add" to create your first vendor/shop.</p>
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
                {editingIdx !== null ? "Edit Shop" : "Add Shop / Vendor"}
              </h3>
              <button onClick={closeModal}
                style={{ border: "none", background: "var(--bg-disabled)", width: 32, height: 32, borderRadius: "var(--radius-full)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                <FiX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="shop-name">Shop Name</label>
                <input type="text" id="shop-name" name="shop-name" className="ui-input" placeholder="e.g. Fresh Mart" value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="shop-description">Description</label>
                <textarea id="shop-description" name="shop-description" className="ui-textarea" placeholder="What does this shop offer?" rows={2} value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="shop-contact">Contact</label>
                <input type="tel" id="shop-contact" name="shop-contact" className="ui-input" placeholder="Phone number" value={form.contact}
                  onChange={(e) => handleChange("contact", e.target.value)} />
                </div>
                <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="shop-address">Address</label>
                <input type="text" id="shop-address" name="shop-address" className="ui-input" placeholder="Shop address" value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)} />
                </div>
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <button className="ui-btn ui-btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="ui-btn ui-btn-primary" onClick={saveShop} disabled={!form.name.trim()} style={{ flex: 1 }}>
                  {editingIdx !== null ? "Update Shop" : "Add Shop"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
