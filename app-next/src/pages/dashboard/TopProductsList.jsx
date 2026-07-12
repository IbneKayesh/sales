const rankColors = ['#f59e0b', '#94a3b8', '#d97706', '#e2e8f0'];

export default function TopProductsList({ products }) {
  return (
    <div className="chart-card top-products">
      <div className="card-header">
        <h3>Top Selling Products</h3>
        <span className="card-subtitle">By units sold</span>
      </div>
      <div className="chart-body">
        <div className="top-products-list">
          {products.map((p, i) => (
            <div key={p.name} className="top-product-item">
              <div
                className="top-product-rank"
                style={{
                  background: rankColors[i] || '#e2e8f0',
                  color: i > 2 ? '#64748b' : '#fff',
                }}
              >
                {i + 1}
              </div>
              <div className="top-product-info">
                <span className="top-product-name">{p.name}</span>
                <span className="top-product-meta">{p.sold} units sold</span>
              </div>
              <span className="top-product-revenue">${p.revenue.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
