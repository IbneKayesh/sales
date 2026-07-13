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
  loadHr,
  loadAccounting,
  loadCrm,
  loadManufacturing,
  loadProjects,
  loadSupplyChain,
  loadAssets,
  loadSettings,
  loadNewOrder,
  loadReturns,
  loadNewPurchase,
  loadCategories,
  loadModalDemo,
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
const Hr = lazy(loadHr);
const Accounting = lazy(loadAccounting);
const Crm = lazy(loadCrm);
const Manufacturing = lazy(loadManufacturing);
const Projects = lazy(loadProjects);
const SupplyChain = lazy(loadSupplyChain);
const Assets = lazy(loadAssets);
const Settings = lazy(loadSettings);
const NewOrder = lazy(loadNewOrder);
const Returns = lazy(loadReturns);
const NewPurchase = lazy(loadNewPurchase);
const Categories = lazy(loadCategories);
const ModalDemo = lazy(loadModalDemo);

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
                <Route path="/" element={<Dashboard />} />
                {/* Sales — sub-routes BEFORE :id to avoid param capture */}
                <Route path="/sales/create" element={<NewOrder />} />
                <Route path="/sales/returns" element={<Returns />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/sales/:id" element={<OrderDetail />} />
                {/* Purchase — sub-routes BEFORE :id */}
                <Route path="/purchase/create" element={<NewPurchase />} />
                <Route path="/purchase" element={<Purchase />} />
                <Route path="/purchase/:id" element={<PODetail />} />
                {/* Inventory — sub-routes BEFORE :id */}
                <Route path="/inventory/categories" element={<Categories />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/inventory/:id" element={<ProductDetail />} />
                <Route path="/reports" element={<Dashboard />} />
                <Route path="/hr" element={<Hr />} />
                <Route path="/accounting" element={<Accounting />} />
                <Route path="/crm" element={<Crm />} />
                <Route path="/manufacturing" element={<Manufacturing />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/supplychain" element={<SupplyChain />} />
                <Route path="/assets" element={<Assets />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/demo/modals" element={<ModalDemo />} />
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
