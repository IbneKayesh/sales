import { useState, useEffect, useCallback, useRef } from "react";
import { filebase } from "../api/filebase";

const INV_STATUSES = ["draft", "sent", "paid", "overdue", "cancelled"];

const STATUS_BADGE = {
  draft:     <span className="badge badge-dim">Draft</span>,
  sent:      <span className="badge badge-blue">Sent</span>,
  paid:      <span className="badge badge-green">✓ Paid</span>,
  overdue:   <span className="badge badge-red">! Overdue</span>,
  cancelled: <span className="badge badge-amber">Cancelled</span>,
};

function fmt(n) {
  return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function genInvNumber(existing) {
  const max = existing.reduce((m, inv) => {
    const n = parseInt((inv.invoiceNumber || "INV-0000").split("-")[1] || "0", 10);
    return Math.max(m, n);
  }, 0);
  return `INV-${String(max + 1).padStart(4, "0")}`;
}

function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// ─── Invoice Form Modal ──────────────────────────────────────────────────────
function InvoiceModal({ invoice, customers, orders, allInvoices, onClose, onSaved, toast }) {
  const isEdit = !!invoice;

  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    customerId:   invoice?.customerId   || "",
    customerName: invoice?.customerName || "",
    orderId:      invoice?.orderId      || "",
    orderNumber:  invoice?.orderNumber  || "",
    date:         invoice?.date         || today,
    dueDate:      invoice?.dueDate      || addDays(today, 30),
    status:       invoice?.status       || "draft",
    taxRate:      invoice?.taxRate      ?? 0,
    notes:        invoice?.notes        || "",
  });

  const [lines, setLines] = useState(
    invoice?.items?.length
      ? invoice.items
      : [{ description: "", qty: 1, price: 0 }]
  );
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  function setF(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  function selectCustomer(id) {
    const c = customers.find((c) => c._id === id);
    setF("customerId", id);
    setF("customerName", c?.name || "");
  }

  function selectOrder(id) {
    const o = orders.find((o) => o._id === id);
    if (!o) { setF("orderId", ""); setF("orderNumber", ""); return; }
    setF("orderId", o._id);
    setF("orderNumber", o.orderNumber);
    if (!form.customerId) { setF("customerId", o.customerId); setF("customerName", o.customerName); }
    if (o.items?.length) {
      setLines(o.items.map((l) => ({ description: l.itemName, qty: l.qty, price: l.price })));
    }
  }

  function addLine() { setLines((l) => [...l, { description: "", qty: 1, price: 0 }]); }
  function removeLine(i) { setLines((l) => l.filter((_, idx) => idx !== i)); }
  function updateLine(i, k, v) { setLines((l) => { const n = [...l]; n[i] = { ...n[i], [k]: v }; return n; }); }

  const subtotal = lines.reduce((s, l) => s + (Number(l.qty) || 0) * (Number(l.price) || 0), 0);
  const taxAmt   = subtotal * (Number(form.taxRate) || 0) / 100;
  const total    = subtotal + taxAmt;

  function validate() {
    const e = {};
    if (!form.customerId) e.customerId = "Select a customer";
    if (!form.date) e.date = "Required";
    if (!form.dueDate) e.dueDate = "Required";
    if (lines.every((l) => !l.description.trim())) e.lines = "Add at least one line item";
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }

    setSaving(true);
    const payload = {
      ...form,
      invoiceNumber: isEdit ? invoice.invoiceNumber : genInvNumber(allInvoices),
      taxRate: Number(form.taxRate) || 0,
      items: lines.map((l) => ({
        description: l.description,
        qty:   Number(l.qty)   || 0,
        price: Number(l.price) || 0,
        total: (Number(l.qty) || 0) * (Number(l.price) || 0),
      })),
      subtotal,
      taxAmount: taxAmt,
      total,
    };

    try {
      if (isEdit) {
        const r = await filebase.update("invoices", invoice._id, payload);
        toast.success("Invoice updated");
        onSaved(r.data);
      } else {
        const r = await filebase.insert("invoices", payload);
        toast.success(`Invoice ${payload.invoiceNumber} created`);
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
          <span style={{ fontSize: 18 }}>{isEdit ? "✏️" : "🧾"}</span>
          <span className="modal-title">{isEdit ? `Edit ${invoice.invoiceNumber}` : "New Invoice"}</span>
          <button className="btn btn-ghost btn-icon ml-auto" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Customer <span className="form-required">*</span></label>
                <select id="inv-customer" className="select" value={form.customerId} onChange={(e) => selectCustomer(e.target.value)}>
                  <option value="">— Select customer —</option>
                  {customers.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
                {errors.customerId && <span className="form-error">{errors.customerId}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Linked Order (optional)</label>
                <select id="inv-order" className="select" value={form.orderId} onChange={(e) => selectOrder(e.target.value)}>
                  <option value="">— None —</option>
                  {orders.filter((o) => !form.customerId || o.customerId === form.customerId).map((o) => (
                    <option key={o._id} value={o._id}>{o.orderNumber} · {o.customerName}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Invoice Date <span className="form-required">*</span></label>
                <input id="inv-date" type="date" className="input" value={form.date} onChange={(e) => setF("date", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Due Date <span className="form-required">*</span></label>
                <input id="inv-due" type="date" className="input" value={form.dueDate} onChange={(e) => setF("dueDate", e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select id="inv-status" className="select" value={form.status} onChange={(e) => setF("status", e.target.value)}>
                  {INV_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Tax Rate (%)</label>
                <input id="inv-tax" type="number" min="0" max="100" step="0.1" className="input" value={form.taxRate} onChange={(e) => setF("taxRate", e.target.value)} placeholder="0" />
              </div>
              <div className="form-group form-full">
                <label className="form-label">Notes / Terms</label>
                <textarea id="inv-notes" className="textarea" value={form.notes} onChange={(e) => setF("notes", e.target.value)} placeholder="Payment terms, notes…" rows={2} />
              </div>
            </div>

            {/* Line items */}
            <div>
              <div className="flex items-center gap-8 mb-8">
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-head)" }}>Line Items</span>
                <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>＋ Add Line</button>
              </div>
              {errors.lines && <span className="form-error mb-8" style={{ display: "block" }}>{errors.lines}</span>}

              <div className="line-items">
                <div className="line-items-header">
                  <span>Description</span><span>Qty</span><span>Unit Price</span><span>Total</span><span></span>
                </div>
                {lines.map((l, i) => (
                  <div className="line-item-row" key={i}>
                    <input className="input" placeholder="Description" value={l.description} onChange={(e) => updateLine(i, "description", e.target.value)} />
                    <input className="input" type="number" min="0.001" step="any" value={l.qty} onChange={(e) => updateLine(i, "qty", e.target.value)} />
                    <input className="input" type="number" min="0" step="0.01" value={l.price} onChange={(e) => updateLine(i, "price", e.target.value)} />
                    <span className="fw-600" style={{ fontSize: 13, color: "var(--text-head)" }}>{fmt((Number(l.qty)||0)*(Number(l.price)||0))}</span>
                    <button type="button" className="btn btn-ghost btn-icon btn-sm" style={{ color: "var(--red)" }} onClick={() => removeLine(i)} disabled={lines.length === 1}>✕</button>
                  </div>
                ))}
                <div className="line-items-footer">
                  <div className="totals-row"><span className="totals-label">Subtotal</span><span className="totals-value">{fmt(subtotal)}</span></div>
                  {taxAmt > 0 && <div className="totals-row"><span className="totals-label">Tax ({form.taxRate}%)</span><span className="totals-value">{fmt(taxAmt)}</span></div>}
                  <div className="totals-row grand"><span className="totals-label">Total</span><span className="totals-value">{fmt(total)}</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button id="save-invoice-btn" type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <><span className="spinner" />Saving…</> : isEdit ? "Save Changes" : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Print-ready Invoice Viewer ──────────────────────────────────────────────
function InvoicePrintModal({ invoice, customers, onClose }) {
  const printRef = useRef();
  const customer = customers.find((c) => c._id === invoice.customerId);

  function handlePrint() { window.print(); }

  const STAMP_COLOR = { paid: "#16a34a", overdue: "#dc2626", cancelled: "#d97706" };

  return (
    <div className="modal-backdrop no-print" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-lg" style={{ maxHeight: "92vh" }}>
        <div className="modal-header no-print">
          <span style={{ fontSize: 18 }}>🧾</span>
          <span className="modal-title">{invoice.invoiceNumber}</span>
          <div className="ml-auto flex gap-8">
            <button className="btn btn-primary btn-sm" onClick={handlePrint}>🖨 Print</button>
            <button className="btn btn-ghost btn-icon" onClick={onClose}>✕</button>
          </div>
        </div>
        <div className="modal-body" style={{ padding: 16 }}>
          <div className="invoice-preview" ref={printRef} style={{ position: "relative" }}>
            {/* Stamp */}
            {STAMP_COLOR[invoice.status] && (
              <div className="inv-status-stamp" style={{ color: STAMP_COLOR[invoice.status] }}>
                {invoice.status.toUpperCase()}
              </div>
            )}

            {/* Header */}
            <div className="inv-header">
              <div>
                <div className="inv-company">SalesBase</div>
                <div className="inv-company-sub">Business Manager · FileBase Edition</div>
              </div>
              <div className="inv-meta">
                <h2>INVOICE</h2>
                <div className="inv-meta-row">Invoice #: <strong>{invoice.invoiceNumber}</strong></div>
                <div className="inv-meta-row">Date: <strong>{invoice.date}</strong></div>
                <div className="inv-meta-row">Due: <strong>{invoice.dueDate}</strong></div>
                {invoice.orderNumber && <div className="inv-meta-row">Order: <strong>{invoice.orderNumber}</strong></div>}
              </div>
            </div>

            {/* Parties */}
            <div className="inv-parties">
              <div>
                <div className="inv-party-label">Bill To</div>
                <div className="inv-party-name">{invoice.customerName}</div>
                {customer?.email    && <div className="inv-party-detail">{customer.email}</div>}
                {customer?.phone    && <div className="inv-party-detail">{customer.phone}</div>}
                {customer?.address  && <div className="inv-party-detail">{customer.address}</div>}
                {customer?.city     && <div className="inv-party-detail">{[customer.city, customer.country].filter(Boolean).join(", ")}</div>}
              </div>
              <div>
                <div className="inv-party-label">Status</div>
                <div style={{ marginTop: 6 }}>{STATUS_BADGE[invoice.status]}</div>
              </div>
            </div>

            {/* Line items */}
            <table className="inv-table">
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>Description</th>
                  <th style={{ width: "15%", textAlign: "center" }}>Qty</th>
                  <th style={{ width: "17.5%", textAlign: "right" }}>Unit Price</th>
                  <th style={{ width: "17.5%" }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {(invoice.items || []).map((l, i) => (
                  <tr key={i}>
                    <td>{l.description}</td>
                    <td style={{ textAlign: "center" }}>{l.qty}</td>
                    <td style={{ textAlign: "right" }}>{fmt(l.price)}</td>
                    <td>{fmt(l.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="inv-totals">
              <div className="inv-total-row"><span>Subtotal</span><span>{fmt(invoice.subtotal)}</span></div>
              {(invoice.taxRate > 0) && <div className="inv-total-row"><span>Tax ({invoice.taxRate}%)</span><span>{fmt(invoice.taxAmount)}</span></div>}
              <div className="inv-total-row grand"><span>Total</span><span>{fmt(invoice.total)}</span></div>
            </div>

            {/* Notes */}
            {invoice.notes && (
              <div style={{ marginTop: 20, fontSize: 12, color: "#64748b" }}>
                <strong style={{ color: "#1e293b" }}>Notes:</strong> {invoice.notes}
              </div>
            )}

            <div className="inv-footer">Thank you for your business!</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────
export default function InvoicesPage({ toast, onCountChange }) {
  const [invoices,  setInvoices]  = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders,    setOrders]    = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState("");
  const [statusFilter, setStatus] = useState("all");
  const [showAdd,   setShowAdd]   = useState(false);
  const [editInv,   setEditInv]   = useState(null);
  const [printInv,  setPrintInv]  = useState(null);
  const [deleteTarget, setDelete] = useState(null);
  const [page, setPage] = useState(0);
  const PAGE = 20;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [iRes, cRes, oRes] = await Promise.all([
        filebase.find("invoices",  {}, { createdAt: -1 }, 1000),
        filebase.find("customers", {}, { name: 1 }, 1000),
        filebase.find("orders",    {}, { createdAt: -1 }, 1000),
      ]);
      setInvoices(iRes.data);
      setCustomers(cRes.data);
      setOrders(oRes.data);
      onCountChange?.(iRes.data.length);
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }, [toast, onCountChange]);

  useEffect(() => { load(); }, [load]);

  const filtered = invoices.filter((inv) => {
    const q = search.toLowerCase();
    const ms = !q || [inv.invoiceNumber, inv.customerName, inv.orderNumber, inv.status].some((f) => (f || "").toLowerCase().includes(q));
    const mst = statusFilter === "all" || inv.status === statusFilter;
    return ms && mst;
  });

  const total = Math.ceil(filtered.length / PAGE);
  const paged = filtered.slice(page * PAGE, page * PAGE + PAGE);

  function handleSaved(doc) {
    setInvoices((prev) => { const i = prev.findIndex((inv) => inv._id === doc._id); if (i >= 0) { const n = [...prev]; n[i] = doc; return n; } return [doc, ...prev]; });
    onCountChange?.(invoices.length + (editInv ? 0 : 1));
  }

  async function handleDelete(inv) {
    try {
      await filebase.delete("invoices", inv._id);
      toast.success("Invoice deleted");
      setInvoices((p) => p.filter((i) => i._id !== inv._id));
      onCountChange?.(invoices.length - 1);
      setDelete(null);
    } catch (err) { toast.error(err.message); }
  }

  async function markPaid(inv) {
    try {
      const r = await filebase.update("invoices", inv._id, { status: "paid" });
      toast.success("Invoice marked as paid");
      setInvoices((p) => p.map((i) => i._id === inv._id ? r.data : i));
    } catch (err) { toast.error(err.message); }
  }

  // Summary stats
  const totalRevenue   = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + (i.total || 0), 0);
  const pendingRevenue = invoices.filter((i) => ["sent","draft"].includes(i.status)).reduce((s, i) => s + (i.total || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title">Invoices</div>
          <div className="page-subtitle">{invoices.length} invoices · {invoices.filter((i) => i.status === "overdue").length} overdue</div>
        </div>
        <div className="page-actions">
          <button id="add-invoice-btn" className="btn btn-primary" onClick={() => setShowAdd(true)}>＋ New Invoice</button>
        </div>
      </div>

      <div className="stats-row" style={{ gridTemplateColumns: "repeat(5,1fr)" }}>
        <div className="stat-card"><div className="stat-label">Total</div><div className="stat-value">{invoices.length}</div></div>
        <div className="stat-card"><div className="stat-label">Paid Revenue</div><div className="stat-value text-green" style={{ fontSize: 18 }}>{fmt(totalRevenue)}</div></div>
        <div className="stat-card"><div className="stat-label">Outstanding</div><div className="stat-value text-amber" style={{ fontSize: 18 }}>{fmt(pendingRevenue)}</div></div>
        <div className="stat-card"><div className="stat-label">Overdue</div><div className="stat-value text-red">{invoices.filter((i) => i.status === "overdue").length}</div></div>
        <div className="stat-card"><div className="stat-label">Paid</div><div className="stat-value text-green">{invoices.filter((i) => i.status === "paid").length}</div></div>
      </div>

      <div className="card">
        <div className="toolbar">
          <div className="toolbar-search" style={{ maxWidth: 280 }}>
            <span className="toolbar-search-icon">🔍</span>
            <input id="invoice-search" className="input search-input" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} placeholder="Search invoice #, customer…" />
          </div>
          <select id="inv-status-filter" className="select" style={{ width: 150 }} value={statusFilter} onChange={(e) => { setStatus(e.target.value); setPage(0); }}>
            <option value="all">All Statuses</option>
            {INV_STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm btn-icon ml-auto" onClick={load} title="Refresh">⟳</button>
        </div>

        {loading ? (
          <div className="loading-overlay"><span className="spinner" /> Loading…</div>
        ) : paged.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">🧾</span>
            <span className="empty-title">{search ? "No invoices found" : "No invoices yet"}</span>
            <span className="empty-sub">{search ? "Try different keywords" : "Create your first invoice"}</span>
            {!search && <button className="btn btn-primary mt-8" onClick={() => setShowAdd(true)}>＋ New Invoice</button>}
          </div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="table">
                <thead>
                  <tr>
                    <th>Invoice #</th>
                    <th>Customer</th>
                    <th>Order</th>
                    <th>Date</th>
                    <th>Due Date</th>
                    <th className="text-right">Total</th>
                    <th>Status</th>
                    <th style={{ width: 130 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((inv) => (
                    <tr key={inv._id}>
                      <td><button className="btn btn-ghost btn-sm" style={{ padding: "2px 6px", fontFamily: "var(--font-mono)", fontSize: 12 }} onClick={() => setPrintInv(inv)}>{inv.invoiceNumber}</button></td>
                      <td className="td-name">{inv.customerName}</td>
                      <td className="td-id">{inv.orderNumber || "—"}</td>
                      <td className="td-light">{inv.date}</td>
                      <td className="td-light" style={inv.status === "overdue" ? { color: "var(--red)", fontWeight: 600 } : {}}>{inv.dueDate}</td>
                      <td className="text-right fw-600">{fmt(inv.total)}</td>
                      <td>{STATUS_BADGE[inv.status] || <span className="badge badge-dim">{inv.status}</span>}</td>
                      <td className="td-actions">
                        <button className="btn btn-ghost btn-icon btn-sm" title="Preview / Print" onClick={() => setPrintInv(inv)}>🖨</button>
                        {!["paid","cancelled"].includes(inv.status) && (
                          <button className="btn btn-ghost btn-icon btn-sm" title="Mark Paid" style={{ color: "var(--green)" }} onClick={() => markPaid(inv)}>✓</button>
                        )}
                        <button className="btn btn-ghost btn-icon btn-sm" title="Edit" onClick={() => setEditInv(inv)}>✏</button>
                        <button className="btn btn-ghost btn-icon btn-sm" title="Delete" style={{ color: "var(--red)" }} onClick={() => setDelete(inv)}>🗑</button>
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

      {(showAdd || editInv) && (
        <InvoiceModal
          invoice={editInv} customers={customers} orders={orders} allInvoices={invoices}
          onClose={() => { setShowAdd(false); setEditInv(null); }}
          onSaved={handleSaved} toast={toast}
        />
      )}
      {printInv && <InvoicePrintModal invoice={printInv} customers={customers} onClose={() => setPrintInv(null)} />}
      {deleteTarget && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && setDelete(null)}>
          <div className="modal modal-sm">
            <div className="modal-header"><span className="modal-title">Delete Invoice</span><button className="btn btn-ghost btn-icon ml-auto" onClick={() => setDelete(null)}>✕</button></div>
            <div className="modal-body"><div className="confirm-warning">⚠ Delete <strong>{deleteTarget.invoiceNumber}</strong>? This cannot be undone.</div></div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setDelete(null)}>Cancel</button>
              <button id="confirm-delete-invoice" className="btn btn-danger" onClick={() => handleDelete(deleteTarget)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
