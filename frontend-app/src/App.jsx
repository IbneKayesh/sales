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
import { ViewProvider, useView } from "./hooks/useView.jsx";

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
import FieldroutePage from "./pages/crm/fieldroute/FieldroutePage.jsx";



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
//support
import NotesPage from "./pages/support/notes/NotesPage";
import TicketsPage from "./pages/support/tickets/TicketsPage";
import SessionsPage from "./pages/support/SessionsPage.jsx";

// mobile imports
import MobileLayout from "./mobile/layout";
import MobileHome from "./mobile/home";
import MobileAbout from "./mobile/about";
import MobileMenus from "./mobile/menus";
import MobileSample from "./mobile/sample";

import ProfileSettings from "./pages/auth/ProfileSettings";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <ViewProvider>
          <AppRoutes />
        </ViewProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  const { isMobileView } = useView();

  if (isMobileView) {
    return (
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<MobileHome />} />
            <Route path="/home" element={<MobileHome />} />
            <Route path="/menus" element={<MobileMenus />} />
            <Route path="/sample" element={<MobileSample />} />
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
            <Route path="crm/field-route" element={<FieldroutePage />} />
            
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
            //support
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
