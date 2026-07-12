export const dashboardStats = {
  totalRevenue: 284500,
  revenueChange: 12.5,
  totalOrders: 1248,
  ordersChange: 8.3,
  totalProducts: 356,
  productsChange: -2.1,
  totalCustomers: 892,
  customersChange: 15.7,
  totalPurchases: 185600,
  purchasesChange: 6.8,
  stockValue: 423000,
  stockValueChange: -3.2,
};

export const revenueData = [
  { month: 'Jan', revenue: 18500, expenses: 12000 },
  { month: 'Feb', revenue: 22300, expenses: 14800 },
  { month: 'Mar', revenue: 19800, expenses: 13500 },
  { month: 'Apr', revenue: 25600, expenses: 16200 },
  { month: 'May', revenue: 28400, expenses: 17800 },
  { month: 'Jun', revenue: 31200, expenses: 19500 },
  { month: 'Jul', revenue: 28900, expenses: 18200 },
  { month: 'Aug', revenue: 33500, expenses: 21000 },
  { month: 'Sep', revenue: 29800, expenses: 18800 },
  { month: 'Oct', revenue: 35200, expenses: 22500 },
  { month: 'Nov', revenue: 37800, expenses: 23800 },
  { month: 'Dec', revenue: 41500, expenses: 25600 },
];

export const recentOrders = [
  { id: 'ORD-001', customer: 'Sarah Johnson', product: 'iPhone 15 Pro', amount: 1299, status: 'completed', date: '2026-07-12', payment: 'paid' },
  { id: 'ORD-002', customer: 'Michael Chen', product: 'MacBook Air M3', amount: 1599, status: 'processing', date: '2026-07-12', payment: 'pending' },
  { id: 'ORD-003', customer: 'Emily Davis', product: 'AirPods Pro 2', amount: 249, status: 'completed', date: '2026-07-11', payment: 'paid' },
  { id: 'ORD-004', customer: 'James Wilson', product: 'iPad Air', amount: 749, status: 'pending', date: '2026-07-11', payment: 'unpaid' },
  { id: 'ORD-005', customer: 'Lisa Anderson', product: 'Apple Watch Ultra', amount: 899, status: 'completed', date: '2026-07-10', payment: 'paid' },
  { id: 'ORD-006', customer: 'David Thompson', product: 'iMac 24"', amount: 1899, status: 'cancelled', date: '2026-07-10', payment: 'refunded' },
  { id: 'ORD-007', customer: 'Anna Martinez', product: 'Mac Mini', amount: 1099, status: 'processing', date: '2026-07-09', payment: 'pending' },
  { id: 'ORD-008', customer: 'Robert Kim', product: 'iPhone 15 Pro Max', amount: 1499, status: 'completed', date: '2026-07-09', payment: 'paid' },
];

export const products = [
  { id: 'PRD-001', name: 'iPhone 15 Pro', category: 'Smartphones', price: 1299, stock: 45, minStock: 20, unit: 'pcs' },
  { id: 'PRD-002', name: 'iPhone 15 Pro Max', category: 'Smartphones', price: 1499, stock: 32, minStock: 15, unit: 'pcs' },
  { id: 'PRD-003', name: 'MacBook Air M3', category: 'Laptops', price: 1599, stock: 18, minStock: 10, unit: 'pcs' },
  { id: 'PRD-004', name: 'MacBook Pro 14"', category: 'Laptops', price: 2499, stock: 8, minStock: 5, unit: 'pcs' },
  { id: 'PRD-005', name: 'iPad Air', category: 'Tablets', price: 749, stock: 27, minStock: 15, unit: 'pcs' },
  { id: 'PRD-006', name: 'iPad Pro 12.9"', category: 'Tablets', price: 1299, stock: 12, minStock: 8, unit: 'pcs' },
  { id: 'PRD-007', name: 'Apple Watch Ultra', category: 'Wearables', price: 899, stock: 5, minStock: 10, unit: 'pcs' },
  { id: 'PRD-008', name: 'Apple Watch Series 9', category: 'Wearables', price: 499, stock: 22, minStock: 15, unit: 'pcs' },
  { id: 'PRD-009', name: 'AirPods Pro 2', category: 'Audio', price: 249, stock: 60, minStock: 25, unit: 'pcs' },
  { id: 'PRD-010', name: 'AirPods Max', category: 'Audio', price: 549, stock: 0, minStock: 5, unit: 'pcs' },
  { id: 'PRD-011', name: 'iMac 24"', category: 'Desktops', price: 1899, stock: 7, minStock: 5, unit: 'pcs' },
  { id: 'PRD-012', name: 'Mac Mini', category: 'Desktops', price: 1099, stock: 14, minStock: 8, unit: 'pcs' },
  { id: 'PRD-013', name: 'Mac Pro', category: 'Desktops', price: 6999, stock: 3, minStock: 2, unit: 'pcs' },
  { id: 'PRD-014', name: 'Studio Display', category: 'Accessories', price: 1599, stock: 6, minStock: 4, unit: 'pcs' },
  { id: 'PRD-015', name: 'Magic Keyboard', category: 'Accessories', price: 349, stock: 40, minStock: 20, unit: 'pcs' },
];

export const suppliers = [
  { id: 'SUP-001', name: 'Apple Inc.', contact: 'Steve Jobs', email: 'supply@apple.com', phone: '+1 (408) 996-1010', status: 'active', orders: 45 },
  { id: 'SUP-002', name: 'TechDistributors Co.', contact: 'John Smith', email: 'orders@techdist.com', phone: '+1 (213) 555-0198', status: 'active', orders: 28 },
  { id: 'SUP-003', name: 'Global Electronics Ltd.', contact: 'Maria Garcia', email: 'sales@globalelec.com', phone: '+1 (415) 555-0123', status: 'active', orders: 32 },
  { id: 'SUP-004', name: 'Digital Parts Inc.', contact: 'Alex Turner', email: 'info@digitalparts.com', phone: '+1 (310) 555-0456', status: 'inactive', orders: 5 },
  { id: 'SUP-005', name: 'Asian Tech Imports', contact: 'Kenji Nakamura', email: 'contact@asiantech.asia', phone: '+81 (3) 5550-1234', status: 'active', orders: 18 },
];

export const purchaseOrders = [
  { id: 'PO-001', supplier: 'Apple Inc.', items: 50, total: 64950, status: 'received', date: '2026-07-10', expected: '2026-07-08' },
  { id: 'PO-002', supplier: 'TechDistributors Co.', items: 100, total: 24900, status: 'pending', date: '2026-07-09', expected: '2026-07-16' },
  { id: 'PO-003', supplier: 'Global Electronics Ltd.', items: 30, total: 44970, status: 'shipped', date: '2026-07-08', expected: '2026-07-14' },
  { id: 'PO-004', supplier: 'Asian Tech Imports', items: 75, total: 18750, status: 'pending', date: '2026-07-07', expected: '2026-07-21' },
  { id: 'PO-005', supplier: 'Apple Inc.', items: 20, total: 49980, status: 'received', date: '2026-07-05', expected: '2026-07-03' },
  { id: 'PO-006', supplier: 'Digital Parts Inc.', items: 200, total: 3800, status: 'cancelled', date: '2026-07-04', expected: '2026-07-15' },
];

export const invoices = [
  { id: 'INV-001', order: 'ORD-001', customer: 'Sarah Johnson', amount: 1299, dueDate: '2026-08-11', status: 'paid', date: '2026-07-12' },
  { id: 'INV-002', order: 'ORD-002', customer: 'Michael Chen', amount: 1599, dueDate: '2026-08-11', status: 'pending', date: '2026-07-12' },
  { id: 'INV-003', order: 'ORD-003', customer: 'Emily Davis', amount: 249, dueDate: '2026-08-10', status: 'paid', date: '2026-07-11' },
  { id: 'INV-004', order: 'ORD-004', customer: 'James Wilson', amount: 749, dueDate: '2026-08-10', status: 'overdue', date: '2026-07-11' },
  { id: 'INV-005', order: 'ORD-005', customer: 'Lisa Anderson', amount: 899, dueDate: '2026-08-09', status: 'paid', date: '2026-07-10' },
  { id: 'INV-006', order: 'ORD-006', customer: 'David Thompson', amount: 1899, dueDate: '2026-08-09', status: 'cancelled', date: '2026-07-10' },
  { id: 'INV-007', order: 'ORD-007', customer: 'Anna Martinez', amount: 1099, dueDate: '2026-08-08', status: 'pending', date: '2026-07-09' },
  { id: 'INV-008', order: 'ORD-008', customer: 'Robert Kim', amount: 1499, dueDate: '2026-08-08', status: 'paid', date: '2026-07-09' },
];

export const lowStockAlerts = products.filter(p => p.stock <= p.minStock && p.stock > 0);
export const outOfStockAlerts = products.filter(p => p.stock === 0);

export const categorySummary = [
  { name: 'Smartphones', value: 77, color: '#6366f1' },
  { name: 'Laptops', value: 26, color: '#8b5cf6' },
  { name: 'Tablets', value: 39, color: '#a855f7' },
  { name: 'Wearables', value: 27, color: '#d946ef' },
  { name: 'Audio', value: 60, color: '#ec4899' },
  { name: 'Desktops', value: 24, color: '#f43f5e' },
  { name: 'Accessories', value: 46, color: '#f97316' },
];

export const topSellingProducts = [
  { name: 'AirPods Pro 2', sold: 185, revenue: 46065 },
  { name: 'iPhone 15 Pro', sold: 142, revenue: 184458 },
  { name: 'MacBook Air M3', sold: 98, revenue: 156702 },
  { name: 'iPad Air', sold: 87, revenue: 65163 },
  { name: 'Apple Watch S9', sold: 76, revenue: 37924 },
];
