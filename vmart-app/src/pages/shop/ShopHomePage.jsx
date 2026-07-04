import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useShop } from "@/context/ShopContext";
import { Plus, TrendingUp } from "lucide-react";
import "./ShopHomePage.css";

const STATUS_BADGE = {
  PENDING:   { bg: "#fffbeb", color: "#d97706" },
  DELIVERED: { bg: "#eff6ff", color: "#2563eb" },
  PAID:      { bg: "#f0fdf4", color: "#16a34a" },
  COMPLETED: { bg: "#f0fdf4", color: "#15803d" },
};

const ShopHomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { invoices, dueInvoices, orders, pendingOrders } = useShop();

  const greetingHour = new Date().getHours();
  const greeting = greetingHour < 12 ? "Good morning" : greetingHour < 17 ? "Good afternoon" : "Good evening";

  const activeInvoices = invoices.filter((i) => ["PENDING", "DELIVERED", "PAID"].includes(i.status));
  const totalDue = dueInvoices.reduce((acc, i) => acc + i.due, 0);

  const quickActions = [
    { label: "New Invoice", icon: "🧾", color: "var(--primary)", bg: "var(--primary-glow)", onClick: () => navigate("/invoice/entry") },
    { label: "Products",    icon: "📦", color: "#10b981",       bg: "#d1fae5",              onClick: () => navigate("/shop/products") },
    { label: "Due Collect", icon: "💰", color: "#d97706",       bg: "#fffbeb",              onClick: () => navigate("/shop/due-collections") },
    { label: "Customers",   icon: "👥", color: "#0284c7",       bg: "#eff6ff",              onClick: () => navigate("/shop/customers") },
  ];

  return (
    <div className="page-container shop-home-page">
      {/* ── Greeting ── */}
      <div className="shop-home-header">
        <div>
          <p className="shop-home-greeting">{greeting} 👋</p>
          <h1 className="shop-home-name">{user?.name || "Shop Owner"}</h1>
        </div>
        <div className="shop-home-avatar">
          {user?.name?.charAt(0) || "S"}
        </div>
      </div>

      <div className="shop-home-content">
        {/* ── Revenue banner ── */}
        <div className="shop-home-due-banner">
          <div className="shop-home-due-label">Total Outstanding Dues</div>
          <div className="shop-home-due-amount">৳{totalDue.toLocaleString()}</div>
          <div className="shop-home-due-badge">
            <TrendingUp size={14} />
            <span>{dueInvoices.length} invoice{dueInvoices.length !== 1 ? "s" : ""} pending collection</span>
          </div>
        </div>

        {/* ── Quick actions ── */}
        <div className="shop-home-quick-actions">
          {quickActions.map(({ label, icon, color, bg, onClick }) => (
            <button key={label} onClick={onClick} className="shop-home-quick-btn">
              <div className="shop-home-quick-icon" style={{ background: bg, color: color }}>{icon}</div>
              <span className="shop-home-quick-label">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Orders needing invoice ── */}
        {pendingOrders.length > 0 && (
          <div className="shop-home-section">
            <div className="shop-home-section-header">
              <span className="shop-home-section-title">Pending Orders</span>
              <span onClick={() => navigate("/invoice/entry")} className="shop-home-section-link">Create →</span>
            </div>
            {pendingOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="shop-home-row">
                <div className="shop-home-row-icon shop-home-row-icon-order">📦</div>
                <div className="shop-home-row-info">
                  <div className="shop-home-row-main">{order.orderNo}</div>
                  <div className="shop-home-row-sub">{order.shopName} · {order.date}</div>
                </div>
                <div className="shop-home-row-right">
                  <div className="shop-home-row-amount">৳{order.total}</div>
                  <span className="shop-home-row-badge" style={{ background: "#fffbeb", color: "#d97706" }}>{order.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Recent invoices ── */}
        <div className="shop-home-section">
          <div className="shop-home-section-header">
            <span className="shop-home-section-title">Recent Invoices</span>
            <span onClick={() => navigate("/invoice/list")} className="shop-home-section-link">View All →</span>
          </div>
          {invoices.slice(0, 4).map((inv) => {
            const badge = STATUS_BADGE[inv.status] || { bg: "#f1f5f9", color: "#64748b" };
            return (
              <div key={inv.id} onClick={() => navigate(`/invoice/view/${inv.id}`)} className="shop-home-row" style={{ cursor: "pointer" }}>
                <div className="shop-home-row-icon shop-home-row-icon-invoice">🧾</div>
                <div className="shop-home-row-info">
                  <div className="shop-home-row-main">{inv.invoiceNo} · {inv.customerName}</div>
                  <div className="shop-home-row-sub">{inv.date}{inv.due > 0 ? ` · Due: ৳${inv.due}` : ""}</div>
                </div>
                <div className="shop-home-row-right">
                  <div className="shop-home-row-amount">৳{inv.total}</div>
                  <span className="shop-home-row-badge" style={{ background: badge.bg, color: badge.color }}>{inv.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FAB ── */}
      <button onClick={() => navigate("/invoice/entry")} className="btn-fab">
        <Plus size={26} />
      </button>
    </div>
  );
};

export default ShopHomePage;
