import { useState } from 'react';
import TabPanel from '../../components/erp/TabPanel';
import SalesStats from './SalesStats';
import OrdersView from './OrdersView';
import InvoicesView from './InvoicesView';
import { useToast } from '../../components/ui/Toast';
import { recentOrders as initialOrders, invoices } from '../../data/mockData';

const tabs = [
  { key: 'orders', label: 'Orders', icon: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>' },
  { key: 'invoices', label: 'Invoices', icon: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>' },
];

export default function SalesPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('orders');
  const [viewMode, setViewMode] = useState('table');
  const [orders, setOrders] = useState(initialOrders);

  return (
    <div className="page-sales">
      <SalesStats orders={orders} invoices={invoices} />

      <TabPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => { setActiveTab(key); if (key !== 'orders') setViewMode('table'); }}
        viewMode={activeTab === 'orders' ? viewMode : undefined}
        onViewModeChange={activeTab === 'orders' ? setViewMode : undefined}
        actions={
          <button className="btn-primary" onClick={() => {}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {activeTab === 'orders' ? 'New Order' : 'Create Invoice'}
          </button>
        }
      >
        {activeTab === 'orders' ? (
          <OrdersView orders={orders} setOrders={setOrders} viewMode={viewMode} />
        ) : (
          <InvoicesView invoices={invoices} />
        )}
      </TabPanel>
    </div>
  );
}
