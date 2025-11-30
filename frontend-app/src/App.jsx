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
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
