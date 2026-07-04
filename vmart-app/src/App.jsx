import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "primeflex/themes/primeone-light.css";
import "./App.css";

import { ThemeProvider } from "./context/ThemeContext";
import { ModuleProvider } from "./context/ModuleContext";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { ShopProvider } from "./context/ShopContext";
import { WishlistProvider } from "./context/WishlistContext";
import ErrorBoundary from "./components/ErrorBoundary";

import Layout from "./pages/layouts/Layout";
import LoginPage from "./pages/auth/LoginPage";
import NotFoundComp from "./components/NotFoundComp";

import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ModulePage from "./pages/ModulePage";

import CartPage from "./pages/customer/CartPage";
import CheckoutPage from "./pages/customer/CheckoutPage";
import CustomerOrdersPage from "./pages/customer/CustomerOrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import ProductDetailPage from "./pages/customer/ProductDetailPage";
import WishlistPage from "./pages/customer/WishlistPage";
import ShopsPage from "./pages/customer/ShopsPage";
import CustomerInvoices from "./pages/customer/CustomerInvoices";
import CustomerInvoiceDetail from "./pages/customer/CustomerInvoiceDetail";

import InvoiceList from "./pages/invoice/InvoiceList";
import InvoiceEntry from "./pages/invoice/InvoiceEntry";
import InvoiceView from "./pages/invoice/InvoiceView";
import InvoicePrint from "./pages/invoice/InvoicePrint";
import DueCollectionsPage from "./pages/shop/DueCollectionsPage";
import CustomerInfoPage from "./pages/shop/CustomerInfoPage";
import ShopProducts from "./pages/shop/ShopProducts";

const RoleContextWrapper = ({ children }) => {
  const { user } = useAuth();

  if (user?.role === "CUSTOMER") {
    return (
      <CartProvider customerId={user.id}>
        <WishlistProvider customerId={user.id}>{children}</WishlistProvider>
      </CartProvider>
    );
  }

  if (user?.role === "SHOP") {
    return <ShopProvider shopId={user.shopId || 1}>{children}</ShopProvider>;
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider>
      <ModuleProvider>
        <ToastProvider>
          <AuthProvider>
            <ErrorBoundary>
              <Router>
                <Routes>
                  <Route path="/login" element={<LoginPage />} />

                  <Route
                    path="/"
                    element={
                      <RoleContextWrapper>
                        <Layout />
                      </RoleContextWrapper>
                    }
                  >
                    <Route index element={<HomePage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="profile/change-password" element={<ChangePasswordPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="modules" element={<ModulePage />} />

                    <Route path="customer/cart" element={<CartPage />} />
                    <Route path="customer/checkout/:shopId" element={<CheckoutPage />} />
                    <Route path="customer/orders" element={<CustomerOrdersPage />} />
                    <Route path="customer/orders/:id" element={<OrderDetailPage />} />
                    <Route path="customer/products/:id" element={<ProductDetailPage />} />
                    <Route path="customer/wishlist" element={<WishlistPage />} />
                    <Route path="customer/shops" element={<ShopsPage />} />
                    <Route path="customer/invoices" element={<CustomerInvoices />} />
                    <Route path="customer/invoices/:id" element={<CustomerInvoiceDetail />} />

                    <Route path="invoice/list" element={<InvoiceList />} />
                    <Route path="invoice/entry" element={<InvoiceEntry />} />
                    <Route path="invoice/view/:id" element={<InvoiceView />} />
                    <Route path="invoice/print/:id" element={<InvoicePrint />} />
                    <Route path="shop/due-collections" element={<DueCollectionsPage />} />
                    <Route path="shop/customers" element={<CustomerInfoPage />} />
                    <Route path="shop/products" element={<ShopProducts />} />
                  </Route>

                  <Route path="*" element={<NotFoundComp />} />
                </Routes>
              </Router>
            </ErrorBoundary>
          </AuthProvider>
        </ToastProvider>
      </ModuleProvider>
    </ThemeProvider>
  );
}

export default App;
