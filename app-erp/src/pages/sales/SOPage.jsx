import React, { useState } from 'react';

const initialOrders = [
  { id: 'SO-2026-001', customer: 'Acme Corporation', date: '2026-06-01', amount: '$12,450.00', status: 'Delivered' },
  { id: 'SO-2026-002', customer: 'Global Industries', date: '2026-06-03', amount: '$8,200.00', status: 'Pending' },
  { id: 'SO-2026-003', customer: 'Nexus Ltd', date: '2026-06-04', amount: '$4,150.00', status: 'Delivered' },
  { id: 'SO-2026-004', customer: 'Stark Enterprises', date: '2026-06-05', amount: '$25,000.00', status: 'Pending' },
  { id: 'SO-2026-005', customer: 'Wayne Enterprises', date: '2026-06-06', amount: '$15,800.00', status: 'Cancelled' },
];

export default function SOPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredOrders = orders.filter(order =>
    order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  const addRandomOrder = () => {
    const customers = ['Cyberdyne Systems', 'Umbrella Corp', 'Tyrell Corp', 'Oscorp Technologies'];
    const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
    const randomAmount = (Math.random() * 15000 + 1000).toFixed(2);
    const statuses = ['Pending', 'Delivered'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const newId = `SO-2026-00${orders.length + 1}`;
    
    const newOrder = {
      id: newId,
      customer: randomCustomer,
      date: new Date().toISOString().split('T')[0],
      amount: `$${parseFloat(randomAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: randomStatus
    };

    setOrders([newOrder, ...orders]);
  };

  return (
    <div style={{ animation: 'windowOpen 0.25s ease' }}>
      <div className="erp-card-grid">
        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Total Sales Volume</span>
            <span className="erp-card-value">$65,600.00</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
            📊
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Pending Orders</span>
            <span className="erp-card-value">
              {orders.filter(o => o.status === 'Pending').length}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' }}>
            ⏳
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Completed Orders</span>
            <span className="erp-card-value">
              {orders.filter(o => o.status === 'Delivered').length}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(16, 124, 65, 0.15)', color: '#107c41' }}>
            ✅
          </div>
        </div>
      </div>

      <div className="erp-table-container">
        <div className="erp-toolbar">
          <input
            type="text"
            className="erp-search"
            placeholder="Search Sales Orders..."
            value={search}
            onChange={handleSearch}
          />
          <button className="erp-btn erp-btn-primary" onClick={addRandomOrder}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span> New Sales Order
          </button>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: '500', color: '#60cdff' }}>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{order.date}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span className={`status-badge ${
                      order.status === 'Delivered' ? 'success' :
                      order.status === 'Pending' ? 'warning' : 'danger'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No sales orders found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}