import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./pages/context/AuthContext";
import Layout from "./pages/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import ShopPage from "./pages/shop/ShopPage";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth (No Layout) */}
          <Route path="/auth/login" element={<LoginPage />} />

          {/* App (With Layout) */}
          <Route element={<Layout />}>
            <Route path="/shop" element={<ShopPage />} />
          </Route>

          {/* Default */}
          <Route path="*" element={<Navigate to="/shop" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
