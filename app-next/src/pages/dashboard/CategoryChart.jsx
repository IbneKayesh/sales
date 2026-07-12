export default function CategoryChart({ categories }) {
  const maxCategory = Math.max(...categories.map((c) => c.value));

  return (
    <div className="chart-card category-chart">
      <div className="card-header">
        <h3>Inventory by Category</h3>
        <span className="card-subtitle">Product distribution</span>
      </div>
      <div className="chart-body">
        <div className="horizontal-bars">
          {categories.map((cat) => (
            <div key={cat.name} className="h-bar-row">
              <span className="h-bar-label">{cat.name}</span>
              <div className="h-bar-track">
                <div
                  className="h-bar-fill"
                  style={{
                    width: `${(cat.value / maxCategory) * 100}%`,
                    background: cat.color,
                  }}
                />
              </div>
              <span className="h-bar-value">{cat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
