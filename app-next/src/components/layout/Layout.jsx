import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PageTransition from '../ui/PageTransition';
import Breadcrumb from '../ui/Breadcrumb';
import TabBar from './TabBar';
import { TabProvider } from '../../context/TabContext';
import { getPageTitle } from '../../config/routes';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Derive activePage from the current pathname
  const activePage = location.pathname === '/' ? 'dashboard'
    : location.pathname.replace('/', '');

  const pageTitle = getPageTitle(location.pathname);

  const toggleSidebar = () => setSidebarCollapsed(c => !c);

  const handleNavigate = () => {
    if (window.innerWidth <= 768) {
      setSidebarCollapsed(true);
    }
  };

  return (
    <TabProvider>
      <div className="app-layout">
        {!sidebarCollapsed && (
          <div className="sidebar-backdrop" onClick={toggleSidebar} />
        )}
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
          onNavigate={handleNavigate}
        />
        <div className="main-area">
          <Header
            pageTitle={pageTitle}
            onToggleSidebar={toggleSidebar}
          />
          <TabBar />
          <main className="main-content">
            <Breadcrumb />
            <PageTransition>
              <Outlet />
            </PageTransition>
          </main>
        </div>
      </div>
    </TabProvider>
  );
}
