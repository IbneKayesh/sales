import React, { useState } from 'react';

const initialPurchases = [
  { id: 'PO-2026-001', vendor: 'Intel Corp', date: '2026-05-20', amount: '$45,000.00', status: 'Received' },
  { id: 'PO-2026-002', vendor: 'TSMC Logistics', date: '2026-06-01', amount: '$120,500.00', status: 'Pending' },
  { id: 'PO-2026-003', vendor: 'Samsung Electronics', date: '2026-06-02', amount: '$15,400.00', status: 'Received' },
  { id: 'PO-2026-004', vendor: 'ASML Systems', date: '2026-06-04', amount: '$340,000.00', status: 'Pending' },
  { id: 'PO-2026-005', vendor: 'Dell Technologies', date: '2026-06-05', amount: '$8,900.00', status: 'Cancelled' },
];

export default function POPage() {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredPurchases = purchases.filter(p =>
    p.vendor.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const addRandomPurchase = () => {
    const vendors = ['Microsoft Supplier', 'Lenovo Wholesale', 'NVIDIA Corp', 'AMD Logistics'];
    const randomVendor = vendors[Math.floor(Math.random() * vendors.length)];
    const randomAmount = (Math.random() * 80000 + 5000).toFixed(2);
    const statuses = ['Pending', 'Received'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const newId = `PO-2026-00${purchases.length + 1}`;
    
    const newPO = {
      id: newId,
      vendor: randomVendor,
      date: new Date().toISOString().split('T')[0],
      amount: `$${parseFloat(randomAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: randomStatus
    };

    setPurchases([newPO, ...purchases]);
  };

  return (
    <div style={{ animation: 'windowOpen 0.25s ease' }}>
      <div className="erp-card-grid">
        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Outbound Expenses</span>
            <span className="erp-card-value">$529,800.00</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
            💳
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Pending Shipments</span>
            <span className="erp-card-value">
              {purchases.filter(p => p.status === 'Pending').length}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' }}>
            🚢
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Received Orders</span>
            <span className="erp-card-value">
              {purchases.filter(p => p.status === 'Received').length}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(16, 124, 65, 0.15)', color: '#107c41' }}>
            📦
          </div>
        </div>
      </div>

      <div className="erp-table-container">
        <div className="erp-toolbar">
          <input
            type="text"
            className="erp-search"
            placeholder="Search Purchases..."
            value={search}
            onChange={handleSearch}
          />
          <button className="erp-btn erp-btn-primary" onClick={addRandomPurchase}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span> Raise Purchase Order
          </button>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>PO ID</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredPurchases.length > 0 ? (
              filteredPurchases.map(po => (
                <tr key={po.id}>
                  <td style={{ fontWeight: '500', color: '#60cdff' }}>{po.id}</td>
                  <td>{po.vendor}</td>
                  <td>{po.date}</td>
                  <td>{po.amount}</td>
                  <td>
                    <span className={`status-badge ${
                      po.status === 'Received' ? 'success' :
                      po.status === 'Pending' ? 'warning' : 'danger'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No purchase orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}