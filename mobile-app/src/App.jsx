import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "primereact/resources/themes/lara-light-teal/theme.css"; // Choose your theme
import "primereact/resources/primereact.min.css"; // Core CSS
import "primeicons/primeicons.css"; // Icons
import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";

//
import Layout from "./pages/layouts/Layout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/auth/LoginPage";

//sales
import OrderPage from "./pages/sales/orders/OrderPage";




import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ModulePage from "./pages/ModulePage";
import PaymentList from "./pages/sales/PaymentList";
import OutletsPage from "./pages/crm/outlets/OutletsPage";
import ProductList from "./pages/products/ProductList";
import AddProduct from "./pages/products/AddProduct";
import Categories from "./pages/products/Categories";
import StockLevels from "./pages/products/StockLevels";
import ChartOfAccounts from "./pages/accounts/ChartOfAccounts";
import Transactions from "./pages/accounts/Transactions";
import Expenses from "./pages/accounts/Expenses";
import Payables from "./pages/accounts/Payables";
import SalesReport from "./pages/reports/SalesReport";
import StockReport from "./pages/reports/StockReport";
import AccountReport from "./pages/reports/AccountReport";
import DailySummary from "./pages/reports/DailySummary";
import InvoiceEntry from "./pages/invoice/InvoiceEntry";
import InvoiceList from "./pages/invoice/InvoiceList";
import InvoiceView from "./pages/invoice/InvoiceView";
import InvoicePrint from "./pages/invoice/InvoicePrint";
import { ThemeProvider } from "./context/ThemeContext";
import { ModuleProvider } from "./context/ModuleContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";
//sales
import OrderList from "./pages/sales/orders/OrderList";

// Placeholder pages for module routes not yet built
const Placeholder = ({ title }) => (
  <div className="app-container">
    <div className="card" style={{ textAlign: "center", padding: "40px 20px" }}>
      <div style={{ fontSize: "48px", marginBottom: "12px" }}>🚧</div>
      <h3 style={{ color: "var(--on-surface)", margin: "0 0 8px" }}>{title}</h3>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
        Coming soon
      </p>
    </div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <ModuleProvider>
        <ToastProvider>
          <AuthProvider>
            <Router>
              <Routes>
                <Route path="/" element={<Layout />}>
                  {/* Core */}
                  <Route index element={<HomePage />} />
                  <Route path="modules" element={<ModulePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route
                    path="profile/change-password"
                    element={<ChangePasswordPage />}
                  />
                  <Route path="settings" element={<SettingsPage />} />

                  {/* Sales */}
                  <Route path="sales/orders" element={<OrderPage />} />
                  <Route path="invoice/list" element={<InvoiceList />} />
                  <Route path="invoice/entry" element={<InvoiceEntry />} />
                  <Route path="invoice/view/:id" element={<InvoiceView />} />
                  <Route path="invoice/print/:id" element={<InvoicePrint />} />
                  <Route path="sales/payments" element={<PaymentList />} />
                  <Route path="crm/outlets" element={<OutletsPage />} />
                

                  {/* Products */}
                  <Route path="products/list" element={<ProductList />} />
                  <Route path="products/add" element={<AddProduct />} />
                  <Route path="products/categories" element={<Categories />} />
                  <Route path="products/stock" element={<StockLevels />} />

                  {/* Accounts */}
                  <Route path="accounts/chart" element={<ChartOfAccounts />} />
                  <Route
                    path="accounts/transactions"
                    element={<Transactions />}
                  />
                  <Route path="accounts/expenses" element={<Expenses />} />
                  <Route path="accounts/payables" element={<Payables />} />

                  {/* Reports */}
                  <Route path="reports/sales" element={<SalesReport />} />
                  <Route path="reports/stock" element={<StockReport />} />
                  <Route path="reports/accounts" element={<AccountReport />} />
                  <Route path="reports/daily" element={<DailySummary />} />
                </Route>

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
              </Routes>
            </Router>
          </AuthProvider>
        </ToastProvider>
      </ModuleProvider>
    </ThemeProvider>
  );
}

export default App;
