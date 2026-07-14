import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import DesktopLayout from './layouts/DesktopLayout/DesktopLayout';
import LoginPage from './pages/auth/LoginPage';
import FilesPage from './pages/system/FilesPage';
import GalleryPage from './pages/system/GalleryPage';
import SettingsPage from './pages/system/SettingsPage';
import HomePage from './pages/HomePage';
import SalesApp from './pages/sales/SalesApp';
import OrdersPage from './pages/sales/OrdersPage';
import InvoicePage from './pages/sales/InvoicePage';
import DeliveryPage from './pages/sales/DeliveryPage';
import ReportsPage from './pages/sales/ReportsPage';
import InventoryPage from './pages/inventory/InventoryPage';
import PurchasePage from './pages/modules/PurchasePage';
import HRPage from './pages/modules/HRPage';
import CRMPage from './pages/modules/CRMPage';
import DocumentsPage from './pages/system/DocumentsPage';
import TrashPage from './pages/system/TrashPage';
import NotificationPage from './pages/system/NotificationPage';
import ProfilePage from './pages/system/ProfilePage';

import IndexRoutes from "./routes/Index";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DesktopLayout />}>
              <Route path="/" element={null} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/sales" element={<SalesApp />} />
              <Route path="/purchase" element={<PurchasePage />} />
              <Route path="/hr" element={<HRPage />} />
              <Route path="/crm" element={<CRMPage />} />
              <Route path="/inventory" element={<InventoryPage />} />
              <Route path="/sales.orders" element={<OrdersPage />} />
              <Route path="/sales.invoices" element={<InvoicePage />} />
              <Route path="/sales.delivery" element={<DeliveryPage />} />
              <Route path="/sales.reports" element={<ReportsPage />} />
              <Route path="/documents" element={<DocumentsPage />} />
              <Route path="/trash" element={<TrashPage />} />
              <Route path="/notifications" element={<NotificationPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              {IndexRoutes}
              <Route path="*" element={<HomePage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
