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
//crm
import ContactPage from "./pages/crm/contacts/ContactPage.jsx";
import FieldroutePage from "./pages/crm/fieldroute/FieldroutePage";
//hrms
import EmployeesPage from "./pages/hrms/employee/EmployeesPage.jsx";

//accounts
import AccountsPage from "./pages/accounts/accounts/AccountsPage";
import HeadsPage from "./pages/accounts/heads/HeadsPage";
import LedgerPage from "./pages/accounts/ledger/LedgerPage";
import PayablesPage from "./pages/accounts/payables/PayablesPage";
import ExpensesPage from "./pages/accounts/expneses/ExpensesPage";
//inventory
import UnitPage from "./pages/inventory/units/UnitPage";
import CategoryPage from "./pages/inventory/category/CategoryPage";
import ProductsPage from "./pages/inventory/products/ProductsPage";
import StockReportsPage from "./pages/inventory/stockreports/StockReportsPage";
import TransferPage from "./pages/inventory/itransfer/TransferPage";
//support
import GrainsPage from "./pages/support/GrainsPage";
//purchase
import BookingPage from "./pages/purchase/pbooking/BookingPage";
import ReceiptPage from "./pages/purchase/preceipt/ReceiptPage";
import InvoicePage from "./pages/purchase/pinvoice/InvoicePage";
//sales
import SInvoicePage from "./pages/sales/sinvoice/SInvoicePage";
//support
import NotesPage from "./pages/support/notes/NotesPage";
import TicketsPage from "./pages/support/tickets/TicketsPage";
import SessionsPage from "./pages/support/SessionsPage.jsx";

//setup
import DatabasePage from "./pages/setup/database/DatabasePage.jsx";
import BusinessPage from "./pages/setup/business/BusinessPage.jsx";
import UsersPage from "./pages/setup/users/UsersPage.jsx";
import ProfileSettings from "./pages/setup/users/ProfileSettings.jsx";
import PasswordPage from "./pages/setup/users/PasswordPage.jsx";

// mobile imports
import MobileLayout from "./mobile/layout";
import MobileHome from "./mobile/home";
import MobileAbout from "./mobile/about";
import MobileMenus from "./mobile/menus";
import MobileSample from "./mobile/sample";

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
  const { user, isMobileView } = useAuth();

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
            //crm
            <Route path="crm/contact" element={<ContactPage />} />
            <Route path="crm/field-route" element={<FieldroutePage />} />
            //hrms
            <Route path="hrms/employees" element={<EmployeesPage />} />
            //accounts
            <Route path="accounts/accounts" element={<AccountsPage />} />
            <Route path="accounts/heads" element={<HeadsPage />} />
            <Route path="accounts/ledger" element={<LedgerPage />} />
            <Route path="accounts/payables" element={<PayablesPage />} />
            <Route path="accounts/expenses" element={<ExpensesPage />} />
            //inventory
            <Route path="inventory/unit" element={<UnitPage />} />
            <Route path="inventory/category" element={<CategoryPage />} />
            <Route path="inventory/products" element={<ProductsPage />} />
            <Route
              path="inventory/stockreports"
              element={<StockReportsPage />}
            />
            <Route path="inventory/itransfer" element={<TransferPage />} />
            //support
            <Route path="support/grains" element={<GrainsPage />} />
            //purchase
            <Route path="purchase/pbooking" element={<BookingPage />} />
            <Route path="purchase/preceipt" element={<ReceiptPage />} />
            <Route path="purchase/pinvoice" element={<InvoicePage />} />
            //sales
            <Route path="sales/sinvoice" element={<SInvoicePage />} />
            //support
            <Route path="support/notes" element={<NotesPage />} />
            <Route path="support/tickets" element={<TicketsPage />} />
            <Route path="support/sessions" element={<SessionsPage />} />
            //setup
            <Route path="setup/database" element={<DatabasePage />} />
            <Route path="setup/business" element={<BusinessPage />} />
            <Route path="setup/users" element={<UsersPage />} />
            <Route path="setup/users/profile" element={<ProfileSettings />} />
            <Route path="setup/users/password" element={<PasswordPage />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
