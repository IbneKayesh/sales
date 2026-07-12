import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { preloadPage } from '../../utils/preload';

const navItems = [
  {
    section: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
    ],
  },
  {
    section: 'Operations',
    items: [
      {
        to: '/sales', label: 'Sales',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
        children: [
          { to: '/sales', label: 'All Orders', end: true },
          { to: '/sales/create', label: 'New Order' },
          { to: '/sales/returns', label: 'Returns' },
        ],
      },
      {
        to: '/purchase', label: 'Purchases',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
        children: [
          { to: '/purchase', label: 'All Orders', end: true },
          { to: '/purchase/create', label: 'New Order' },
        ],
      },
      {
        to: '/inventory', label: 'Inventory',
        icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
        children: [
          { to: '/inventory', label: 'All Products', end: true },
          { to: '/inventory/categories', label: 'Categories' },
        ],
      },
    ],
  },
  {
    section: 'Reports',
    items: [
      { to: '/reports', label: 'Analytics', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>' },
    ],
  },
];

export default function Sidebar({ collapsed, onToggle, onNavigate }) {
  const { user, canAccessRoute } = useAuth();
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState(() => {
    // Auto-expand menus whose children match current route
    const expanded = new Set();
    navItems.forEach(section => {
      section.items.forEach(item => {
        if (item.children) {
          const isActive = item.children.some(child =>
            child.end ? location.pathname === child.to : location.pathname.startsWith(child.to)
          );
          if (isActive) expanded.add(item.to);
        }
      });
    });
    return expanded;
  });

  // Auto-expand parent menu when navigating to a child route
  useEffect(() => {
    setExpandedMenus(prev => {
      const next = new Set(prev);
      navItems.forEach(section => {
        section.items.forEach(item => {
          if (item.children) {
            const isActive = item.children.some(child =>
              child.end ? location.pathname === child.to : location.pathname.startsWith(child.to)
            );
            if (isActive) next.add(item.to);
            else next.delete(item.to);
          }
        });
      });
      return next;
    });
  }, [location.pathname]);

  // Ripple effect for Android-style touch feedback
  const rippleEffect = (e) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'nav-ripple';
    ripple.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px`;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  const toggleMenu = (path) => {
    setExpandedMenus(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <>
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <div className="brand-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
              <path d="M6 6h.01M6 18h.01" />
            </svg>
          </div>
          {!collapsed && (
            <div className="brand-text">
              <span className="brand-name">Enterprise</span>
              <span className="brand-sub">Management System</span>
            </div>
          )}
        </div>

        <button className="sidebar-toggle" onClick={onToggle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={collapsed ? "M9 18l6-6-6-6" : "M15 18l-6-6 6-6"} />
          </svg>
        </button>

        <nav className="sidebar-nav">
          {navItems.map(section => (
            <div key={section.section} className="nav-section">
              {!collapsed && <span className="nav-section-title">{section.section}</span>}
              <ul>
                {section.items
                  .filter(item => canAccessRoute(item.to))
                  .map(item => (
                  <li key={item.to} className={item.children ? 'has-submenu' : ''}>
                    {item.children ? (
                      <>
                        <button
                          className={`nav-item nav-parent ${expandedMenus.has(item.to) ? 'expanded' : ''}`}
                          onClick={(e) => { rippleEffect(e); toggleMenu(item.to); }}
                          title={collapsed ? item.label : undefined}
                        >
                          <span className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                          {!collapsed && <>
                            <span className="nav-label">{item.label}</span>
                            <svg className="nav-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </>}
                        </button>
                        {!collapsed && (
                          <div className={`sub-menu ${expandedMenus.has(item.to) ? 'open' : ''}`}>
                            <ul>
                              {item.children.map(child => (
                                <li key={child.to}>
                                  <NavLink
                                    to={child.to}
                                    end={!!child.end}
                                    className={({ isActive }) => `nav-item nav-child${isActive ? ' active' : ''}`}
                                    onClick={(e) => { rippleEffect(e); onNavigate?.(); }}
                                    onMouseEnter={() => preloadPage(child.to)}
                                  >
                                    {({ isActive }) => (
                                      <>
                                        <span className="nav-bullet" />
                                        <span className="nav-label">{child.label}</span>
                                        {isActive && <span className="nav-indicator" />}
                                      </>
                                    )}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    ) : (
                      <NavLink
                        to={item.to}
                        end={item.to === '/'}
                        className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                        onClick={(e) => { rippleEffect(e); onNavigate?.(); }}
                        onMouseEnter={() => preloadPage(item.to)}
                        title={collapsed ? item.label : undefined}
                      >
                        {({ isActive }) => (
                          <>
                            <span className="nav-icon" dangerouslySetInnerHTML={{ __html: item.icon }} />
                            {!collapsed && <span className="nav-label">{item.label}</span>}
                            {isActive && <span className="nav-indicator" />}
                          </>
                        )}
                      </NavLink>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {!collapsed && (
          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar" style={{
                background: user?.role === 'System Manager' ? '#6366f1'
                  : user?.role === 'Operations Manager' ? '#8b5cf6'
                  : '#a855f7'
              }}>
                {user?.avatar || 'AD'}
              </div>
              <div className="user-details">
                <span className="user-name">{user?.name || 'Admin User'}</span>
                <span className="user-role">{user?.role || 'System Manager'}</span>
              </div>
            </div>
          </div>
        )}
      </aside>
      {collapsed && <div className="sidebar-spacer collapsed" />}
      {!collapsed && <div className="sidebar-spacer" />}
    </>
  );
}
