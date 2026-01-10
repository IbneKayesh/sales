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
        //auth
        <Route path="auth/business" element={<BusinessPage />} />
        <Route path="auth/users" element={<UsersPage />} />
        <Route path="auth/password" element={<PasswordPage />} />
        //crm
        <Route path="crm/contact" element={<ContactPage />} />
        //accounts
        <Route path="accounts/accounts" element={<AccountsPage />} />
        <Route path="accounts/heads" element={<HeadsPage />} />
        <Route path="accounts/ledger" element={<LedgerPage />} />

        //Setup Module
        {/* <Route path="setup/settings" element={<SettingsPage />} /> */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
