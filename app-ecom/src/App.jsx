import { BrowserRouter, Routes, Route } from 'react-router-dom';
import '@/index.css';
import '@/App.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Home from '@/pages/Home/Home';
import ProductDetailsPage from '@/pages/ProductDetails/ProductDetailsPage';
import CartPage from '@/pages/Cart/CartPage';
import CheckoutPage from '@/pages/Checkout/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmation/OrderConfirmationPage';
import NotFoundPage from '@/pages/NotFound/NotFoundPage';
import VendorProfilePage from '@/pages/Vendor/VendorProfilePage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <div className="app">
            <div className="app-boxed">
              <Header />
              <div className="app-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product/:slug" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                  <Route path="/seller/:slug" element={<VendorProfilePage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
