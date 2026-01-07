import { useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { ToastProvider } from "./hooks/useToast.jsx"; // [NEW]

//internal imports
import AuthPage from "./pages/auth/AuthPage";
import BusinessPage from "./pages/auth/business/BusinessPage";






import HomePage from "./pages/HomePage.jsx";
import Layout from "./pages/layout/Layout.jsx";
import UnitPage from "./pages/inventory/units/UnitPage.jsx";
import CategoryPage from "./pages/inventory/category/CategoryPage.jsx";
import ProductPage from "./pages/inventory/products/ProductPage.jsx";
import ContactPage from "./pages/setup/contacts/ContactPage.jsx";
import SalesPage from "./pages/sales/SalesPage.jsx";
import UsersPage from "./pages/setup/users/UsersPage";
import BackupPage from "./pages/setup/backup/BackupPage";
import ChangePasswordPage from "./pages/setup/changepassword/ChangePasswordPage";
import BankPage from "./pages/accounts/banks/BankPage.jsx";
import LedgerPage from "./pages/accounts/ledger/LedgerPage.jsx";
import PayablesPage from "./pages/accounts/payables/PayablesPage";

//Purchase Module
import PurchaseBookingPage from "./pages/purchase/pobooking/PoBookingPage.jsx";
import PurchaseInvoicePage from "./pages/purchase/poinvoice/PoInvoicePage.jsx";
import PurchaseOrderPage from "./pages/purchase/poorder/PoOrderPage.jsx";
import PurchaseReturnPage from "./pages/purchase/poreturn/PoReturnPage.jsx";

//Setup Module
import SettingsPage from "./pages/setup/settings/SettingsPage.jsx";

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
      <Route
        path="/"
        element={user ? <Navigate to="/home" /> : <AuthPage defComp="login" />}
      />
      <Route path="/home" element={user ? <Layout /> : <Navigate to="/" />}>
        <Route index element={<HomePage />} />
        <Route path="auth/business" element={<BusinessPage />} />


        <Route path="inventory/unit" element={<UnitPage />} />
        <Route path="inventory/category" element={<CategoryPage />} />
        <Route path="inventory/product" element={<ProductPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="accounts/ledger" element={<LedgerPage />} />
        <Route path="accounts/banks" element={<BankPage />} />
        <Route path="accounts/payables" element={<PayablesPage />} />
        <Route path="accounts/receivables" element={<Navigate to="/" />} />
        <Route path="setup/contact" element={<ContactPage />} />
        <Route path="setup/users" element={<UsersPage />} />
        <Route path="setup/backup" element={<BackupPage />} />
        <Route path="setup/change-password" element={<ChangePasswordPage />} />
        //Purchase Module
        <Route
          path="purchase/purchase-booking"
          element={<PurchaseBookingPage />}
        />
        <Route
          path="purchase/purchase-invoice"
          element={<PurchaseInvoicePage />}
        />
        <Route path="purchase/purchase-order" element={<PurchaseOrderPage />} />
        <Route
          path="purchase/purchase-return"
          element={<PurchaseReturnPage />}
        />
        //Setup Module
        <Route path="setup/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
