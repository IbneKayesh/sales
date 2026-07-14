import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import DesktopLayout from '@/layouts/DesktopLayout/DesktopLayout';
import PageLoader from '@/components/PageLoader/PageLoader';
import { APP_ROUTES } from '@/routes/appConfig';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/system/NotFoundPage/NotFoundPage'));

// ── Lazy-loaded page components ──────────────────────────────────────────
// Map each route id to its lazy-loaded page component.
const pageComponents = {
  home:         lazy(() => import('@/pages/HomePage')),
  files:        lazy(() => import('@/pages/system/FilesPage')),
  gallery:      lazy(() => import('@/pages/system/GalleryPage')),
  settings:     lazy(() => import('@/pages/system/SettingsPage')),
  documents:    lazy(() => import('@/pages/system/DocumentsPage')),
  trash:        lazy(() => import('@/pages/system/TrashPage')),
  sales:        lazy(() => import('@/pages/sales/SalesApp')),
  'sales.orders':   lazy(() => import('@/pages/sales/OrdersPage')),
  'sales.invoices': lazy(() => import('@/pages/sales/InvoicePage')),
  'sales.delivery': lazy(() => import('@/pages/sales/DeliveryPage')),
  'sales.reports':  lazy(() => import('@/pages/sales/ReportsPage')),
  inventory:    lazy(() => import('@/pages/inventory/InventoryPage')),
  purchase:     lazy(() => import('@/pages/modules/PurchasePage')),
  hr:           lazy(() => import('@/pages/modules/HRPage')),
  crm:          lazy(() => import('@/pages/modules/CRMPage')),
  profile:      lazy(() => import('@/pages/system/ProfilePage')),
  notifications: lazy(() => import('@/pages/system/NotificationPage')),
};

import IndexRoutes from "@/routes/Index";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<DesktopLayout />}>
                <Route path="/" element={null} />
                <Route path="/home" element={null} />

                {/* Generate routes dynamically from appConfig */}
                {APP_ROUTES.filter((r) => r.id !== 'home').map((route) => {
                  const PageComponent = pageComponents[route.id];
                  if (!PageComponent) return null;
                  return (
                    <Route
                      key={route.id}
                      path={route.url}
                      element={<PageComponent />}
                    />
                  );
                })}

                {IndexRoutes}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
