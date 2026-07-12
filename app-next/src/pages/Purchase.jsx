import { useState, useRef } from 'react';
import TabPanel from '../components/erp/TabPanel';
import PurchaseStats from './purchase/PurchaseStats';
import PurchaseOrdersView from './purchase/PurchaseOrdersView';
import SuppliersView from './purchase/SuppliersView';
import { purchaseOrders as initialPO, suppliers } from '../data/mockData';

const tabs = [
  { key: 'orders', label: 'Purchase Orders', icon: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>' },
  { key: 'suppliers', label: 'Suppliers', icon: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' },
];

export default function Purchase() {
  const [activeTab, setActiveTab] = useState('orders');
  const [viewMode, setViewMode] = useState('table');
  const [pos, setPos] = useState(initialPO);
  const poViewRef = useRef();

  return (
    <div className="page-purchase">
      <PurchaseStats pos={pos} suppliers={suppliers} />

      <TabPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => { setActiveTab(key); if (key !== 'orders') setViewMode('table'); }}
        viewMode={activeTab === 'orders' ? viewMode : undefined}
        onViewModeChange={activeTab === 'orders' ? setViewMode : undefined}
        actions={
          <button className="btn-primary" onClick={() => poViewRef.current?.openForm()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {activeTab === 'orders' ? 'New Purchase Order' : 'Add Supplier'}
          </button>
        }
      >
        {activeTab === 'orders' ? (
          <PurchaseOrdersView ref={poViewRef} pos={pos} setPos={setPos} viewMode={viewMode} />
        ) : (
          <SuppliersView suppliers={suppliers} />
        )}
      </TabPanel>
    </div>
  );
}
