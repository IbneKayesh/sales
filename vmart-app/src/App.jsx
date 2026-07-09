import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import { AuthProvider, useAuth } from "./pages/context/AuthContext";
import { UIProvider } from "./pages/context/UIContext";
import Layout from "./pages/layout/Layout";
import { seedSampleData } from "./seedData";
import LoginPage from "./pages/auth/LoginPage";
import CustomerProfilePage from "./pages/auth/CustomerProfilePage";
import ShopProfilePage from "./pages/auth/ShopProfilePage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ShoppingPage from "./pages/shopping/ShoppingPage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import OrderPage from "./pages/order/OrderPage";
import CustomerPage from "./pages/customer/CustomerPage";
import ProductPage from "./pages/product/ProductPage";
import InvoicePage from "./pages/invoice/InvoicePage";
import InvoiceReceiptPage from "./pages/invoice/InvoiceReceiptPage";
import CartPage from "./pages/cart/CartPage";
import InvoiceCollectionPage from "./pages/invoice/InvoiceCollectionPage";

import "./App.css";

/* ── Protected route wrapper ── */
function ProtectedRoute() {
  const { user } = useAuth();
  //console.log("user",user)
  if (!user) return <Navigate to="/auth/login" replace />;
  return <Outlet />;
}

function App() {
  return (
    <UIProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth (No Layout) */}
            <Route path="/auth/login" element={<LoginPage />} />

            {/* Protected: requires authentication */}
            <Route element={<ProtectedRoute />}>
              {/* App (With Layout) */}
              <Route element={<Layout />}>
                <Route
                  path="/customer-profile"
                  element={<CustomerProfilePage />}
                />
                <Route path="/shop-profile" element={<ShopProfilePage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shopping" element={<ShoppingPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/order" element={<OrderPage />} />
                <Route path="/customers" element={<CustomerPage />} />
                <Route path="/products" element={<ProductPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/invoice" element={<InvoicePage />} />
                <Route
                  path="/invoice/:invoiceNumber"
                  element={<InvoiceReceiptPage />}
                />
                <Route
                  path="/invoice-collections"
                  element={<InvoiceCollectionPage />}
                />
              </Route>
            </Route>

            {/* Default */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </UIProvider>
  );
}

export default App;
