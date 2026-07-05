import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye } from "lucide-react";
import { useShop } from "@/context/ShopContext";
import "./InvoiceList.css";

const ALL_STATUSES = ["ALL", "PENDING", "DELIVERED", "PAID", "COMPLETED"];

const STATUS_BADGE = {
  PENDING:   { bg: "#fffbeb", color: "#d97706" },
  DELIVERED: { bg: "#eff6ff", color: "#2563eb" },
  PAID:      { bg: "#f0fdf4", color: "#16a34a" },
  COMPLETED: { bg: "#dcfce7", color: "#15803d" },
};

const InvoiceList = () => {
  const navigate = useNavigate();
  const { invoices, dueInvoices } = useShop();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = invoices.filter((inv) => {
    const matchStatus = filter === "ALL" || inv.status === filter;
    const matchSearch = !search ||
      inv.invoiceNo.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const totalDue = dueInvoices.reduce((acc, i) => acc + i.due, 0);

  return (
    <div className="app-container invoice-list-page">
      <div className="invoice-list-header">
        <div className="invoice-list-header-row">
          <h2 className="invoice-list-title">Invoices</h2>
          <button onClick={() => navigate("/invoice/entry")} className="invoice-list-new-btn">
            <Plus size={16} /> New
          </button>
        </div>

        {totalDue > 0 && (
          <div className="invoice-list-due-banner">
            <div>
              <div className="invoice-list-due-label">Total Due Amount</div>
              <div className="invoice-list-due-val">৳{totalDue.toLocaleString()}</div>
            </div>
            <button onClick={() => navigate("/shop/due-collections")} className="invoice-list-collect-btn">
              Collect Dues
            </button>
          </div>
        )}

        <div className="invoice-list-search-wrap">
          <Search size={16} color="#94a3b8" className="invoice-list-search-icon" />
          <input type="text" placeholder="Search invoice or customer..."
            className="invoice-list-search-input"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="invoice-list-filters">
        {ALL_STATUSES.map((s) => {
          const active = filter === s;
          const badge = STATUS_BADGE[s] || {};
          return (
            <button key={s} onClick={() => setFilter(s)}
              className="invoice-list-filter-btn"
              style={{
                background: active ? (badge.color || "var(--primary)") : "var(--surface)",
                color: active ? "#fff" : (badge.color || "var(--on-surface)"),
                borderColor: active ? (badge.color || "var(--primary)") : "var(--border)",
              }}>{s}</button>
          );
        })}
      </div>

      <div className="invoice-list-items">
        {filtered.map((inv) => {
          const badge = STATUS_BADGE[inv.status] || { bg: "#f1f5f9", color: "#64748b" };
          return (
            <div key={inv.id} className="card invoice-list-card"
              onClick={() => navigate(`/invoice/view/${inv.id}`)}>
              <div className="invoice-list-card-top">
                <div className="invoice-list-card-left">
                  <div className="invoice-list-card-no">{inv.invoiceNo}</div>
                  <div className="invoice-list-card-name">{inv.customerName}</div>
                  <div className="invoice-list-card-date">{inv.date}</div>
                  {inv.due > 0 && <div className="invoice-list-card-due">Due: ৳{inv.due}</div>}
                </div>
                <div className="invoice-list-card-right">
                  <div className="invoice-list-card-total">৳{inv.total}</div>
                  <span className="invoice-list-card-badge" style={{ background: badge.bg, color: badge.color }}>
                    {inv.status}
                  </span>
                </div>
              </div>
              <div className="invoice-list-card-actions">
                <button className="invoice-list-view-btn"
                  onClick={(e) => { e.stopPropagation(); navigate(`/invoice/view/${inv.id}`); }}>
                  <Eye size={15} /> View
                </button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="invoice-list-empty">
            <div className="invoice-list-empty-icon">📄</div>
            <p>No invoices found</p>
          </div>
        )}
      </div>

      <button className="btn-fab" onClick={() => navigate("/invoice/entry")}>
        <Plus size={24} />
      </button>
    </div>
  );
};

export default InvoiceList;
