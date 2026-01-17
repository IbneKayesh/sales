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
import LatestPage from "./pages/LatestPage";
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
import NotesPage from "./pages/support/notes/NotesPage";

import ProfileSettings from "./pages/auth/ProfileSettings";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ToastProvider>
  );
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/latest" element={<LatestPage />} />
      <Route
        path="/login"
        element={user ? <Navigate to="/home" /> : <AuthPage defComp="login" />}
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
        <Route path="support/notes" element={<NotesPage />} />
        {/* <Route path="setup/settings" element={<SettingsPage />} /> */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
