import React, { useRef } from "react";
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
import Layout from "./pages/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import PrequestPage from "./pages/prequest/PrequestPage.jsx";
import SrequestPage from "./pages/srequest/SrequestPage.jsx";
import BankPage from "./pages/accounts/bank/BankPage.jsx";
import BankAccountPage from "./pages/accounts/bankaccount/BankAccountPage.jsx";
import BankTransactionPage from "./pages/accounts/banktransaction/BankTransactionPage.jsx";
import ItemsPage from "./pages/inventory/items/ItemsPage.jsx";
import UnitsPage from "./pages/inventory/units/UnitsPage.jsx";
import CategoryPage from "./pages/inventory/category/CategoryPage.jsx";
import ContactsPage from "./pages/setup/contacts/ContactsPage.jsx";
import UsersPage from "./pages/setup/users/UsersPage.jsx";
import ChangePasswordPage from "./pages/setup/changepassword/ChangePasswordPage.jsx";
import ClosingProcessPage from "./pages/setup/closingprocess/ClosingProcessPage.jsx";

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
        <Route path="prequest" element={<PrequestPage />} />
        <Route path="srequest" element={<SrequestPage />} />
        <Route path="accounts/bank" element={<BankPage />} />
        <Route path="accounts/bank-account" element={<BankAccountPage />} />
        <Route path="accounts/bank-transaction" element={<BankTransactionPage />} />
        <Route path="inventory/items" element={<ItemsPage />} />
        <Route path="inventory/units" element={<UnitsPage />} />
        <Route path="inventory/category" element={<CategoryPage />} />
        <Route path="setup/contacts" element={<ContactsPage />} />
        <Route path="setup/users" element={<UsersPage />} />
        <Route path="setup/change-password" element={<ChangePasswordPage />} />
        <Route path="setup/closing-process" element={<ClosingProcessPage />} />
      </Route>
    </Routes>
  );
}

export default App;
