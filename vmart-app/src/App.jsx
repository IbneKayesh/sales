import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./pages/context/AuthContext";
import Layout from "./pages/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ShoppingPage from "./pages/shopping/ShoppingPage";
import FavoritesPage from "./pages/favorites/FavoritesPage";

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
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shopping" element={<ShoppingPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
          </Route>

          {/* Default */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
