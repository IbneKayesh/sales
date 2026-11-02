import { useState, useEffect } from "react";
import { filebase } from "../api/filebase";

function fmt(n) {
  return Number(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function relativeTime(isoStr) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function DashboardPage({ onNavigate }) {
  const [stats, setStats]    = useState(null);
  const [recent, setRecent]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [cRes, iRes, oRes, invRes] = await Promise.all([
          filebase.find("customers", {}, { createdAt: -1 }, 1000).catch(() => ({ data: [] })),
          filebase.find("items",     {}, { createdAt: -1 }, 1000).catch(() => ({ data: [] })),
          filebase.find("orders",    {}, { createdAt: -1 }, 1000).catch(() => ({ data: [] })),
          filebase.find("invoices",  {}, { createdAt: -1 }, 1000).catch(() => ({ data: [] })),
        ]);

        const customers = cRes.data;
        const items     = iRes.data;
        const orders    = oRes.data;
        const invoices  = invRes.data;

        const paidRevenue = invoices
          .filter((i) => i.status === "paid")
          .reduce((s, i) => s + (i.total || 0), 0);

        const outstanding = invoices
          .filter((i) => ["sent", "draft"].includes(i.status))
          .reduce((s, i) => s + (i.total || 0), 0);

        setStats({
          customers: customers.length,
          activeCustomers: customers.filter((c) => c.status === "active").length,
          items: items.length,
          lowStock: items.filter((i) => i.stock != null && i.stock <= 5).length,
          orders: orders.length,
          pendingOrders: orders.filter((o) => o.status === "pending").length,
          invoices: invoices.length,
          overdueInvoices: invoices.filter((i) => i.status === "overdue").length,
          paidRevenue,
          outstanding,
        });

        // Build recent activity feed
        const activity = [
          ...orders.slice(0, 5).map((o) => ({
            text: `Order ${o.orderNumber} — ${o.customerName}`,
            sub:  `${o.status} · ${fmt(o.total)}`,
            color: "#3b82f6",
            time: o.createdAt,
            page: "orders",
          })),
          ...invoices.slice(0, 5).map((i) => ({
            text: `Invoice ${i.invoiceNumber} — ${i.customerName}`,
            sub:  `${i.status} · ${fmt(i.total)}`,
            color: i.status === "paid" ? "#22c55e" : i.status === "overdue" ? "#f87171" : "#a78bfa",
            time: i.createdAt,
            page: "invoices",
          })),
          ...customers.slice(0, 3).map((c) => ({
            text: `Customer: ${c.name}`,
            sub:  c.email || c.city || "added",
            color: "#22d3ee",
            time: c.createdAt,
            page: "customers",
          })),
        ]
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .slice(0, 10);

        setRecent(activity);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <div className="loading-overlay"><span className="spinner" /> Loading dashboard…</div>;
  }

  const s = stats || {};

  return (
    <div>
      <div className="page-header">
        <div className="page-header-text">
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Business overview at a glance</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="stats-row" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        <div className="stat-card" style={{ cursor: "pointer", borderLeft: "3px solid var(--accent)" }} onClick={() => onNavigate("customers")}>
          <div className="stat-icon">👥</div>
          <div className="stat-label">Customers</div>
          <div className="stat-value">{s.customers ?? "—"}</div>
          <div className="stat-sub">{s.activeCustomers} active</div>
        </div>
        <div className="stat-card" style={{ cursor: "pointer", borderLeft: "3px solid var(--purple)" }} onClick={() => onNavigate("items")}>
          <div className="stat-icon">📦</div>
          <div className="stat-label">Items</div>
          <div className="stat-value">{s.items ?? "—"}</div>
          <div className="stat-sub" style={{ color: s.lowStock > 0 ? "var(--amber)" : "var(--text-dim)" }}>
            {s.lowStock > 0 ? `${s.lowStock} low stock` : "all in stock"}
          </div>
        </div>
        <div className="stat-card" style={{ cursor: "pointer", borderLeft: "3px solid var(--cyan)" }} onClick={() => onNavigate("orders")}>
          <div className="stat-icon">🛒</div>
          <div className="stat-label">Orders</div>
          <div className="stat-value">{s.orders ?? "—"}</div>
          <div className="stat-sub" style={{ color: s.pendingOrders > 0 ? "var(--amber)" : "var(--text-dim)" }}>
            {s.pendingOrders} pending
          </div>
        </div>
        <div className="stat-card" style={{ cursor: "pointer", borderLeft: "3px solid var(--green)" }} onClick={() => onNavigate("invoices")}>
          <div className="stat-icon">🧾</div>
          <div className="stat-label">Invoices</div>
          <div className="stat-value">{s.invoices ?? "—"}</div>
          <div className="stat-sub" style={{ color: s.overdueInvoices > 0 ? "var(--red)" : "var(--text-dim)" }}>
            {s.overdueInvoices > 0 ? `${s.overdueInvoices} overdue` : "none overdue"}
          </div>
        </div>
      </div>

      {/* Revenue cards */}
      <div className="stats-row" style={{ gridTemplateColumns: "1fr 1fr", marginBottom: 24 }}>
        <div className="stat-card" style={{ borderLeft: "3px solid var(--green)" }}>
          <div className="stat-label">💰 Paid Revenue</div>
          <div className="stat-value text-green" style={{ fontSize: 28, marginTop: 4 }}>{fmt(s.paidRevenue)}</div>
          <div className="stat-sub">from paid invoices</div>
        </div>
        <div className="stat-card" style={{ borderLeft: "3px solid var(--amber)" }}>
          <div className="stat-label">⏳ Outstanding</div>
          <div className="stat-value text-amber" style={{ fontSize: 28, marginTop: 4 }}>{fmt(s.outstanding)}</div>
          <div className="stat-sub">draft + sent invoices</div>
        </div>
      </div>

      {/* Recent Activity + Quick Links */}
      <div className="dashboard-grid">
        {/* Recent activity */}
        <div className="card" style={{ gridColumn: "1 / -1" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 600, color: "var(--text-head)", fontSize: 13 }}>Recent Activity</span>
            <span className="badge badge-dim" style={{ marginLeft: "auto" }}>{recent.length} events</span>
          </div>
          {recent.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <span className="empty-icon">📭</span>
              <span className="empty-title">No activity yet</span>
              <span className="empty-sub">Start by adding customers, items, orders, or invoices</span>
              <div className="flex gap-8 mt-8" style={{ flexWrap: "wrap", justifyContent: "center" }}>
                <button className="btn btn-primary btn-sm" onClick={() => onNavigate("customers")}>Add Customer</button>
                <button className="btn btn-secondary btn-sm" onClick={() => onNavigate("items")}>Add Item</button>
              </div>
            </div>
          ) : (
            <div className="recent-activity">
              {recent.map((a, i) => (
                <div key={i} className="activity-item" style={{ cursor: "pointer" }} onClick={() => onNavigate(a.page)}>
                  <span className="activity-dot" style={{ background: a.color }} />
                  <div style={{ flex: 1 }}>
                    <div className="activity-text">{a.text}</div>
                    <div style={{ fontSize: 11, color: "var(--text-dim)" }}>{a.sub}</div>
                  </div>
                  <span className="activity-time">{relativeTime(a.time)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
