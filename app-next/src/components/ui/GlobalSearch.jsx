import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Search data index ──────────────────────────────
// Built once and cached via module-level closure.

let searchItems = null;

async function ensureSearchIndex() {
  if (searchItems) return searchItems;
  const mock = await import('../../data/mockData');
  searchItems = [
    // ── Orders ──────────────────────────
    ...mock.recentOrders.map(o => ({
      id: o.id,
      label: o.customer,
      description: `${o.product} — $${o.amount.toLocaleString()}`,
      badge: o.status,
      category: 'Orders',
      route: `/sales/${o.id}`,
      keywords: [o.id, o.customer, o.product, o.status],
    })),
    // ── Products ────────────────────────
    ...mock.products.map(p => ({
      id: p.id,
      label: p.name,
      description: `${p.category} — $${p.price.toLocaleString()} · Stock: ${p.stock} ${p.unit}`,
      badge: p.stock <= p.minStock ? (p.stock === 0 ? 'Out' : 'Low') : 'In Stock',
      category: 'Products',
      route: `/inventory/${p.id}`,
      keywords: [p.id, p.name, p.category],
    })),
    // ── Suppliers ────────────────────────
    ...mock.suppliers.map(s => ({
      id: s.id,
      label: s.name,
      description: `${s.contact} · ${s.email}`,
      badge: s.status,
      category: 'Suppliers',
      route: `/purchase/${s.id}`,
      keywords: [s.id, s.name, s.contact, s.email],
    })),
    // ── Purchase Orders ─────────────────
    ...mock.purchaseOrders.map(po => ({
      id: po.id,
      label: po.supplier,
      description: `${po.items} items · $${po.total.toLocaleString()}`,
      badge: po.status,
      category: 'Purchase Orders',
      route: `/purchase/${po.id}`,
      keywords: [po.id, po.supplier],
    })),
    // ── Invoices ────────────────────────
    ...mock.invoices.map(inv => ({
      id: inv.id,
      label: `Invoice ${inv.id}`,
      description: `${inv.customer} · $${inv.amount.toLocaleString()}`,
      badge: inv.status,
      category: 'Invoices',
      route: `/sales/${inv.order}`,
      keywords: [inv.id, inv.customer, inv.order],
    })),
    // ── Returns ─────────────────────────
    ...mock.returns.map(r => ({
      id: r.id,
      label: `Return ${r.id}`,
      description: `${r.customer} · ${r.product} · ${r.reason.substring(0, 40)}${r.reason.length > 40 ? '…' : ''}`,
      badge: r.status,
      category: 'Returns',
      route: '/sales/returns',
      keywords: [r.id, r.customer, r.product, r.reason],
    })),
    // ── Categories ──────────────────────
    ...mock.categories.map(c => ({
      id: c.id,
      label: c.name,
      description: `${c.productCount} products · Avg $${c.avgPrice.toLocaleString()}`,
      badge: null,
      category: 'Categories',
      route: '/inventory/categories',
      keywords: [c.id, c.name],
    })),
    // ── Navigation shortcuts ────────────
    { id: 'nav-dash', label: 'Dashboard', description: 'Go to Dashboard', badge: null, category: 'Navigation', route: '/', keywords: ['dashboard', 'home'] },
    { id: 'nav-sales', label: 'Sales Management', description: 'View all sales orders', badge: null, category: 'Navigation', route: '/sales', keywords: ['sales', 'orders'] },
    { id: 'nav-purchase', label: 'Purchase Management', description: 'View purchase orders', badge: null, category: 'Navigation', route: '/purchase', keywords: ['purchase', 'procurement'] },
    { id: 'nav-inventory', label: 'Inventory Management', description: 'View products and stock', badge: null, category: 'Navigation', route: '/inventory', keywords: ['inventory', 'products', 'stock'] },
    { id: 'nav-new-order', label: 'New Sales Order', description: 'Create a new sales order', badge: null, category: 'Navigation', route: '/sales/create', keywords: ['new order', 'create'] },
    { id: 'nav-returns', label: 'Returns Management', description: 'Manage return requests', badge: null, category: 'Navigation', route: '/sales/returns', keywords: ['returns', 'refund'] },
    { id: 'nav-hr', label: 'HR Management', description: 'Employees, attendance, leave', badge: null, category: 'Navigation', route: '/hr', keywords: ['hr', 'human resources', 'employees'] },
    { id: 'nav-accounting', label: 'Accounting', description: 'Finance, accounts, invoices', badge: null, category: 'Navigation', route: '/accounting', keywords: ['accounting', 'finance', 'accounts'] },
    { id: 'nav-crm', label: 'CRM', description: 'Customer relationship management', badge: null, category: 'Navigation', route: '/crm', keywords: ['crm', 'customers', 'leads'] },
    { id: 'nav-manufacturing', label: 'Manufacturing', description: 'Production and BOM', badge: null, category: 'Navigation', route: '/manufacturing', keywords: ['manufacturing', 'production', 'bom'] },
    { id: 'nav-projects', label: 'Projects', description: 'Project management', badge: null, category: 'Navigation', route: '/projects', keywords: ['projects', 'tasks'] },
    { id: 'nav-supplychain', label: 'Supply Chain', description: 'Suppliers and procurement', badge: null, category: 'Navigation', route: '/supplychain', keywords: ['supply chain', 'procurement'] },
    { id: 'nav-assets', label: 'Assets', description: 'Asset management', badge: null, category: 'Navigation', route: '/assets', keywords: ['assets', 'equipment'] },
    { id: 'nav-settings', label: 'Settings', description: 'System administration', badge: null, category: 'Navigation', route: '/settings', keywords: ['settings', 'admin', 'configuration'] },
  ];
  return searchItems;
}

// ─── Color map for badges ──────────────────────────

const badgeColors = {
  completed: '#059669', paid: '#059669', processing: '#d97706',
  pending: '#d97706', shipped: '#6366f1', cancelled: '#dc2626',
  rejected: '#dc2626', approved: '#059669', overdue: '#dc2626',
  active: '#059669', inactive: '#6b7280', Low: '#d97706', Out: '#dc2626',
  'In Stock': '#059669',
};

// ─── Icon per category ────────────────────────────

const categoryIcons = {
  Orders: '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>',
  Products: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
  Suppliers: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>',
  'Purchase Orders': '<path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>',
  Invoices: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  Returns: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  Categories: '<rect x="2" y="2" width="20" height="20" rx="2" ry="2"/><rect x="6" y="6" width="12" height="12" rx="1"/>',
  Navigation: '<circle cx="12" cy="12" r="10"/><polyline points="12 2 12 12 16 14"/>',
};

export default function GlobalSearch({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState([]);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const [loading, setLoading] = useState(true);

  // Build search index on mount
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    ensureSearchIndex().then(items => {
      setIndex(items);
      setLoading(false);
    });
  }, [open]);

  // Focus input when opened, clear when closed
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(-1);
      // Small delay to allow the animation to start
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // Filter results based on query
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    // Score and filter
    const scored = [];
    index.forEach(item => {
      let score = 0;
      // Check label (highest priority)
      if (item.label.toLowerCase().includes(q)) {
        score += item.label.toLowerCase().startsWith(q) ? 10 : 5;
      }
      // Check keywords
      const hasKeyword = (item.keywords || []).some(kw => kw.toLowerCase().includes(q));
      if (hasKeyword) score += 3;
      // Check description
      if (item.description && item.description.toLowerCase().includes(q)) {
        score += 1;
      }
      if (score > 0) scored.push({ ...item, score });
    });

    // Sort by score descending, then alphabetically
    scored.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));

    // Group by category
    const groups = {};
    scored.forEach(item => {
      if (!groups[item.category]) groups[item.category] = [];
      groups[item.category].push(item);
    });

    return groups;
  }, [query, index]);

  const resultCount = Object.values(results).reduce((sum, arr) => sum + arr.length, 0);

  // Flatten results for keyboard navigation
  const flatResults = useMemo(() => {
    const flat = [];
    Object.entries(results).forEach(([category, items]) => {
      flat.push({ type: 'header', category });
      items.forEach((item, i) => {
        flat.push({ type: 'item', ...item, _groupIdx: i, _category: category });
      });
    });
    return flat;
  }, [results]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIdx(-1);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(prev => {
        const next = prev < flatResults.length - 1 ? prev + 1 : prev;
        // Skip headers
        if (flatResults[next]?.type === 'header') {
          return next < flatResults.length - 1 ? next + 1 : prev;
        }
        return next;
      });
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(prev => {
        const next = prev > 0 ? prev - 1 : -1;
        // Skip headers
        if (flatResults[next]?.type === 'header') {
          return next > 0 ? next - 1 : -1;
        }
        return next;
      });
    }

    if (e.key === 'Enter' && selectedIdx >= 0) {
      e.preventDefault();
      const item = flatResults[selectedIdx];
      if (item && item.type === 'item') {
        navigate(item.route);
        onClose();
      }
    }
  }, [flatResults, selectedIdx, navigate, onClose]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIdx < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-idx="${selectedIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  if (!open) return null;

  const handleSelect = (item) => {
    navigate(item.route);
    onClose();
  };

  return (
    <>
      <div className="global-search-backdrop" onClick={onClose} />
      <div className="global-search-container">
        <div className="global-search-input-wrapper">
          <svg className="global-search-magnifier" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            className="global-search-input"
            type="text"
            placeholder="Search orders, products, suppliers, pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck={false}
          />
          {query && (
            <button className="global-search-clear" onClick={() => setQuery('')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <kbd className="global-search-esc-hint">ESC</kbd>
        </div>

        <div className="global-search-results" ref={listRef}>
          {loading ? (
            <div className="global-search-loading">
              <div className="global-search-spinner" />
              <span>Loading search index...</span>
            </div>
          ) : query.trim() && resultCount === 0 ? (
            <div className="global-search-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.3 }}>
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <span className="global-search-empty-title">No results found</span>
              <span className="global-search-empty-desc">Try a different search term</span>
            </div>
          ) : query.trim() ? (
            <div className="global-search-grouped">
              {Object.entries(results).map(([category, items]) => (
                <div key={category} className="global-search-group">
                  <div className="global-search-group-header">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      dangerouslySetInnerHTML={{ __html: categoryIcons[category] || '' }} />
                    <span>{category}</span>
                    <span className="global-search-group-count">{items.length}</span>
                  </div>
                  {items.map((item) => {
                    // Find flat index
                    const flatIdx = flatResults.findIndex(f => f.type === 'item' && f.id === item.id);
                    const isSelected = flatIdx === selectedIdx;
                    return (
                      <div
                        key={item.id}
                        className={`global-search-item ${isSelected ? 'selected' : ''}`}
                        data-idx={flatIdx}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIdx(flatIdx)}
                      >
                        <div className="global-search-item-info">
                          <span className="global-search-item-label">{highlightMatch(item.label, query)}</span>
                          <span className="global-search-item-desc">{item.description}</span>
                        </div>
                        <div className="global-search-item-meta">
                          {item.badge && (
                            <span className="global-search-item-badge" style={{
                              background: `${badgeColors[item.badge] || '#6b7280'}15`,
                              color: badgeColors[item.badge] || '#6b7280',
                            }}>
                              {item.badge}
                            </span>
                          )}
                          <span className="global-search-item-arrow">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 18l6-6-6-6" />
                            </svg>
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ) : (
            <div className="global-search-hint">
              <div className="global-search-hint-content">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <span>Type to search across all ERP modules</span>
                <div className="global-search-hint-shortcuts">
                  <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                  <span><kbd>↵</kbd> Open</span>
                  <span><kbd>ESC</kbd> Close</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {resultCount > 0 && (
          <div className="global-search-footer">
            <span className="global-search-footer-text">
              {resultCount} result{resultCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Highlight matching portions of text in search results.
 */
function highlightMatch(text, query) {
  if (!query || !text) return text;
  const q = query.toLowerCase();
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return text;
  return (
    <>
      {text.substring(0, idx)}
      <mark className="global-search-highlight">{text.substring(idx, idx + q.length)}</mark>
      {text.substring(idx + q.length)}
    </>
  );
}
