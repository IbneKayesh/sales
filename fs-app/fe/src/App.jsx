import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import { useToast, ToastContainer } from "./components/Toast";
import DashboardPage  from "./pages/DashboardPage";
import CustomersPage  from "./pages/CustomersPage";
import ItemsPage      from "./pages/ItemsPage";
import OrdersPage     from "./pages/OrdersPage";
import InvoicesPage   from "./pages/InvoicesPage";
import JsonDocumentsPage from "./pages/JsonDocumentsPage";

const PAGE_META = {
  dashboard:   { title: "Dashboard",             icon: "📊", sub: "Business overview" },
  customers:   { title: "Customers",             icon: "👥", sub: "Manage your customer list" },
  items:       { title: "Items & Products",      icon: "📦", sub: "Product catalog" },
  orders:      { title: "Orders",                icon: "🛒", sub: "Sales orders" },
  invoices:    { title: "Invoices",              icon: "🧾", sub: "Billing & payments" },
  "custom-json": { title: "Custom JSON Documents", icon: "⚙️", sub: "Direct document management & custom JSON entry" },
};

export default function App() {
  const toast = useToast();
  const [page, setPage] = useState("dashboard");
  const [counts, setCounts] = useState({});

  const updateCount = useCallback((key, n) => {
    setCounts((prev) => ({ ...prev, [key]: n }));
  }, []);

  const meta = PAGE_META[page] || PAGE_META.dashboard;

  const sharedProps = { toast };

  return (
    <>
      <Sidebar activePage={page} onNavigate={setPage} counts={counts} />

      <div className="main-wrap">
        {/* Topbar */}
        <header className="topbar">
          <span style={{ fontSize: 18 }}>{meta.icon}</span>
          <div>
            <div className="topbar-title">{meta.title}</div>
          </div>
          <span className="topbar-sub" style={{ marginLeft: 8 }}>{meta.sub}</span>
          <div className="topbar-spacer" />
          <span style={{ fontSize: 12, color: "var(--text-dim)" }}>
            FileBase · file-system storage
          </span>
        </header>

        {/* Pages */}
        <main className="page">
          {page === "dashboard" && (
            <DashboardPage {...sharedProps} onNavigate={setPage} />
          )}
          {page === "customers" && (
            <CustomersPage {...sharedProps} onCountChange={(n) => updateCount("customers", n)} />
          )}
          {page === "items" && (
            <ItemsPage {...sharedProps} onCountChange={(n) => updateCount("items", n)} />
          )}
          {page === "orders" && (
            <OrdersPage {...sharedProps} onCountChange={(n) => updateCount("orders", n)} />
          )}
          {page === "invoices" && (
            <InvoicesPage {...sharedProps} onCountChange={(n) => updateCount("invoices", n)} />
          )}
          {page === "custom-json" && (
            <JsonDocumentsPage {...sharedProps} />
          )}
        </main>
      </div>

      <ToastContainer toasts={toast.toasts} dismiss={toast.dismiss} />
    </>
  );
}
