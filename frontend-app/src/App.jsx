
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { ToastProvider } from "./hooks/useToast.jsx";

//internal imports
import LandingPage from "./pages/LandingPage";
import Layout from "./pages/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
//auth
import AuthPage from "./pages/auth/AuthPage";
import BusinessPage from "./pages/auth/business/BusinessPage";
import UsersPage from "./pages/auth/users/UsersPage";
import PasswordPage from "./pages/auth/password/PasswordPage";
//crm
import ContactPage from "./pages/crm/contacts/ContactPage.jsx";
//accounts
import AccountsPage from "./pages/accounts/accounts/AccountsPage";
import HeadsPage from "./pages/accounts/heads/HeadsPage";
import LedgerPage from "./pages/accounts/ledger/LedgerPage";
import PayablesPage from "./pages/accounts/payables/PayablesPage";
//inventory
import UnitPage from "./pages/inventory/units/UnitPage";
import CategoryPage from "./pages/inventory/category/CategoryPage";
import ProductsPage from "./pages/inventory/products/ProductsPage";
//support
import GrainsPage from "./pages/support/GrainsPage";
//purchase
import BookingPage from "./pages/purchase/pbooking/BookingPage";
import ReceiptPage from "./pages/purchase/preceipt/ReceiptPage";
import InvoicePage from "./pages/purchase/pinvoice/InvoicePage";
import ReturnPage from "./pages/purchase/preturn/ReturnPage.jsx";
import ReportPage from "./pages/purchase/reports/ReportPage";
import NotesPage from "./pages/support/notes/NotesPage";
import TicketsPage from "./pages/support/tickets/TicketsPage";
import SessionsPage from "./pages/support/SessionsPage.jsx";

// mobile imports
import MobileLayout from "./mobile/layout";
import MobileHome from "./mobile/home";
import MobileAbout from "./mobile/about";
import MobileMenus from "./mobile/menus";

import ProfileSettings from "./pages/auth/ProfileSettings";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const [isMobileView, setIsMobileView] = React.useState(false);

  // Simple toggle for testing - can be hidden or removed in production
  const toggleView = () => setIsMobileView(!isMobileView);

  if (isMobileView) {
    return (
      <Router>
        <MobileLayout>
          {/* Add a floating toggle button to switch back to web */}
          <button
            onClick={toggleView}
            style={{
              position: "fixed",
              top: "10px",
              right: "10px",
              zIndex: 1000,
              padding: "5px 10px",
              borderRadius: "20px",
              backgroundColor: "#6366f1",
              color: "white",
              border: "none",
              fontSize: "0.7rem",
            }}
          >
            Switch to Web
          </button>
          <Routes>
            <Route path="/" element={<MobileHome />} />
            <Route path="/home" element={<MobileHome />} />
            <Route path="/menus" element={<MobileMenus />} />
            <Route path="/about" element={<MobileAbout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MobileLayout>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ position: "relative" }}>
        {/* Toggle button for web view */}
        <button
          onClick={toggleView}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            padding: "10px 15px",
            borderRadius: "30px",
            backgroundColor: "#6366f1",
            color: "white",
            border: "none",
            boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            cursor: "pointer",
          }}
        >
          Mobile View
        </button>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/home" /> : <AuthPage defComp="login" />
            }
          />
          <Route
            path="/home"
            element={user ? <Layout /> : <Navigate to="/login" />}
          >
            <Route index element={<HomePage />} />
            //auth
            <Route path="auth/business" element={<BusinessPage />} />
            <Route path="auth/users" element={<UsersPage />} />
            <Route path="auth/password" element={<PasswordPage />} />
            <Route path="auth/profile" element={<ProfileSettings />} />
            //crm
            <Route path="crm/contact" element={<ContactPage />} />
            //accounts
            <Route path="accounts/accounts" element={<AccountsPage />} />
            <Route path="accounts/heads" element={<HeadsPage />} />
            <Route path="accounts/ledger" element={<LedgerPage />} />
            <Route path="accounts/payables" element={<PayablesPage />} />
            //inventory
            <Route path="inventory/unit" element={<UnitPage />} />
            <Route path="inventory/category" element={<CategoryPage />} />
            <Route path="inventory/products" element={<ProductsPage />} />
            //support
            <Route path="support/grains" element={<GrainsPage />} />
            //purchase
            <Route path="purchase/pbooking" element={<BookingPage />} />
            <Route path="purchase/preceipt" element={<ReceiptPage />} />
            <Route path="purchase/pinvoice" element={<InvoicePage />} />
            <Route path="purchase/preturn" element={<ReturnPage />} />
            <Route path="purchase/preports" element={<ReportPage />} />
            <Route path="support/notes" element={<NotesPage />} />
            <Route path="support/tickets" element={<TicketsPage />} />
            <Route path="support/sessions" element={<SessionsPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
