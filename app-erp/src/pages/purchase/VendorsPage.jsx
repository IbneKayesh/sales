import React, { useState } from 'react';

const initialVendors = [
  { id: 'VND-001', name: 'Intel Corp', category: 'Semiconductors', rating: '⭐⭐⭐⭐⭐', activeOrders: 1, balance: '$45,000.00' },
  { id: 'VND-002', name: 'TSMC Logistics', category: 'Manufacturing', rating: '⭐⭐⭐⭐⭐', activeOrders: 2, balance: '$120,500.00' },
  { id: 'VND-003', name: 'Samsung Electronics', category: 'Display & RAM', rating: '⭐⭐⭐⭐', activeOrders: 0, balance: '$0.00' },
  { id: 'VND-004', name: 'ASML Systems', category: 'Lithography Equipment', rating: '⭐⭐⭐⭐⭐', activeOrders: 1, balance: '$340,000.00' },
  { id: 'VND-005', name: 'Dell Technologies', category: 'Hardware Systems', rating: '⭐⭐⭐⭐', activeOrders: 0, balance: '$0.00' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState(initialVendors);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(search.toLowerCase()) ||
    v.category.toLowerCase().includes(search.toLowerCase()) ||
    v.id.toLowerCase().includes(search.toLowerCase())
  );

  const addRandomVendor = () => {
    const names = ['AMD Inc', 'NVIDIA Corp', 'Broadcom Ltd', 'Qualcomm'];
    const cats = ['Processors', 'Graphics Chips', 'Networking', 'Mobile SOCs'];
    const idx = Math.floor(Math.random() * names.length);
    const balance = (Math.random() * 25000).toFixed(2);
    const newId = `VND-00${vendors.length + 1}`;

    const newVnd = {
      id: newId,
      name: names[idx],
      category: cats[idx],
      rating: '⭐⭐⭐⭐',
      activeOrders: Math.floor(Math.random() * 3),
      balance: `$${parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
    };

    setVendors([newVnd, ...vendors]);
  };

  return (
    <div style={{ animation: 'windowOpen 0.25s ease' }}>
      <div className="erp-card-grid">
        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Active Suppliers</span>
            <span className="erp-card-value">{vendors.length}</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
            🏬
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Accounts Payable</span>
            <span className="erp-card-value">$505,500.00</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' }}>
            💸
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Average Vendor Rating</span>
            <span className="erp-card-value">4.8 / 5.0</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(16, 124, 65, 0.15)', color: '#107c41' }}>
            📈
          </div>
        </div>
      </div>

      <div className="erp-table-container">
        <div className="erp-toolbar">
          <input
            type="text"
            className="erp-search"
            placeholder="Search Vendors..."
            value={search}
            onChange={handleSearch}
          />
          <button className="erp-btn erp-btn-primary" onClick={addRandomVendor}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span> New Vendor Contact
          </button>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Vendor ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Rating</th>
              <th>Active POs</th>
              <th>Balance Owed</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.length > 0 ? (
              filteredVendors.map(vendor => (
                <tr key={vendor.id}>
                  <td style={{ fontWeight: '500', color: '#60cdff' }}>{vendor.id}</td>
                  <td style={{ fontWeight: '600' }}>{vendor.name}</td>
                  <td>{vendor.category}</td>
                  <td style={{ letterSpacing: '2px' }}>{vendor.rating}</td>
                  <td>{vendor.activeOrders}</td>
                  <td>{vendor.balance}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No vendors found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
