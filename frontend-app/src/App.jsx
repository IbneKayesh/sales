import { useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { Toast } from "primereact/toast";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";

//internal imports
import AuthPage from "./pages/auth/AuthPage";
import HomePage from "./pages/HomePage.jsx";
import Layout from "./pages/layout/Layout.jsx";
import UnitPage from "./pages/inventory/units/UnitPage.jsx";
import CategoryPage from "./pages/inventory/category/CategoryPage.jsx";
import ProductPage from "./pages/inventory/products/ProductPage.jsx";
import ContactPage from "./pages/setup/contacts/ContactPage.jsx";
import PurchasePage from "./pages/purchase/PurchasePage.jsx";
import BankAccountPage from "./pages/accounts/bankaccount/BankAccountPage";
import BankPaymentsPage from "./pages/accounts/bankpayments/BankPaymentsPage";
import SalesPage from "./pages/sales/SalesPage.jsx";
import UsersPage from "./pages/setup/users/UsersPage";
import PaymentsPage from "./pages/accounts/payments/PaymentsPage";
import BackupPage from "./pages/setup/backup/BackupPage";
import ChangePasswordPage from "./pages/setup/changepassword/ChangePasswordPage";

function App() {
  const toast = useRef(null);

  return (
    <AuthProvider>
      <Toast ref={toast} />
      <Router>
        <AppRoutes toast={toast} />
      </Router>
    </AuthProvider>
  );
}

function AppRoutes({ toast }) {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            <Navigate to="/home" />
          ) : (
            <AuthPage toast={toast} defComp="login" />
          )
        }
      />
      <Route path="/home" element={user ? <Layout /> : <Navigate to="/" />}>
        <Route index element={<HomePage />} />
        
        <Route path="inventory/unit" element={<UnitPage />} />
        <Route path="inventory/category" element={<CategoryPage />} />
        <Route path="inventory/product" element={<ProductPage />} />
        <Route path="sales" element={<SalesPage />} />
        <Route path="purchase" element={<PurchasePage />} />
        <Route path="accounts/bank-account" element={<BankAccountPage />} />
        <Route path="accounts/bank-payment" element={<BankPaymentsPage />} />
        <Route path="accounts/payable-due" element={<PaymentsPage />} />
        <Route path="setup/contact" element={<ContactPage />} />
        <Route path="setup/users" element={<UsersPage />} />
        <Route path="setup/backup" element={<BackupPage />} />
        <Route path="setup/change-password" element={<ChangePasswordPage />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
