import React, { useState } from 'react';

const initialCustomers = [
  { id: 'CUST-001', name: 'Acme Corporation', contact: 'John Smith', email: 'john@acme.com', balance: '$2,450.00', status: 'Active' },
  { id: 'CUST-002', name: 'Global Industries', contact: 'Alice Johnson', email: 'alice@global.com', balance: '$8,200.00', status: 'Active' },
  { id: 'CUST-003', name: 'Nexus Ltd', contact: 'Bob Lee', email: 'bob@nexus.io', balance: '$0.00', status: 'Active' },
  { id: 'CUST-004', name: 'Stark Enterprises', contact: 'Pepper Potts', email: 'pepper@stark.com', balance: '$25,000.00', status: 'Active' },
  { id: 'CUST-005', name: 'Wayne Enterprises', contact: 'Lucius Fox', email: 'lucius@wayne.com', balance: '$0.00', status: 'Inactive' },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState('');

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.contact.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  const addRandomCustomer = () => {
    const names = ['Hooli Inc.', 'Initech Corp', 'Soylent Corp', 'Virtucon'];
    const contacts = ['Gavin Belson', 'Peter Gibbons', 'Robert Thorn', 'Dr. Evil'];
    const emails = ['gavin@hooli.xyz', 'peter@initech.com', 'thorn@soylent.org', 'evil@virtucon.net'];
    const idx = Math.floor(Math.random() * names.length);
    const balance = (Math.random() * 5000).toFixed(2);
    const newId = `CUST-00${customers.length + 1}`;

    const newCust = {
      id: newId,
      name: names[idx],
      contact: contacts[idx],
      email: emails[idx],
      balance: `$${parseFloat(balance).toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      status: 'Active'
    };

    setCustomers([newCust, ...customers]);
  };

  return (
    <div style={{ animation: 'windowOpen 0.25s ease' }}>
      <div className="erp-card-grid">
        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Total Active Customers</span>
            <span className="erp-card-value">
              {customers.filter(c => c.status === 'Active').length}
            </span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(96, 205, 255, 0.15)', color: '#60cdff' }}>
            👥
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Outstanding Balances</span>
            <span className="erp-card-value">$35,650.00</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(255, 140, 0, 0.15)', color: '#ff8c00' }}>
            💰
          </div>
        </div>

        <div className="erp-card">
          <div className="erp-card-data">
            <span className="erp-card-label">Customer Satisfaction</span>
            <span className="erp-card-value">98.4%</span>
          </div>
          <div className="erp-card-icon" style={{ background: 'rgba(16, 124, 65, 0.15)', color: '#107c41' }}>
            ⭐
          </div>
        </div>
      </div>

      <div className="erp-table-container">
        <div className="erp-toolbar">
          <input
            type="text"
            className="erp-search"
            placeholder="Search Customers..."
            value={search}
            onChange={handleSearch}
          />
          <button className="erp-btn erp-btn-primary" onClick={addRandomCustomer}>
            <span style={{ fontSize: '14px', fontWeight: 'bold' }}>+</span> New Customer
          </button>
        </div>

        <table className="erp-table">
          <thead>
            <tr>
              <th>Customer ID</th>
              <th>Name</th>
              <th>Primary Contact</th>
              <th>Email</th>
              <th>Outstanding Balance</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: '500', color: '#60cdff' }}>{c.id}</td>
                  <td style={{ fontWeight: '600' }}>{c.name}</td>
                  <td>{c.contact}</td>
                  <td>{c.email}</td>
                  <td>{c.balance}</td>
                  <td>
                    <span className={`status-badge ${
                      c.status === 'Active' ? 'success' : 'danger'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
