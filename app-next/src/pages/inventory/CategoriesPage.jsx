import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import StatsRow from '../../components/erp/StatsRow';
import { useToast } from '../../components/ui/Toast';
import { confirm } from '../../components/ui/ConfirmDialog';
import { categories as initialCategories, products } from '../../data/mockData';

const categoryColumns = [
  { key: 'id', label: 'ID' },
  {
    key: 'name', label: 'Category',
    render: (val, row) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{
          width: 12, height: 12, borderRadius: 3, background: row.color || '#6366f1',
          display: 'inline-block',
        }} />
        <span style={{ fontWeight: 600 }}>{val}</span>
      </span>
    ),
  },
  {
    key: 'productCount', label: 'Products',
    render: (val) => <span style={{ fontWeight: 600 }}>{val}</span>,
  },
  {
    key: 'totalValue', label: 'Total Value',
    render: (val) => <span style={{ fontWeight: 600 }}>${val.toLocaleString()}</span>,
  },
  {
    key: 'avgPrice', label: 'Avg. Price',
    render: (val) => <span>${val.toLocaleString()}</span>,
  },
];

export default function CategoriesPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
    return [
      {
        title: 'Categories', value: initialCategories.length, color: '#6366f1',
        change: 0,
        icon: '<rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"2\" ry=\"2\"/><rect x=\"6\" y=\"6\" width=\"12\" height=\"12\" rx=\"1\"/><path d=\"M12 6v12\"/><path d=\"M6 12h12\"/>',
      },
      {
        title: 'Total Products', value: totalProducts, color: '#8b5cf6',
        change: 5.3,
        icon: '<path d=\"M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z\"/>',
      },
      {
        title: 'Stock Value', value: totalValue, prefix: '$', color: '#a855f7',
        change: -2.1,
        icon: '<rect x=\"2\" y=\"2\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"/><rect x=\"2\" y=\"14\" width=\"20\" height=\"8\" rx=\"2\" ry=\"2\"/><path d=\"M6 6h.01M6 18h.01\"/>',
      },
      {
        title: 'Avg Products/Category', value: (totalProducts / initialCategories.length).toFixed(1), color: '#d946ef',
        change: 5.3,
        icon: '<path d=\"M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2\"/><circle cx=\"9\" cy=\"7\" r=\"4\"/><path d=\"M23 21v-2a4 4 0 0 0-3-3.87\"/><path d=\"M16 3.13a4 4 0 0 1 0 7.75\"/>',
      },
    ];
  }, []);

  const handleRowClick = (row) => {
    // Filter products in this category and show count
    const categoryProducts = products.filter(p => p.category === row.name);
    toast.info(
      `${row.name}: ${categoryProducts.length} products, $${categoryProducts.reduce((s, p) => s + p.price * p.stock, 0).toLocaleString()} total value`
    );
  };

  return (
    <div className="subpage-container">
      <div className="subpage-header">
        <button className="btn-ghost" onClick={() => navigate('/inventory')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Inventory
        </button>
        <h2>Product Categories</h2>
      </div>

      <StatsRow stats={stats} />

      <div className="category-cards">
        {initialCategories.map(cat => {
          const catProducts = products.filter(p => p.category === cat.name);
          return (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => handleRowClick(cat)}
              style={{ borderTop: `3px solid ${cat.color}` }}
            >
              <div className="category-card-header">
                <span className="category-card-color" style={{ background: cat.color }} />
                <h4>{cat.name}</h4>
              </div>
              <div className="category-card-stats">
                <div className="category-card-stat">
                  <span className="category-stat-value">{catProducts.length}</span>
                  <span className="category-stat-label">Products</span>
                </div>
                <div className="category-card-stat">
                  <span className="category-stat-value">${cat.avgPrice.toLocaleString()}</span>
                  <span className="category-stat-label">Avg Price</span>
                </div>
                <div className="category-card-stat">
                  <span className="category-stat-value">${catProducts.reduce((s, p) => s + p.price * p.stock, 0).toLocaleString()}</span>
                  <span className="category-stat-label">Stock Value</span>
                </div>
              </div>
              <div className="category-card-stock-bar">
                <div
                  className="category-card-stock-fill"
                  style={{
                    width: `${(catProducts.reduce((s, p) => s + p.stock, 0) / 150) * 100}%`,
                    background: cat.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="subpage-card" style={{ marginTop: 24 }}>
        <div className="subpage-card-header">
          <h3>All Categories</h3>
          <p>Detailed view of product categories and their metrics</p>
        </div>
        <DataTable
          columns={categoryColumns}
          data={initialCategories}
          searchable
          searchPlaceholder="Search categories..."
          onRowClick={handleRowClick}
          exportable
          exportFilename="inventory-categories"
        />
      </div>
    </div>
  );
}
