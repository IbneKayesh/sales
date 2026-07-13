export const pageTitles = {
  '/': 'Dashboard',
  '/sales': 'Sales Management',
  '/purchase': 'Purchase Management',
  '/inventory': 'Inventory Management',
  '/reports': 'Analytics & Reports',
  // ─── ERP Modules ──────────────────────────────
  '/hr': 'Human Resources',
  '/accounting': 'Accounting & Finance',
  '/crm': 'Customer Relationship Management',
  '/manufacturing': 'Manufacturing & Production',
  '/projects': 'Project Management',
  '/supplychain': 'Supply Chain Management',
  '/assets': 'Assets Management',
  '/settings': 'Settings & Administration',
  // ─── Sidebar Sub-Pages ────────────────────────
  '/sales/create': 'New Sales Order',
  '/sales/returns': 'Returns Management',
  '/purchase/create': 'New Purchase Order',
  '/inventory/categories': 'Product Categories',
  // ─── Demo / Playground ────────────────────────
  '/demo/modals': 'Modal Components Demo',
};

// Dynamic paths for detail pages (matched by pattern, not exact)
export function getPageTitle(pathname) {
  // Exact matches first
  if (pageTitles[pathname]) return pageTitles[pathname];
  // Detail page patterns
  if (pathname.startsWith('/sales/')) return 'Order Details';
  if (pathname.startsWith('/inventory/')) return 'Product Details';
  if (pathname.startsWith('/purchase/')) return 'Purchase Order Details';
  return 'Page';
}
