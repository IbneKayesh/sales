export default function StatsCard({ title, value, change, icon, color = '#6366f1', prefix = '', suffix = '' }) {
  const isPositive = change >= 0;
  const formattedValue = typeof value === 'number' ? value.toLocaleString('en-US') : value;

  return (
    <div className="stats-card">
      <div className="stats-card-header">
        <div
          className="stats-card-icon"
          style={{ background: `${color}15`, color }}
          dangerouslySetInnerHTML={{ __html: icon }}
        />
        <span className="stats-card-change" style={{ color: isPositive ? '#059669' : '#dc2626' }}>
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path
              d={isPositive ? "M5 1L9 7H1L5 1Z" : "M5 9L1 3H9L5 9Z"}
              fill="currentColor"
            />
          </svg>
          {Math.abs(change)}%
        </span>
      </div>
      <div className="stats-card-body">
        <span className="stats-card-title">{title}</span>
        <span className="stats-card-value">
          {prefix}{formattedValue}{suffix}
        </span>
      </div>
    </div>
  );
}
