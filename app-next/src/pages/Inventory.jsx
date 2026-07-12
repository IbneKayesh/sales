import { useState, useRef } from 'react';
import TabPanel from '../components/erp/TabPanel';
import DataTable from '../components/ui/DataTable';
import InventoryStats from './inventory/InventoryStats';
import ProductsView from './inventory/ProductsView';
import StockAlertsSection from './inventory/StockAlertsSection';
import { products as initialProducts, categorySummary } from '../data/mockData';
import { alertColumns } from './inventory/inventoryConfig';

const tabs = [
  { key: 'products', label: 'All Products', icon: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>' },
  { key: 'alerts', label: 'Stock Alerts', icon: '<path d="M4 4h16v16H4z"/><path d="M9 4v16"/><path d="M4 9h16"/>' },
];

export default function Inventory() {
  const [activeTab, setActiveTab] = useState('products');
  const [viewMode, setViewMode] = useState('table');
  const [products, setProducts] = useState(initialProducts);
  const productsViewRef = useRef();

  const currentLow = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const currentOut = products.filter(p => p.stock === 0);

  return (
    <div className="page-inventory">
      <InventoryStats products={products} />

      <StockAlertsSection products={products} categorySummary={categorySummary} />

      <TabPanel
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(key) => { setActiveTab(key); if (key !== 'products') setViewMode('table'); }}
        viewMode={activeTab === 'products' ? viewMode : undefined}
        onViewModeChange={activeTab === 'products' ? setViewMode : undefined}
        actions={
          <button className="btn-primary" onClick={() => productsViewRef.current?.openForm()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            {activeTab === 'products' ? 'Add Product' : 'Add Alert Rule'}
          </button>
        }
      >
        {activeTab === 'products' ? (
          <ProductsView ref={productsViewRef} products={products} setProducts={setProducts} viewMode={viewMode} />
        ) : (
          <DataTable columns={alertColumns} data={[...currentOut, ...currentLow]} searchable searchPlaceholder="Search alerts..." />
        )}
      </TabPanel>
    </div>
  );
}
