export const pageTitles = {
  '/': 'Dashboard',
  '/sales': 'Sales Management',
  '/purchase': 'Purchase Management',
  '/inventory': 'Inventory Management',
  '/reports': 'Analytics & Reports',
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
