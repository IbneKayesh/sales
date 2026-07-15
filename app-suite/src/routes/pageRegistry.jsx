// ── Page Component Registry ───────────────────────────────────────────────
// Single source of truth: all page components are imported here and exported
// via lookup functions. Add a new page in ONE place instead of two.
// ──────────────────────────────────────────────────────────────────────────

import React, { lazy } from 'react';

// ── Static imports (for direct window rendering) ──────────────────────────
import HomePage from '@/pages/HomePage';
import FilesPage from '@/pages/system/FilesPage';
import GalleryPage from '@/pages/system/GalleryPage';
import SettingsPage from '@/pages/system/SettingsPage';
import DocumentsPage from '@/pages/system/DocumentsPage';
import TrashPage from '@/pages/system/TrashPage';
import SalesApp from '@/pages/sales/SalesApp';
import OrdersPage from '@/pages/sales/OrdersPage';
import InvoicePage from '@/pages/sales/InvoicePage';
import DeliveryPage from '@/pages/sales/DeliveryPage';
import ReportsPage from '@/pages/sales/ReportsPage';
import InventoryPage from '@/pages/inventory/InventoryPage';
import ProductsPage from '@/pages/products/ProductsPage';
import PurchasePage from '@/pages/modules/PurchasePage';
import HRPage from '@/pages/modules/HRPage';
import CRMPage from '@/pages/modules/CRMPage';
import ProfilePage from '@/pages/system/ProfilePage';
import NotificationPage from '@/pages/system/NotificationPage';

// ── Components map (static JSX for window rendering) ──────────────────────
const PAGE_ELEMENTS = {
  home:              <HomePage />,
  files:             <FilesPage />,
  gallery:           <GalleryPage />,
  settings:          <SettingsPage />,
  documents:         <DocumentsPage />,
  trash:             <TrashPage />,
  sales:             <SalesApp />,
  'sales.orders':    <OrdersPage />,
  'sales.invoices':  <InvoicePage />,
  'sales.delivery':  <DeliveryPage />,
  'sales.reports':   <ReportsPage />,
  inventory:         <InventoryPage />,
  products:          <ProductsPage />,
  purchase:          <PurchasePage />,
  hr:                <HRPage />,
  crm:               <CRMPage />,
  profile:           <ProfilePage />,
  notifications:     <NotificationPage />,
};

/** Get the JSX element for a window by app ID. Returns null if not found. */
export const getPageElement = (id) => {
  if (import.meta.env.DEV && !(id in PAGE_ELEMENTS)) {
    console.warn(
      `[pageRegistry] No registered component for window "${id}". ` +
      `Add it to PAGE_ELEMENTS in src/routes/pageRegistry.jsx`
    );
  }
  return PAGE_ELEMENTS[id] ?? null;
};

// ── Lazy imports (for route-based rendering in App.jsx) ────────────────────
export const LAZY_PAGES = {
  home:              lazy(() => import('@/pages/HomePage')),
  files:             lazy(() => import('@/pages/system/FilesPage')),
  gallery:           lazy(() => import('@/pages/system/GalleryPage')),
  settings:          lazy(() => import('@/pages/system/SettingsPage')),
  documents:         lazy(() => import('@/pages/system/DocumentsPage')),
  trash:             lazy(() => import('@/pages/system/TrashPage')),
  sales:             lazy(() => import('@/pages/sales/SalesApp')),
  'sales.orders':    lazy(() => import('@/pages/sales/OrdersPage')),
  'sales.invoices':  lazy(() => import('@/pages/sales/InvoicePage')),
  'sales.delivery':  lazy(() => import('@/pages/sales/DeliveryPage')),
  'sales.reports':   lazy(() => import('@/pages/sales/ReportsPage')),
  inventory:         lazy(() => import('@/pages/inventory/InventoryPage')),
  products:          lazy(() => import('@/pages/products/ProductsPage')),
  purchase:          lazy(() => import('@/pages/modules/PurchasePage')),
  hr:                lazy(() => import('@/pages/modules/HRPage')),
  crm:               lazy(() => import('@/pages/modules/CRMPage')),
  profile:           lazy(() => import('@/pages/system/ProfilePage')),
  notifications:     lazy(() => import('@/pages/system/NotificationPage')),
};
