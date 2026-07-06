import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./pages/context/AuthContext";
import { UIProvider } from "./pages/context/UIContext";
import Layout from "./pages/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import HomePage from "./pages/HomePage";
import ShopPage from "./pages/shop/ShopPage";
import ShoppingPage from "./pages/shopping/ShoppingPage";
import FavoritesPage from "./pages/favorites/FavoritesPage";
import OrderPage from "./pages/order/OrderPage";
import CustomerPage from "./pages/customer/CustomerPage";
import ProductPage from "./pages/product/ProductPage";
import InvoicePage from "./pages/invoice/InvoicePage";
import CartPage from "./pages/cart/CartPage";
import InvoiceCollectionPage from "./pages/invoice/InvoiceCollectionPage";

import "./App.css";

function App() {
  return (
    <UIProvider>
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
            <Route path="/order" element={<OrderPage />} />
            <Route path="/customers" element={<CustomerPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/invoice" element={<InvoicePage />} />
            <Route path="/invoice-collections" element={<InvoiceCollectionPage />} />
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
