import StatsCard from '../ui/StatsCard';

/**
 * Responsive row of StatsCards for page-level KPIs.
 * Each stat is an object with: title, value, change, prefix?, color, icon?
 */
export default function StatsRow({ stats }) {
  if (!stats || stats.length === 0) return null;

  return (
    <div className="stats-grid">
      {stats.map((s, i) => (
        <StatsCard
          key={i}
          title={s.title}
          value={s.value}
          change={s.change}
          prefix={s.prefix}
          color={s.color}
          icon={s.icon}
        />
      ))}
    </div>
  );
}
