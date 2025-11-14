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
import BankPage from "./pages/setup/bank/BankPage.jsx";
import BankAccountPage from "./pages/setup/bankaccount/BankAccountPage.jsx";
import BankTransactionPage from "./pages/setup/banktransaction/BankTransactionPage.jsx";
import ItemsPage from "./pages/setup/items/ItemsPage.jsx";
import UnitsPage from "./pages/setup/units/UnitsPage.jsx";
import ContactsPage from "./pages/setup/contacts/ContactsPage.jsx";

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
        <Route path="setup/bank" element={<BankPage />} />
        <Route path="setup/bank-account" element={<BankAccountPage />} />
        <Route path="setup/bank-transaction" element={<BankTransactionPage />} />
        <Route path="setup/items" element={<ItemsPage />} />
        <Route path="setup/units" element={<UnitsPage />} />
        <Route path="setup/contacts" element={<ContactsPage />} />
      </Route>
    </Routes>
  );
}

export default App;
