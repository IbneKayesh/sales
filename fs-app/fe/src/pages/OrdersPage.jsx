import { useState, useEffect, useCallback } from "react";
import { filebase } from "../api/filebase";

const ORDER_STATUSES = ["pending", "confirmed", "processing", "shipped", "completed", "cancelled"];

const STATUS_BADGE = {
  pending:    <span className="badge badge-amber">Pending</span>,
  confirmed:  <span className="badge badge-blue">Confirmed</span>,
  processing: <span className="badge badge-purple">Processing</span>,
  shipped:    <span className="badge badge-cyan">Shipped</span>,
  completed:  <span className="badge badge-green">Completed</span>,
  cancelled:  <span className="badge badge-red">Cancelled</span>,
};

function fmt(n) {
  return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function genOrderNumber(existing) {
  const max = existing.reduce((m, o) => {
    const n = parseInt((o.orderNumber || "ORD-0000").split("-")[1] || "0", 10);
    return Math.max(m, n);
  }, 0);
  return `ORD-${String(max + 1).padStart(4, "0")}`;
}

// ─── Order Form Modal ───────────────────────────────────────────────────────
function OrderModal({ order, customers, items: catalog, allOrders, onClose, onSaved, toast }) {
  const isEdit = !!order;

  const [form, setForm] = useState({
    customerId:  order?.customerId  || "",
    customerName: order?.customerName || "",
    date:        order?.date        || new Date().toISOString().slice(0, 10),
    status:      order?.status      || "pending",
    notes:       order?.notes       || "",
  });
  const [lines, setLines] = useState(
    order?.items?.length
      ? order.items
      : [{ itemId: "", itemName: "", qty: 1, price: 0, unit: "pcs" }]
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function setF(k, v) { setForm((f) => ({ ...f, [k]: v })); setErrors((e) => ({ ...e, [k]: "" })); }

  function selectCustomer(id) {
    const c = customers.find((c) => c._id === id);
    setF("customerId", id);
    setF("customerName", c?.name || "");
  }

  function addLine() { setLines((l) => [...l, { itemId: "", itemName: "", qty: 1, price: 0, unit: "pcs" }]); }
  function removeLine(i) { setLines((l) => l.filter((_, idx) => idx !== i)); }

  function updateLine(i, k, v) {
    setLines((l) => {
      const next = [...l];
      next[i] = { ...next[i], [k]: v };
      if (k === "itemId") {
        const found = catalog.find((it) => it._id === v);
        if (found) {
          next[i].itemName = found.name;
          next[i].price    = found.price ?? 0;
          next[i].unit     = found.unit  || "pcs";
        }
      }
      return next;
    });
  }

  const subtotal = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);

  function validate() {
    const e = {};
    if (!form.customerId) e.customerId = "Select a customer";
    if (!form.date) e.date = "Date required";
    if (lines.length === 0) e.lines = "Add at least one item";
    if (lines.some((l) => !l.itemName.trim())) e.lines = "Each line must have an item name";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    const payload = {
      ...form,
      orderNumber: isEdit ? order.orderNumber : genOrderNumber(allOrders),
      items: lines.map((l) => ({
        itemId:   l.itemId,
        itemName: l.itemName,
        qty:      Number(l.qty)   || 0,
        price:    Number(l.price) || 0,
        unit:     l.unit || "pcs",
        total:    (Number(l.qty) || 0) * (Number(l.price) || 0),
      })),
      subtotal,
      total: subtotal,
    };

    try {
      if (isEdit) {
        const r = await filebase.update("orders", order._id, payload);
        toast.success("Order updated");
        onSaved(r.data);
      } else {
        const r = await filebase.insert("orders", payload);
        toast.success(`Order ${payload.orderNumber} created`);
        onSaved(r.data);
      }
      onClose();
    } catch (err) { toast.error(err.message); }
    finally { setSaving(false); }
  }

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-xl">
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>{isEdit ? "✏️" : "🛒"}</span>
          <span className="modal-title">{isEdit ? `Edit ${order.orderNumber}` : "New Order"}</span>
          <button className="btn btn-ghost btn-icon ml-auto" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Header fields */}
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Customer <span className="form-required">*</span></label>
                <select id="order-customer" className="select" value={form.customerId} onChange={(e) => selectCustomer(e.target.value)}>
                  <option value="">— Select customer —</option>
                  {customers.filter((c) => c.status !== "inactive").map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
                {errors.customerId && <span className="form-error">{errors.customerId}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Order Date <span className="form-required">*</span></label>
                <input id="order-date" type="date" className="input" value={form.date} onChange={(e) => setF("date", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select id="order-status" className="select" value={form.status} onChange={(e) => setF("status", e.target.value)}>
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <input id="order-notes" className="input" value={form.notes} onChange={(e) => setF("notes", e.target.value)} placeholder="Optional notes" />
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center gap-8 mb-8">
                <span className="form-label" style={{ fontSize: 13, fontWeight: 600, color: "var(--text-head)" }}>Line Items</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>＋ Add Line</button>
              </div>

              {errors.lines && <span className="form-error mb-8" style={{ display: "block" }}>{errors.lines}</span>}

              <div className="line-items">
                <div className="line-items-header">
                  <span>Item</span><span>Qty</span><span>Unit Price</span><span>Total</span><span></span>
                </div>
                {lines.map((line, i) => (
                  <div className="line-item-row" key={i}>
                    {/* Item select or free text */}
                    <div style={{ display: "flex", gap: 6 }}>
                      {catalog.length > 0
                        ? <select className="select" value={line.itemId} onChange={(e) => updateLine(i, "itemId", e.target.value)}>
                            <option value="">— or type below —</option>
                            {catalog.map((it) => <option key={it._id} value={it._id}>{it.name}</option>)}
                          </select>
                        : null}
                      <input
                        className="input"
                        placeholder="Item name"
                        value={line.itemName}
                        onChange={(e) => updateLine(i, "itemName", e.target.value)}
                        style={catalog.length > 0 ? { display: "none" } : {}}
                      />
                    </div>
                    <input className="input" type="number" min="0.001" step="any" value={line.qty} onChange={(e) => updateLine(i, "qty", e.target.value)} />
                    <input className="input" type="number" min="0" step="0.01" value={line.price} onChange={(e) => updateLine(i, "price", e.target.value)} />
                    <span className="fw-600" style={{ fontSize: 13, color: "var(--text-head)" }}>
                      {fmt((Number(line.qty) || 0) * (Number(line.price) || 0))}
                    </span>
                    <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--red)" }} onClick={() => removeLine(i)} disabled={lines.length === 1}>✕</button>
                  </div>
                ))}
                <div className="line-items-footer">
                  <div className="totals-row grand">
                    <span className="totals-label">Order Total</span>
                    <span className="totals-value">{fmt(subtotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="save-order-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" />Saving…</> : isEdit ? "Save Changes" : "Create Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── View Order Modal ───────────────────────────────────────────────────────
function ViewOrderModal({ order, onClose, onEdit }) {
  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg">
        <div className="modal-header">
          <span style={{ fontSize: 18 }}>🛒</span>
          <span className="modal-title">{order.orderNumber}</span>
          <div className="ml-auto flex gap-8">
            <button className="btn btn-secondary btn-sm" onClick={() => { onClose(); onEdit(order); }}>✏ Edit</button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body">
          <div className="form-grid" style={{ gap: 8 }}>
            <div><span className="form-label">Customer</span><div className="fw-600 text-head mt-4">{order.customerName}</div></div>
            <div><span className="form-label">Date</span><div className="mt-4">{order.date}</div></div>
            <div><span className="form-label">Status</span><div className="mt-4">{STATUS_BADGE[order.status] || order.status}</div></div>
            {order.notes && <div className="form-full"><span className="form-label">Notes</span><div className="mt-4">{order.notes}</div></div>}
          </div>
          <div className="divider" />
          <div className="line-items">
            <div className="line-items-header">
              <span>Item</span><span>Qty</span><span>Unit Price</span><span>Total</span><span></span>
            </div>
            {(order.items || []).map((l, i) => (
              <div className="line-item-row" key={i}>
                <span>{l.itemName}</span>
                <span>{l.qty} {l.unit}</span>
                <span>{fmt(l.price)}</span>
                <span className="fw-600">{fmt(l.total)}</span>
                <span></span>
              </div>
            ))}
            <div className="line-items-footer">
              <div className="totals-row grand"><span className="totals-label">Total</span><span className="totals-value">{fmt(order.total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────
export default function OrdersPage({ toast, onCountChange }) {
  const [orders, setOrders]       = useState([]);
  const [customers, setCustomers] = useState([]);
  const [items, setItems]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [showAdd, setShowAdd]     = useState(false);
  const [editOrder, setEditOrder] = useState(null);
  const [viewOrder, setViewOrder] = useState(null);
  const [deleteTarget, setDelete] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [oRes, cRes, iRes] = await Promise.all([
        filebase.find("orders",    {}, { createdAt: -1 }, 1000),
        filebase.find("customers", {}, { name: 1 }, 1000),
        filebase.find("items",     {}, { name: 1 }, 1000),
      ]);
      setOrders(oRes.data);
      setCustomers(cRes.data);
      setItems(iRes.data);
      onCountChange?.(oRes.data.length);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }, [toast, onCountChange]);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const ms = !q || [o.orderNumber, o.customerName, o.status].some((f) => (f || "").toLowerCase().includes(q));
    const mst = statusFilter === "all" || o.status === statusFilter;
    return ms && mst;
  });

  const total = Math.ceil(filtered.length / PAGE);
  const paged = filtered.slice(page * PAGE, page * PAGE + PAGE);

  function handleSaved(doc) {
    setOrders((prev) => { const i = prev.findIndex((o) => o._id === doc._id); if (i >= 0) { const n = [...prev]; n[i] = doc; return n; } return [doc, ...prev]; });
    onCountChange?.(orders.length + (editOrder ? 0 : 1));
  }

  async function handleDelete(order) {
    try {
      await filebase.delete("orders", order._id);
      toast.success("Order deleted");
      setOrders((p) => p.filter((o) => o._id !== order._id));
      onCountChange?.(orders.length - 1);
      setDelete(null);
    } catch (err) { toast.error(err.message); }
  }

  async function changeStatus(order, status) {
    try {
      const r = await filebase.update("orders", order._id, { status });
      toast.success(`Status → ${status}`);
      setOrders((p) => p.map((o) => o._id === order._id ? r.data : o));
    } catch (err) { toast.error(err.message); }
  }

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title">Orders</div>
          <div className="page-subtitle">{orders.length} total · {orders.filter((o) => o.status === "pending").length} pending</div>
        </div>
        <div className="page-actions">
          <button id="add-order-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>＋ New Order</button>
        </div>
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        {["pending","confirmed","processing","shipped","completed"].map((s) => (
          <div key={s} className="stat-card" style={{ cursor: "pointer" }} onClick={() => setStatus(s === statusFilter ? "all" : s)}>
            <div className="stat-label">{s}</div>
            <div className="stat-value">{orders.filter((o) => o.status === s).length}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search" style={{ maxWidth: 280 }}>
            <span className="toolbar-search-icon">🔍</span>
            <input id="order-search" className="input search-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search order #, customer…" />
          </div>
          <select id="order-status-filter" className="select" style={{ width: 150 }} value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
            <option value="all">All Statuses</option>
            {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm btn-icon ml-auto" onClick={load} title="Refresh">⟳</button>
        </div>

        {loading ? (
          <div className="loading-overlay"><span className="spinner" /> Loading…</div>
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🛒</span>
            <span className="empty-title">{search ? "No orders found" : "No orders yet"}</span>
            <span className="empty-sub">{search ? "Try different keywords" : "Create your first order"}</span>
            {!search && <button className="btn btn-primary mt-8" onClick={() => setShowAdd(true)}>＋ New Order</button>}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th className="text-right">Total</th>
                    <th>Status</th>
                    <th style={{ width: 120 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((o) => (
                    <tr key={o._id}>
                      <td><button className="btn btn-ghost btn-sm" style={{ padding: "2px 6px", fontFamily: "var(--font-mono)", fontSize: 12 }} onClick={() => setViewOrder(o)}>{o.orderNumber}</button></td>
                      <td className="td-name">{o.customerName}</td>
                      <td className="td-light">{o.date}</td>
                      <td className="text-dim">{(o.items || []).length} lines</td>
                      <td className="text-right fw-600">{fmt(o.total)}</td>
                      <td>{STATUS_BADGE[o.status] || <span className="badge badge-dim">{o.status}</span>}</td>
                      <td className="td-actions">
                        <button className="btn btn-ghost btn-icon btn-sm" title="View" onClick={() => setViewOrder(o)}>👁</button>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditOrder(o)}>✏</button>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: "var(--red)" }} onClick={() => setDelete(o)}>🗑</button>
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

      {(showAdd || editOrder) && (
        <OrderModal
          order={editOrder} customers={customers} items={items} allOrders={orders}
          onClose={() => { setShowAdd(false); setEditOrder(null); }}
          onSaved={handleSaved} toast={toast}
        />
      )}
      {viewOrder && <ViewOrderModal order={viewOrder} onClose={() => setViewOrder(null)} onEdit={(o) => setEditOrder(o)} />}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setDelete(null)}>
          <div className="modal modal-sm">
            <div className="modal-header"><span className="modal-title">Delete Order</span><button className="btn btn-ghost btn-icon ml-auto" onClick={() => setDelete(null)}>✕</button></div>
            <div className="modal-body"><div className="confirm-warning">⚠ Delete <strong>{deleteTarget.orderNumber}</strong>? This cannot be undone.</div></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDelete(null)}>Cancel</button>
              <button id="confirm-delete-order" className="btn btn-danger" onClick={() => handleDelete(deleteTarget)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
