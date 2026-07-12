import StatsRow from '../components/erp/StatsRow';
import RevenueChart from './dashboard/RevenueChart';
import CategoryChart from './dashboard/CategoryChart';
import TopProductsList from './dashboard/TopProductsList';
import RecentOrdersWidget from './dashboard/RecentOrdersWidget';
import { dashboardStats, revenueData, recentOrders, topSellingProducts, categorySummary } from '../data/mockData';

const stats = [
  { title: 'Total Revenue', value: dashboardStats.totalRevenue, change: dashboardStats.revenueChange, prefix: '$', color: '#6366f1',
    icon: '<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { title: 'Total Orders', value: dashboardStats.totalOrders, change: dashboardStats.ordersChange, color: '#8b5cf6',
    icon: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
  { title: 'Products', value: dashboardStats.totalProducts, change: dashboardStats.productsChange, color: '#a855f7',
    icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
  { title: 'Customers', value: dashboardStats.totalCustomers, change: dashboardStats.customersChange, color: '#d946ef',
    icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
  { title: 'Total Purchases', value: dashboardStats.totalPurchases, change: dashboardStats.purchasesChange, prefix: '$', color: '#ec4899',
    icon: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>' },
  { title: 'Stock Value', value: dashboardStats.stockValue, change: dashboardStats.stockValueChange, prefix: '$', color: '#f43f5e',
    icon: '<rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><path d="M6 6h.01M6 18h.01"/>' },
];

export default function Dashboard() {
  return (
    <div className="page-dashboard">
      <StatsRow stats={stats} />

      <div className="charts-row">
        <RevenueChart data={revenueData} />
        <CategoryChart categories={categorySummary} />
      </div>

      <div className="bottom-row">
        <TopProductsList products={topSellingProducts} />
        <RecentOrdersWidget orders={recentOrders} />
      </div>
    </div>
  );
}
