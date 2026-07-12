import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PageLoader from './components/ui/PageLoader';
import { RetryableBoundary } from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import { AuthProvider } from './context/AuthContext';
import ConfirmDialog from './components/ui/ConfirmDialog';
import { SlidePanelProvider } from './components/ui/SlidePanel';
import {
  loadDashboard,
  loadSales,
  loadPurchase,
  loadInventory,
  loadLogin,
  loadNotFound,
  loadOrderDetail,
  loadProductDetail,
  loadPODetail,
} from './config/loaders';
import { preloadPriority } from './utils/preload';
import './App.css';

// Lazy-loaded page components — all import functions come from the
// centralized config/loaders.js so preload.js shares the same references.
const Dashboard = lazy(loadDashboard);
const Sales = lazy(loadSales);
const Purchase = lazy(loadPurchase);
const Inventory = lazy(loadInventory);
const Login = lazy(loadLogin);
const NotFound = lazy(loadNotFound);
const OrderDetail = lazy(loadOrderDetail);
const ProductDetail = lazy(loadProductDetail);
const PODetail = lazy(loadPODetail);

function App() {
  // Preload likely first-click pages after initial mount
  useEffect(() => {
    preloadPriority([
      ['/sales', '/inventory'],   // Priority 1 — most likely next clicks
      ['/purchase'],              // Priority 2 — preload after a delay
    ]);
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <SlidePanelProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/login" element={<RetryableBoundary><Login /></RetryableBoundary>} />

              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route path="/" element={<RetryableBoundary><Dashboard /></RetryableBoundary>} />
                <Route path="/sales" element={<RetryableBoundary><Sales /></RetryableBoundary>} />
                <Route path="/sales/:id" element={<RetryableBoundary><OrderDetail /></RetryableBoundary>} />
                <Route path="/purchase" element={<RetryableBoundary><Purchase /></RetryableBoundary>} />
                <Route path="/purchase/:id" element={<RetryableBoundary><PODetail /></RetryableBoundary>} />
                <Route path="/inventory" element={<RetryableBoundary><Inventory /></RetryableBoundary>} />
                <Route path="/inventory/:id" element={<RetryableBoundary><ProductDetail /></RetryableBoundary>} />
                <Route path="/reports" element={<RetryableBoundary><Dashboard /></RetryableBoundary>} />
              </Route>

              <Route path="*" element={<RetryableBoundary><NotFound /></RetryableBoundary>} />
            </Routes>
          </Suspense>
          <ConfirmDialog />
        </SlidePanelProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
