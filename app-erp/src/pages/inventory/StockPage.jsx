import React, { useState } from 'react';

const initialItems = [
  { sku: 'CPU-INT-13900K', name: 'Intel Core i9-13900K', category: 'Processors', stock: 120, minStock: 20, location: 'Warehouse A', status: 'In Stock' },
  { sku: 'GPU-NV-4090FE', name: 'NVIDIA RTX 4090 Founders Edition', category: 'Graphics Cards', stock: 8, minStock: 15, location: 'Warehouse A', status: 'Low Stock' },
  { sku: 'RAM-COR-D5-64G', name: 'Corsair Vengeance DDR5 64GB', category: 'Memory', stock: 340, minStock: 50, location: 'Warehouse B', status: 'In Stock' },
  { sku: 'SSD-SAM-990P2T', name: 'Samsung 990 Pro 2TB SSD', category: 'Storage', stock: 3, minStock: 10, location: 'Warehouse B', status: 'Critical' },
  { sku: 'MB-ASU-Z790H', name: 'ASUS ROG Strix Z790-H Motherboard', category: 'Motherboards', stock: 45, minStock: 12, location: 'Warehouse C', status: 'In Stock' },
];

export default function StockPage() {
  const [items, setItems] = useState(initialItems);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredItems = items.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.category.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockCount = items.filter(i => i.stock <= i.minStock).length;

  const restockItem = (sku) => {
    setItems(items.map(item => {
      if (item.sku === sku) {
        const newStock = item.stock + 50;
        return {
          ...item,
          stock: newStock,
          status: newStock > item.minStock ? 'In Stock' : 'Low Stock'
        };
      }
      return item;
    }));
  };

  return (
    <div style={{ animation: 'windowOpen 0.25s ease' }}>
      {lowStockCount > 0 && (
        <div className="erp-alert-banner">
          <span>⚠️</span>
          <strong>Attention required:</strong> There are {lowStockCount} inventory items with stock levels below their safety thresholds. Consider raising POs.
        </div>
      )}

      <div className="erp-card-grid">
        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Total SKUs Tracked</span>
            <span className="erp-card-value">{items.length}</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
            🏷️
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Total Units in Stock</span>
            <span className="erp-card-value">
              {items.reduce((sum, item) => sum + item.stock, 0)}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(16, 124, 65, 0.15)', color: '#107c41' }}>
            📦
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Low Stock Alerts</span>
            <span className="erp-card-value" style={{ color: lowStockCount > 0 ? '#ff8c00' : 'inherit' }}>
              {lowStockCount}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' }}>
            🔔
          </div>
        </div>
      </div>

      <div className="erp-table-container">
        <div className="erp-toolbar">
          <input
            type="text"
            className="erp-search"
            placeholder="Search Inventory Items..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>SKU Code</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock Status</th>
              <th>Units Available</th>
              <th>Warehouse</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
                <tr key={item.sku}>
                  <td style={{ fontWeight: '500', color: '#60cdff' }}>{item.sku}</td>
                  <td style={{ fontWeight: '600' }}>{item.name}</td>
                  <td>{item.category}</td>
                  <td>
                    <span className={`status-badge ${
                      item.status === 'In Stock' ? 'success' :
                      item.status === 'Low Stock' ? 'warning' : 'danger'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {item.stock} / <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>min {item.minStock}</span>
                  </td>
                  <td>{item.location}</td>
                  <td>
                    {item.stock <= item.minStock && (
                      <button 
                        className="erp-btn erp-btn-primary" 
                        style={{ height: '24px', padding: '0 8px', fontSize: '11px' }}
                        onClick={() => restockItem(item.sku)}
                      >
                        ⚡ Quick Restock (+50)
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No items found in stock inventory ledger.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
