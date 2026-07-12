import DataTable from '../../components/ui/DataTable';
import { alertColumns } from './inventoryConfig';

export default function StockAlertsSection({ products, categorySummary }) {
  const currentLow = products.filter(p => p.stock <= p.minStock && p.stock > 0);
  const currentOut = products.filter(p => p.stock === 0);
  const hasAlerts = currentLow.length > 0 || currentOut.length > 0;

  const total = categorySummary.reduce((s, c) => s + c.value, 0);

  return (
    <div className="inventory-alerts-row">
      {hasAlerts && (
        <div className="chart-card alerts-card">
          <div className="card-header">
            <h3>Stock Alerts</h3>
            <span className="card-subtitle">Items requiring attention</span>
          </div>
          <DataTable columns={alertColumns} data={[...currentOut, ...currentLow]} pageSize={5} />
        </div>
      )}
      <div className="chart-card category-chart">
        <div className="card-header">
          <h3>Category Distribution</h3>
          <span className="card-subtitle">Products by category</span>
        </div>
        <div className="chart-body">
          <div className="category-pie">
            {categorySummary.map(cat => {
              const pct = ((cat.value / total) * 100).toFixed(1);
              return (
                <div key={cat.name} className="category-pie-row">
                  <div className="category-pie-icon" style={{ background: cat.color }} />
                  <span className="category-pie-name">{cat.name}</span>
                  <div className="category-pie-track">
                    <div className="category-pie-fill" style={{ width: `${pct}%`, background: cat.color }} />
                  </div>
                  <span className="category-pie-value">{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
