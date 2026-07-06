import { useState, useEffect, useRef } from "react";
import { FiBox, FiTrash2, FiPlus, FiEdit2, FiX, FiCamera, FiAlertTriangle } from "react-icons/fi";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";

const categories = ["Groceries", "Electronics", "Clothing", "Home", "Beauty", "Other"];

export default function ProductPage() {
  const { showToast, showConfirm } = useUI();
  const [shops, setShops] = useState(() => load(KEYS.SHOPS));
  const [form, setForm] = useState({
    name: "", category: "", shop: "", price: 0, discount: 0, stock: 0, image: "",
  });
  const [products, setProducts] = useState(() => load(KEYS.PRODUCTS));
  const [editingIdx, setEditingIdx] = useState(null);
  const [modal, setModal] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    save(KEYS.PRODUCTS, products);
  }, [products]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", category: "", shop: "", price: 0, discount: 0, stock: 0, image: "" });
    setEditingIdx(null);
  };

  const openAdd = () => {
    resetForm();
    setModal(true);
  };

  const openEdit = (idx) => {
    const p = products[idx];
    /* Migrate old inStock field to stock */
    setForm({
      name: p.name || "",
      category: p.category || "",
      shop: p.shop || "",
      price: p.price || 0,
      discount: p.discount || 0,
      stock: p.stock !== undefined ? p.stock : (p.inStock ? 10 : 0),
      image: p.image || "",
    });
    setEditingIdx(idx);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
    resetForm();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be under 2MB", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({ ...prev, image: ev.target?.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (!form.name.trim()) return;
    const isEdit = editingIdx !== null;
    const productData = { ...form };
    if (isEdit) {
      setProducts((prev) => {
        const next = [...prev];
        next[editingIdx] = productData;
        return next;
      });
    } else {
      setProducts((prev) => [...prev, productData]);
    }
    closeModal();
    showToast(isEdit ? "Product updated successfully" : "Product added successfully");
  };

  const deleteProduct = async (idx) => {
    const confirmed = await showConfirm(`Delete ${products[idx].name}?`);
    if (!confirmed) return;
    setProducts((prev) => prev.filter((_, i) => i !== idx));
    if (editingIdx === idx) closeModal();
    showToast("Product deleted", "error");
  };

  const getStockStatus = (p) => {
    const stock = p.stock ?? (p.inStock ? 10 : 0);
    if (stock <= 0) return { label: "Out of Stock", color: "var(--error)", bg: "var(--error-bg)" };
    if (stock <= 5) return { label: `Only ${stock} left`, color: "orange", bg: "rgba(255,165,0,0.12)" };
    return null;
  };

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Inventory</p>
          <h1 className="page-heading">Products ({products.length})</h1>
        </div>
        <div style={{ display: "flex", gap: "var(--space-2)" }}>
          <button className="ui-btn ui-btn-primary" onClick={openAdd}
            style={{ fontSize: "0.85rem", padding: "var(--space-2) var(--space-3)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
            <FiPlus /> Add
          </button>
          <div className="ui-badge"><FiBox /></div>
        </div>
      </div>

      {products.length === 0 ? (          <div style={{ textAlign: "center", padding: "var(--space-8) var(--space-4)", display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--accent-soft)", display: "grid", placeItems: "center", fontSize: "2rem", color: "var(--accent)" }}>
              <FiBox />
            </div>
            <div>
              <h3 style={{ margin: 0, color: "var(--text-h)", fontSize: "1.1rem" }}>No products yet</h3>
              <p style={{ color: "var(--text-subtle)", fontSize: "0.9rem", marginTop: "var(--space-2)" }}>Tap "Add" to create your first product.</p>
            </div>
          </div>
      ) : (
        <div className="ui-card">
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            {products.map((p, idx) => {
              const stockStatus = getStockStatus(p);
              return (
                <div key={idx}
                  style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-3)", borderRadius: "var(--radius-md)", border: "1px solid var(--border)", cursor: "pointer", transition: "background var(--transition)" }}
                  onClick={() => openEdit(idx)}>
                  {/* Product image thumbnail */}
                  <div style={{ width: 48, height: 48, borderRadius: "var(--radius-md)", background: "var(--bg-surface)", border: "1px solid var(--border)", display: "grid", placeItems: "center", fontSize: "1.3rem", flexShrink: 0, overflow: "hidden" }}>
                    {p.image ? (
                      <img src={p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      "📦"
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 600, color: "var(--text-h)", fontSize: "0.95rem" }}>{p.name}</span>
                      {p.category && <span className="ui-tag">{p.category}</span>}
                      {p.shop && <span className="ui-tag" style={{ background: "var(--accent-soft-dark)" }}>🏪 {p.shop}</span>}
                      {stockStatus && (
                        <span style={{ fontSize: "0.7rem", color: stockStatus.color, background: stockStatus.bg, padding: "1px 8px", borderRadius: "var(--radius-full)", fontWeight: 600, display: "flex", alignItems: "center", gap: "2px" }}>
                          {stockStatus.label === "Out of Stock" && <FiAlertTriangle size={10} />}
                          {stockStatus.label}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-subtle)", marginTop: "var(--space-1)" }}>
                      ₹{p.price.toFixed(2)}
                      {p.discount > 0 && <span style={{ color: "var(--error)", marginLeft: "var(--space-2)" }}>-{p.discount}% off</span>}
                      {(p.stock ?? (p.inStock ? 10 : 0)) > 0 && (
                        <span style={{ color: "var(--text-subtle)", marginLeft: "var(--space-2)" }}>· Stock: {p.stock ?? (p.inStock ? 10 : 0)}</span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "var(--space-2)" }}>
                    <button onClick={(e) => { e.stopPropagation(); openEdit(idx); }}
                      style={{ border: "none", background: "var(--accent-soft)", color: "var(--accent)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer" }}
                      aria-label="Edit product"><FiEdit2 /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteProduct(idx); }}
                      style={{ border: "none", background: "var(--error-bg)", color: "var(--error)", width: 36, height: 36, borderRadius: "var(--radius-md)", display: "grid", placeItems: "center", cursor: "pointer", flexShrink: 0 }}
                      aria-label="Delete product"><FiTrash2 /></button>
                  </div>
                </div>
              );
            })}
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
                {editingIdx !== null ? "Edit Product" : "Add Product"}
              </h3>
              <button onClick={closeModal}
                style={{ border: "none", background: "var(--bg-disabled)", width: 32, height: 32, borderRadius: "var(--radius-full)", display: "grid", placeItems: "center", cursor: "pointer", color: "var(--text)" }}>
                <FiX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              {/* Image upload */}
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="product-image">Product Image</label>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
                  <div onClick={() => fileInputRef.current?.click()}
                    style={{ width: 72, height: 72, borderRadius: "var(--radius-md)", background: "var(--bg-surface)", border: "2px dashed var(--border)", display: "grid", placeItems: "center", cursor: "pointer", overflow: "hidden", fontSize: "1.5rem", color: "var(--text-subtle)", transition: "border-color 0.15s" }}>
                    {form.image ? (
                      <img src={form.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <FiCamera />
                    )}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-subtle)", flex: 1 }}>
                    Tap to upload photo<br />Max 2MB
                  </div>
                </div>
                <input ref={fileInputRef} type="file" id="product-image" name="product-image" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="product-name">Product Name</label>
                <input type="text" id="product-name" name="product-name" className="ui-input" placeholder="Product name" value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="product-shop">Shop / Vendor</label>
                <div className="ui-select-wrapper">
                  <select id="product-shop" name="product-shop" className="ui-select" value={form.shop}
                    onChange={(e) => handleChange("shop", e.target.value)}>
                    <option value="">Select shop</option>
                    {shops.map((s) => (
                      <option key={s.name} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="product-category">Category</label>
                <div className="ui-select-wrapper">
                  <select id="product-category" name="product-category" className="ui-select" value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}>
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                <div className="ui-form-field">                <label className="ui-form-label" htmlFor="product-price">Price (₹)</label>
                <input type="number" id="product-price" name="product-price" className="ui-input" min={0} step={0.01} placeholder="0.00" value={form.price || ""}
                    onChange={(e) => handleChange("price", Number(e.target.value) || 0)} />
                </div>
                <div className="ui-form-field">
                  <label className="ui-form-label" htmlFor="product-discount">Discount (%)</label>
                  <input type="number" id="product-discount" name="product-discount" className="ui-input" min={0} max={100} placeholder="0" value={form.discount || ""}
                    onChange={(e) => handleChange("discount", Number(e.target.value) || 0)} />
                </div>
              </div>

              {/* Stock quantity */}
              <div className="ui-form-field">
                <label className="ui-form-label" htmlFor="product-stock">Stock Quantity</label>
                <input type="number" id="product-stock" name="product-stock" className="ui-input" min={0} placeholder="0 = out of stock" value={form.stock ?? ""}
                  onChange={(e) => handleChange("stock", Math.max(0, Number(e.target.value) || 0))} />
                {form.stock > 0 && form.stock <= 5 && (
                  <div style={{ fontSize: "0.78rem", color: "orange", marginTop: "var(--space-1)", display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                    <FiAlertTriangle size={12} /> Low stock — only {form.stock} units
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "var(--space-3)", marginTop: "var(--space-2)" }}>
                <button className="ui-btn ui-btn-secondary" onClick={closeModal} style={{ flex: 1 }}>
                  Cancel
                </button>
                <button className="ui-btn ui-btn-primary" onClick={saveProduct} disabled={!form.name.trim()} style={{ flex: 1 }}>
                  {editingIdx !== null ? "Update Product" : "Add Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
