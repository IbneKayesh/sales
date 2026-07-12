import { useState, useMemo } from 'react';

export default function GridView({
  data,
  renderCard,
  searchable = false,
  searchPlaceholder = 'Search...',
  filterKey = null,
  emptyMessage = 'No items found',
  columns = 3,
  onCardClick,
}) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search) return data;
    const q = search.toLowerCase();
    return data.filter(item =>
      Object.values(item).some(val => {
        if (val == null) return false;
        return String(val).toLowerCase().includes(q);
      })
    );
  }, [data, search]);

  return (
    <div className="grid-view-wrapper">
      {searchable && (
        <div className="grid-toolbar">
          <div className="search-box">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="grid-count">{filtered.length} items</span>
        </div>
      )}
      <div
        className="grid-view"
        style={{
          gridTemplateColumns: `repeat(auto-fill, minmax(${Math.max(240, Math.floor(900 / columns))}px, 1fr))`,
        }}
      >
        {filtered.length === 0 ? (
          <div className="grid-empty">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>{emptyMessage}</span>
          </div>
        ) : (
          filtered.map((item, i) => (
            <div
              key={item.id || i}
              className={`grid-card ${onCardClick ? 'clickable-card' : ''}`}
              onClick={() => onCardClick?.(item)}
            >
              {renderCard(item)}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
