import React, { useState } from 'react';
import { useWindowManager } from '../../context/WindowManagerContext';
import { useContextMenu } from '../../context/ContextMenuContext';
import DesktopIcon from './DesktopIcon';
import Window from '../Window/Window';
import HomePage from '../../pages/HomePage';
import FilesPage from '../../pages/system/FilesPage';
import GalleryPage from '../../pages/system/GalleryPage';
import SettingsPage from '../../pages/system/SettingsPage';
import SalesApp from '../../pages/sales/SalesApp';
import InventoryPage from '../../pages/inventory/InventoryPage';
import OrdersPage from '../../pages/sales/OrdersPage';
import InvoicePage from '../../pages/sales/InvoicePage';
import DeliveryPage from '../../pages/sales/DeliveryPage';
import ReportsPage from '../../pages/sales/ReportsPage';
import PurchasePage from '../../pages/modules/PurchasePage';
import HRPage from '../../pages/modules/HRPage';
import CRMPage from '../../pages/modules/CRMPage';
import NotificationPage from '../../pages/system/NotificationPage';
import ProfilePage from '../../pages/system/ProfilePage';
import DocumentsPage from '../../pages/system/DocumentsPage';
import TrashPage from '../../pages/system/TrashPage';
import styles from './Desktop.module.css';

const ICON_LABELS = {
  home: 'Home',
  files: 'Finder',
  gallery: 'System Gallery',
  settings: 'System Settings',
  sales: 'Sales',
  'sales.orders': 'Orders',
  'sales.invoices': 'Invoices',
  'sales.delivery': 'Delivery',
  'sales.reports': 'Reports',
  inventory: 'Inventory',
  purchase: 'Purchase',
  hr: 'HR',
  crm: 'CRM',
  notifications: 'Notifications',
  profile: 'Profile Settings',
  documents: 'Documents',
  trash: 'Trash',
};

const WINDOW_COMPONENTS = {
  home:      <HomePage />,
  files:     <FilesPage />,
  gallery:   <GalleryPage />,
  settings:  <SettingsPage />,
  sales:     <SalesApp />,
  'sales.orders':    <OrdersPage />,
  'sales.invoices':  <InvoicePage />,
  'sales.delivery':  <DeliveryPage />,
  'sales.reports':   <ReportsPage />,
  inventory: <InventoryPage />,
  purchase: <PurchasePage />,
  hr: <HRPage />,
  crm: <CRMPage />,
  notifications: <NotificationPage />,
  profile: <ProfilePage />,
  documents: <DocumentsPage />,
  trash:     <TrashPage />,
};

const Desktop = () => {
  const { windows, openWindow, recents } = useWindowManager();
  const { showMenu } = useContextMenu();
  const [selectedIconId, setSelectedIconId] = useState(null);

  const hasOpenWindows = windows.some((w) => w.isOpen && !w.isMinimized);

  const handleDesktopClick = () => setSelectedIconId(null);

  const handleContextMenu = (e) => {
    e.preventDefault();
    showMenu(e.clientX, e.clientY);
  };

  return (
    <div
      className={styles.desktopWorkspace}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {!hasOpenWindows && (
        <div className={styles.dashboardBg}>
          <HomePage />
        </div>
      )}

      <div className={styles.iconsGrid}>
        {recents.map((id) => (
          <DesktopIcon
            key={id}
            id={id}
            label={ICON_LABELS[id] || id}
            isSelected={selectedIconId === id}
            onClick={() => setSelectedIconId(id)}
            onDoubleClick={() => openWindow(id)}
          />
        ))}
      </div>

      <div className={styles.windowsContainer}>
        {windows.map((win) => (
          <Window key={win.id} {...win}>
            {WINDOW_COMPONENTS[win.id] ?? null}
          </Window>
        ))}
      </div>
    </div>
  );
};

export default Desktop;
