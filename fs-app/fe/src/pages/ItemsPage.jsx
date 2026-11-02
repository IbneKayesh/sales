import { useState, useEffect, useCallback } from "react";
import { filebase } from "../api/filebase";

const UNITS = ["pcs", "kg", "g", "litre", "box", "set", "pair", "dozen", "metre", "hour", "other"];
const CATS  = ["General", "Electronics", "Clothing", "Food & Beverage", "Furniture", "Stationery", "Services", "Raw Material", "Other"];

const EMPTY = { code: "", name: "", description: "", category: "General", unit: "pcs", price: "", cost: "", stock: "", notes: "" };

function ItemModal({ item, onClose, onSaved, toast }) {
  const isEdit = !!item;
  const [form, setForm] = useState(
    isEdit
      ? { code: item.code || "", name: item.name || "", description: item.description || "", category: item.category || "General", unit: item.unit || "pcs", price: item.price ?? "", cost: item.cost ?? "", stock: item.stock ?? "", notes: item.notes || "" }
      : { ...EMPTY }
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.price !== "" && isNaN(Number(form.price))) e.price = "Must be a number";
    if (form.cost  !== "" && isNaN(Number(form.cost)))  e.cost  = "Must be a number";
    if (form.stock !== "" && isNaN(Number(form.stock))) e.stock = "Must be a number";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    const payload = {
      ...form,
      price: form.price !== "" ? Number(form.price) : null,
      cost:  form.cost  !== "" ? Number(form.cost)  : null,
      stock: form.stock !== "" ? Number(form.stock) : null,
    };
    try {
      if (isEdit) {
        const r = await filebase.update("items", item._id, payload);
        toast.success("Item updated");
        onSaved(r.data);
      } else {
        const r = await filebase.insert("items", payload);
        toast.success("Item added");
        onSaved(r.data);
      }
      onClose();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>{isEdit ? "✏️" : "📦"}</span>
          <span className="modal-title">{isEdit ? "Edit Item" : "Add Item"}</span>
          <button className="btn btn-ghost btn-icon ml-auto" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Item Code / SKU</label>
                <input id="item-code" className="input" value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. SKU-001" />
              </div>
              <div className="form-group">
                <label className="form-label">Name <span className="form-required">*</span></label>
                <input id="item-name" className="input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Item name" />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select id="item-category" className="select" value={form.category} onChange={(e) => set("category", e.target.value)}>
                  {CATS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Unit</label>
                <select id="item-unit" className="select" value={form.unit} onChange={(e) => set("unit", e.target.value)}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sale Price</label>
                <input id="item-price" className="input" type="number" min="0" step="0.01" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="0.00" />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Cost Price</label>
                <input id="item-cost" className="input" type="number" min="0" step="0.01" value={form.cost} onChange={(e) => set("cost", e.target.value)} placeholder="0.00" />
                {errors.cost && <span className="form-error">{errors.cost}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Stock Quantity</label>
                <input id="item-stock" className="input" type="number" min="0" step="1" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="0" />
                {errors.stock && <span className="form-error">{errors.stock}</span>}
              </div>
              <div className="form-group form-full">
                <label className="form-label">Description</label>
                <textarea id="item-desc" className="textarea" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="Item description…" rows={3} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="save-item-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" />Saving…</> : isEdit ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DeleteModal({ item, onClose, onDeleted, toast }) {
  const [deleting, setDeleting] = useState(false);
  async function handleDelete() {
    setDeleting(true);
    try { await filebase.delete("items", item._id); toast.success("Item deleted"); onDeleted(item._id); onClose(); }
    catch (err) { toast.error(err.message); }
    finally { setDeleting(false); }
  }
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm">
        <div className="modal-header"><span className="modal-title">Delete Item</span><button className="btn btn-ghost btn-icon ml-auto" onClick={onClose}>✕</button></div>
        <div className="modal-body"><div className="confirm-warning">⚠ Delete <strong>{item.name}</strong>? This cannot be undone.</div></div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button id="confirm-delete-item" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>{deleting ? "Deleting…" : "Delete"}</button>
        </div>
      </div>
    </div>
  );
}

function fmt(n) { return n != null ? Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "—"; }

export default function ItemsPage({ toast, onCountChange }) {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState("");
  const [catFilter, setCat]   = useState("all");
  const [editItem, setEditItem] = useState(null);
  const [showAdd, setShowAdd]   = useState(false);
  const [deleteTarget, setDelete] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await filebase.find("items", {}, { createdAt: -1 }, 1000);
      setItems(r.data);
      onCountChange?.(r.data.length);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }, [toast, onCountChange]);

  useEffect(() => { load(); }, [load]);

  const categories = ["all", ...new Set(items.map((i) => i.category).filter(Boolean))];

  const filtered = items.filter((i) => {
    const q = search.toLowerCase();
    const ms = !q || [i.name, i.code, i.description, i.category].some((f) => (f || "").toLowerCase().includes(q));
    const mc = catFilter === "all" || i.category === catFilter;
    return ms && mc;
  });

  const total = Math.ceil(filtered.length / PAGE);
  const paged = filtered.slice(page * PAGE, page * PAGE + PAGE);

  function handleSaved(doc) {
    setItems((prev) => { const idx = prev.findIndex((i) => i._id === doc._id); if (idx >= 0) { const n = [...prev]; n[idx] = doc; return n; } return [doc, ...prev]; });
    onCountChange?.(items.length + (editItem ? 0 : 1));
  }
  function handleDeleted(id) { setItems((p) => p.filter((i) => i._id !== id)); onCountChange?.(items.length - 1); }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title">Items &amp; Products</div>
          <div className="page-subtitle">{items.length} items in catalog</div>
        </div>
        <div className="page-actions">
          <button id="add-item-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>＋ Add Item</button>
        </div>
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4,1fr)" }}>
        <div className="stat-card"><div className="stat-label">Total Items</div><div className="stat-value">{items.length}</div></div>
        <div className="stat-card"><div className="stat-label">In Stock</div><div className="stat-value text-green">{items.filter((i) => (i.stock ?? 0) > 0).length}</div></div>
        <div className="stat-card"><div className="stat-label">Out of Stock</div><div className="stat-value text-red">{items.filter((i) => i.stock != null && i.stock <= 0).length}</div></div>
        <div className="stat-card"><div className="stat-label">Categories</div><div className="stat-value">{new Set(items.map((i) => i.category).filter(Boolean)).size}</div></div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search" style={{ maxWidth: 280 }}>
            <span className="toolbar-search-icon">🔍</span>
            <input id="item-search" className="input search-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search name, code, category…" />
          </div>
          <select id="cat-filter" className="select" style={{ width: 150 }} value={catFilter} onChange={(e) => { setCat(e.target.value); setPage(0); }}>
            {categories.map((c) => <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm btn-icon ml-auto" onClick={load} title="Refresh">⟳</button>
        </div>

        {loading ? (
          <div className="loading-overlay"><span className="spinner" /> Loading…</div>
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📦</span>
            <span className="empty-title">{search ? "No items found" : "No items yet"}</span>
            <span className="empty-sub">{search ? "Try a different search" : "Add your first item or product"}</span>
            {!search && <button className="btn btn-primary mt-8" onClick={() => setShowAdd(true)}>＋ Add Item</button>}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th className="text-right">Sale Price</th>
                    <th className="text-right">Cost</th>
                    <th className="text-right">Stock</th>
                    <th style={{ width: 90 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((item) => (
                    <tr key={item._id}>
                      <td className="td-id">{item.code || "—"}</td>
                      <td className="td-name">{item.name}</td>
                      <td><span className="badge badge-blue">{item.category || "—"}</span></td>
                      <td className="td-light">{item.unit || "—"}</td>
                      <td className="text-right fw-600">{fmt(item.price)}</td>
                      <td className="text-right text-dim">{fmt(item.cost)}</td>
                      <td className="text-right">
                        {item.stock == null
                          ? <span className="text-dim">—</span>
                          : item.stock <= 0
                          ? <span className="badge badge-red">{item.stock}</span>
                          : <span className="badge badge-green">{item.stock}</span>}
                      </td>
                      <td className="td-actions">
                        <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditItem(item)}>✏</button>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: "var(--red)" }} onClick={() => setDelete(item)}>🗑</button>
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
                  {Array.from({ length: total }, (_, i) => <button key={i} className={`btn btn-sm btn-icon${i === page ? " btn-primary" : " btn-ghost"}`} onClick={() => setPage(i)}>{i + 1}</button>)}
                  <button className="btn btn-ghost btn-sm btn-icon" disabled={page >= total - 1} onClick={() => setPage(p => p + 1)}>›</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {(showAdd || editItem) && <ItemModal item={editItem} onClose={() => { setShowAdd(false); setEditItem(null); }} onSaved={handleSaved} toast={toast} />}
      {deleteTarget && <DeleteModal item={deleteTarget} onClose={() => setDelete(null)} onDeleted={handleDeleted} toast={toast} />}
    </div>
  );
}
