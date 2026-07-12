export default function RevenueChart({ data }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue));

  return (
    <div className="chart-card revenue-chart">
      <div className="card-header">
        <h3>Revenue Overview</h3>
        <span className="card-subtitle">Monthly revenue vs expenses</span>
      </div>
      <div className="chart-body">
        <div className="bar-chart">
          {data.map((d, i) => (
            <div
              key={i}
              className="bar-group"
              title={`${d.month}: Revenue $${d.revenue.toLocaleString()}, Expenses $${d.expenses.toLocaleString()}`}
            >
              <div className="bar-column">
                <div
                  className="bar bar-revenue"
                  style={{ height: `${(d.revenue / maxRevenue) * 100}%` }}
                />
                <div
                  className="bar bar-expenses"
                  style={{ height: `${(d.expenses / maxRevenue) * 100}%` }}
                />
              </div>
              <span className="bar-label">{d.month}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#6366f1' }} />
            Revenue
          </span>
          <span className="legend-item">
            <span className="legend-dot" style={{ background: '#a5b4fc' }} />
            Expenses
          </span>
        </div>
      </div>
    </div>
  );
}
