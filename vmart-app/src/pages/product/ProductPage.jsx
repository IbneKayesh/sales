import { useState, useEffect } from "react";
import { FiBox, FiTrash2 } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

const categories = ["Groceries", "Electronics", "Clothing", "Home", "Beauty", "Other"];

export default function ProductPage() {
  const { showToast, showConfirm } = useUI();
  const [shops, setShops] = useState(() => load(KEYS.SHOPS));
  const [form, setForm] = useState({
    name: "",
    category: "",
    shop: "",
    price: 0,
    discount: 0,
    inStock: true,
  });
  const [products, setProducts] = useState(() => load(KEYS.PRODUCTS));
  const [editingIdx, setEditingIdx] = useState(null);

  useEffect(() => {
    save(KEYS.PRODUCTS, products);
  }, [products]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", category: "", shop: "", price: 0, discount: 0, inStock: true });
    setEditingIdx(null);
  };

  const saveProduct = () => {
    if (!form.name.trim()) return;
    const isEdit = editingIdx !== null;
    if (isEdit) {
      setProducts((prev) => {
        const next = [...prev];
        next[editingIdx] = { ...form };
        return next;
      });
    } else {
      setProducts((prev) => [...prev, { ...form }]);
    }
    resetForm();
    showToast(isEdit ? "Product updated successfully" : "Product added successfully");
  };

  const editProduct = (idx) => {
    setForm(products[idx]);
    setEditingIdx(idx);
  };

  const deleteProduct = async (idx) => {
    const confirmed = await showConfirm(`Delete ${products[idx].name}?`);
    if (!confirmed) return;
    setProducts((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) resetForm();
    showToast("Product deleted", "error");
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Inventory</p>
          <h1 className="page-heading">Products</h1>
        </div>
        <div className="ui-badge"><FiBox /></div>
      </div>

      <div className="ui-card">
        <h3 className="ui-card-title">{editingIdx !== null ? "Edit Product" : "Add Product"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <div className="ui-form-field">
            <label className="ui-form-label">Product Name</label>
            <input type="text" className="ui-input" placeholder="Product name" value={form.name}
              onChange={(e) => handleChange("name", e.target.value)} />
          </div>

          <div className="ui-form-field">
            <label className="ui-form-label">Shop / Vendor</label>
            <div className="ui-select-wrapper">
              <select className="ui-select" value={form.shop}
                onChange={(e) => handleChange("shop", e.target.value)}>
                <option value="">Select shop</option>
                {shops.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ui-form-field">
            <label className="ui-form-label">Category</label>
            <div className="ui-select-wrapper">
              <select className="ui-select" value={form.category}
                onChange={(e) => handleChange("category", e.target.value)}>
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
            <div className="ui-form-field">
              <label className="ui-form-label">Price (₹)</label>
              <input type="number" className="ui-input" min={0} step={0.01} placeholder="0.00" value={form.price || ""}
                onChange={(e) => handleChange("price", Number(e.target.value) || 0)} />
            </div>
            <div className="ui-form-field">
              <label className="ui-form-label">Discount (%)</label>
              <input type="number" className="ui-input" min={0} max={100} placeholder="0" value={form.discount || ""}
                onChange={(e) => handleChange("discount", Number(e.target.value) || 0)} />
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", cursor: "pointer", padding: "var(--space-2) 0", color: "var(--text)", fontSize: "0.95rem" }}>
            <input type="checkbox" checked={form.inStock} onChange={(e) => handleChange("inStock", e.target.checked)}
              style={{ width: 18, height: 18, accentColor: "var(--accent-primary)" }} />
            In Stock
          </label>

          <div style={{ display: "flex", gap: "var(--space-3)" }}>
            <button className="ui-btn ui-btn-primary" onClick={saveProduct} style={{ flex: 1 }}>
              {editingIdx !== null ? "Update Product" : "Add Product"}
            </button>
            {editingIdx !== null && (
              <button className="ui-btn ui-btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </div>
      </div>

      {products.length > 0 && (
        <div className="ui-card">
          <h3 className="ui-card-title">Product List ({products.length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {products.map((p, idx) => (
              <div key={idx}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                onClick={() => editProduct(idx)}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{p.name}</span>
                    {p.category && <span className="ui-tag">{p.category}</span>}
                    {p.shop && <span className="ui-tag" style={{ background: "var(--accent-soft-dark)" }}>🏪 {p.shop}</span>}
                    {!p.inStock && <span style={{ fontSize: "0.75rem", color: "var(--error)", fontWeight: 500 }}>Out of Stock</span>}
                  </div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                    ₹{p.price.toFixed(2)}
                    {p.discount > 0 && <span style={{ color: "var(--error)", marginLeft: "var(--space-2)" }}>-{p.discount}% off</span>}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteProduct(idx); }}
                  style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                  aria-label="Delete product"><FiTrash2 /></button>
              </div>
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <p className="page-summary" style={{ textAlign: "center", padding: "var(--space-7) 0" }}>
          No products yet. Add your first product above.
        </p>
      )}
    </section>
  );
}
