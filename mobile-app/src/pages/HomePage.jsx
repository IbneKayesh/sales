import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  ShoppingCart,
  DollarSign,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Target,
  Activity,
  ChevronRight,
  BarChart2,
  PieChart,
  Bell,
  Star,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

// ────────────────────────────────────────────────────────────
// DATA
// ────────────────────────────────────────────────────────────
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const salesData = [42, 68, 55, 80, 63, 91, 77];
const expenseData = [30, 45, 38, 52, 41, 60, 48];
const monthlyData = [12400, 18700, 15200, 22100, 19800, 24780];

const txns = [
  {
    name: "John Smith",
    avatar: "JS",
    amount: "+$1,275",
    type: "Invoice",
    time: "2h ago",
    up: true,
  },
  {
    name: "Tech Solutions",
    avatar: "TS",
    amount: "+$2,100",
    type: "Payment",
    time: "5h ago",
    up: true,
  },
  {
    name: "Refund – Sarah",
    avatar: "RS",
    amount: "-$450",
    type: "Refund",
    time: "1d ago",
    up: false,
  },
  {
    name: "Robert Brown",
    avatar: "RB",
    amount: "+$85",
    type: "Invoice",
    time: "2d ago",
    up: true,
  },
];

const lowStock = [
  { name: "Blue Pen Box", stock: 3, min: 10, color: "#EF4444" },
  { name: "A4 Paper Ream", stock: 8, min: 20, color: "#F97316" },
  { name: "Ink Cartridge", stock: 2, min: 5, color: "#EF4444" },
];

const recentCustomers = [
  {
    name: "John Smith",
    initials: "JS",
    spent: "$4,280",
    tag: "VIP",
    tagColor: "#F97316",
  },
  {
    name: "Sarah Miller",
    initials: "SM",
    spent: "$1,920",
    tag: "Regular",
    tagColor: "#0F766E",
  },
  {
    name: "Tech Corp",
    initials: "TC",
    spent: "$9,100",
    tag: "VIP",
    tagColor: "#F97316",
  },
  {
    name: "Robert Brown",
    initials: "RB",
    spent: "$430",
    tag: "New",
    tagColor: "#7C3AED",
  },
];

const pendingInvoices = [
  {
    id: "INV-1004",
    customer: "Robert Brown",
    amount: "$85.50",
    days: 5,
    status: "Overdue",
  },
  {
    id: "INV-1002",
    customer: "Sarah Miller",
    amount: "$450.00",
    days: 2,
    status: "Pending",
  },
  {
    id: "INV-1006",
    customer: "City Supplies",
    amount: "$220.00",
    days: 0,
    status: "Pending",
  },
];

// ────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ────────────────────────────────────────────────────────────

const Sparkline = ({ data, color, height = 32 }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 60;
  const h = height;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{ marginLeft: "auto" }}
    >
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
      />
    </svg>
  );
};

const KpiItem = ({
  label,
  value,
  change,
  up,
  icon: Icon,
  iconBg,
  iconColor,
  sparkData,
}) => (
  <div className="kpi-card">
    <div className="kpi-value-row">
      <div className="kpi-icon-bg" style={{ background: iconBg }}>
        <Icon size={18} color={iconColor} />
      </div>
      <Sparkline data={sparkData} color={up ? "#22C55E" : "#EF4444"} />
    </div>
    <div className="kpi-content">
      <div className="kpi-value">{value}</div>
      <div
        className="label-small"
        style={{ fontSize: "12px", marginTop: "2px" }}
      >
        {label}
      </div>
    </div>
    <div className="kpi-trend">
      {up ? (
        <TrendingUp size={12} color="#22C55E" />
      ) : (
        <TrendingDown size={12} color="#EF4444" />
      )}
      <span
        style={{
          fontSize: "11px",
          fontWeight: "700",
          color: up ? "#22C55E" : "#EF4444",
        }}
      >
        {change}
      </span>
    </div>
  </div>
);

const CustomSection = ({ title, children, action, onAction }) => (
  <div className="section-card">
    <div className="section-header">
      <span className="section-title">{title}</span>
      {action && (
        <span onClick={onAction} className="section-action">
          {action}
        </span>
      )}
    </div>
    <div style={{ display: "flex", flexDirection: "column" }}>{children}</div>
  </div>
);

// ────────────────────────────────────────────────────────────
// MAIN DASHBOARD
// ────────────────────────────────────────────────────────────
const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [greetingHour] = useState(new Date().getHours());

  const greeting =
    greetingHour < 12
      ? "Good morning"
      : greetingHour < 17
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="app-container p-2">
      {/* ── GREETING ─────────────────────── */}
      <div className="dashboard-greeting">
        <div>
          <p className="greeting-text">{greeting} 👋</p>
          <h1 className="user-name">
            {user?.emply_ename || "Sales Executive"}
          </h1>
        </div>
        <div
          className="avatar-round"
          style={{ background: "var(--primary-variant)" }}
        >
          JD
        </div>
      </div>

      {/* ── HERO REVENUE BANNER ──────────── */}
      <div className="revenue-banner">
        <div className="revenue-label">Total Revenue (Monthly)</div>
        <div className="revenue-amount">$24,780.00</div>
        <div className="revenue-stats">
          <TrendingUp size={14} />
          <span>+12.5% from last month</span>
        </div>

        <div className="revenue-chart">
          {salesData.map((v, i) => (
            <div key={i} className="chart-bar-container">
              <div
                className="chart-bar"
                style={{
                  height: `${(v / 91) * 30}px`,
                  background:
                    i === salesData.length - 1
                      ? "rgba(255,255,255,1)"
                      : "rgba(255,255,255,0.4)",
                }}
              />
              <span className="chart-label">{DAYS[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUICK ACTIONS ────────────────── */}
      <div style={{ padding: "8px" }}>
        <div className="quick-actions-row">
          {[
            {
              label: "Invoice",
              icon: FileText,
              color: "#0F766E",
              bg: "rgba(15,118,110,0.1)",
              path: "/invoice/entry",
            },
            {
              label: "Payment",
              icon: CreditCard,
              color: "#7C3AED",
              bg: "rgba(124,58,237,0.1)",
              path: "/sales/payments",
            },
            {
              label: "Inventory",
              icon: Package,
              color: "#F97316",
              bg: "rgba(249,115,22,0.1)",
              path: "/products/list",
            },
            {
              label: "Reports",
              icon: BarChart2,
              color: "#DB2777",
              bg: "rgba(219,39,119,0.1)",
              path: "/reports/sales",
            },
            {
              label: "Outlets",
              icon: Users,
              color: "#0F766E",
              bg: "rgba(15,118,110,0.1)",
              path: "/crm/outlets",
            },
          ].map(({ label, icon: Icon, color, bg, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="quick-action-btn"
            >
              <div className="quick-action-icon" style={{ background: bg }}>
                <Icon size={20} color={color} />
              </div>
              <span
                className="label-small"
                style={{ fontSize: "11px", marginTop: "4px" }}
              >
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── KPI GRID ─────────────────────── */}
      <div className="kpi-grid">
        <KpiItem
          label="Orders"
          value="148"
          change="+8.2%"
          up={true}
          icon={ShoppingCart}
          iconBg="rgba(15,118,110,0.1)"
          iconColor="#0F766E"
          sparkData={[30, 42, 35, 54, 48, 62, 58]}
        />
        <KpiItem
          label="Expenses"
          value="$6,240"
          change="-3.1%"
          up={false}
          icon={DollarSign}
          iconBg="rgba(239,68,68,0.1)"
          iconColor="#EF4444"
          sparkData={[55, 48, 60, 52, 44, 50, 42]}
        />
      </div>

      {/* ── MONTHLY TARGET ───────────────── */}
      <div className="card">
        <div className="dashboard-progress-header">
          <div>
            <h3>Monthly Goal</h3>
            <p className="item-sub-text">Feb 2026</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="dashboard-progress-val">78%</span>
          </div>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: "78%" }} />
        </div>
        <div className="dashboard-progress-footer">
          <span className="label-small">$24.7k Achieved</span>
          <span className="label-small">$31.5k Target</span>
        </div>
      </div>

      {/* ── PENDING INVOICES ─────────────── */}
      <CustomSection
        title="Overdue Invoices"
        action="View All"
        onAction={() => navigate("/invoice/list")}
      >
        {pendingInvoices.map((inv) => (
          <div key={inv.id} className="activity-item">
            <div
              className={`activity-icon ${inv.status === "Overdue" ? "status-overdue" : "status-pending"}`}
            >
              <Clock size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="item-main-text" style={{ fontSize: "14px" }}>
                {inv.id} · {inv.customer}
              </div>
              <p className="item-sub-text">{inv.days} days overdue</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="value-bold" style={{ fontSize: "15px" }}>
                {inv.amount}
              </div>
              <span
                className={`badge-chip ${inv.status === "Overdue" ? "status-overdue" : "status-pending"}`}
                style={{ marginTop: "4px", display: "inline-block" }}
              >
                {inv.status}
              </span>
            </div>
          </div>
        ))}
      </CustomSection>

      {/* ── RECENT CUSTOMERS ─────────────── */}
      <CustomSection
        title="Top Customers"
        action="View All"
        onAction={() => navigate("/crm/outlets")}
      >
        {recentCustomers.slice(0, 3).map((c, i) => (
          <div key={i} className="activity-item">
            <div
              className="avatar-round"
              style={{ width: "40px", height: "40px", fontSize: "14px" }}
            >
              {c.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div className="item-main-text" style={{ fontSize: "14px" }}>
                {c.name}
              </div>
              <p className="item-sub-text">Total spent: {c.spent}</p>
            </div>
            <div
              className={`badge-chip`}
              style={{ background: `${c.tagColor}15`, color: c.tagColor }}
            >
              {c.tag}
            </div>
          </div>
        ))}
      </CustomSection>

      {/* ── TRANSACTIONS ─────────────────── */}
      <CustomSection title="Recent Activity">
        {txns.slice(0, 3).map((t, i) => (
          <div key={i} className="activity-item">
            <div
              className={`activity-icon`}
              style={{
                background: t.up
                  ? "rgba(34,197,94,0.1)"
                  : "rgba(239,68,68,0.1)",
                color: t.up ? "#22C55E" : "#EF4444",
              }}
            >
              {t.up ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            </div>
            <div style={{ flex: 1 }}>
              <div className="item-main-text" style={{ fontSize: "14px" }}>
                {t.name}
              </div>
              <p className="item-sub-text">
                {t.type} · {t.time}
              </p>
            </div>
            <div
              className="value-bold"
              style={{ color: t.up ? "#22C55E" : "#EF4444" }}
            >
              {t.amount}
            </div>
          </div>
        ))}
      </CustomSection>

      <button onClick={() => navigate("/invoice/entry")} className="btn-fab">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default HomePage;
