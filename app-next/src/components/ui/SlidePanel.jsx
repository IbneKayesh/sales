import { createContext, useContext, useState, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── Loading skeleton ─────────────────────────────────────

function PanelSkeleton() {
  return (
    <div className="panel-skeleton">
      <div className="panel-skeleton-header">
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-badge" />
      </div>
      <div className="panel-skeleton-body">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="skeleton-field">
            <div className="skeleton-line skeleton-label" />
            <div className="skeleton-line skeleton-value" />
          </div>
        ))}
      </div>
      <div className="panel-skeleton-footer">
        <div className="skeleton-line skeleton-btn" />
      </div>
    </div>
  );
}

// ─── Context ──────────────────────────────────────────────

const SlidePanelContext = createContext(null);

export function SlidePanelProvider({ children }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(null);
  const [panelTitle, setPanelTitle] = useState('');
  const [panelBadge, setPanelBadge] = useState(null);
  const [panelLinkPath, setPanelLinkPath] = useState(null);
  const [hasPrev, setHasPrev] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [hasNav, setHasNav] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const abortRef = useRef(null);
  const panelRef = useRef(null);
  const wasOpenRef = useRef(false);
  const pendingScrollRestore = useRef(0);
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);

  // Restore scroll position after content swap
  useLayoutEffect(() => {
    if (panelRef.current && pendingScrollRestore.current > 0) {
      panelRef.current.scrollTop = pendingScrollRestore.current;
      pendingScrollRestore.current = 0;
    }
  }, [content]);

  const closePanel = useCallback(() => {
    wasOpenRef.current = false;
    pendingScrollRestore.current = 0;
    setIsOpen(false);
    setIsLoading(false);
    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }
    setTimeout(() => {
      setContent(null);
      setPanelTitle('');
      setPanelBadge(null);
      setPanelLinkPath(null);
      setHasPrev(false);
      setHasNext(false);
      setHasNav(false);
      navPrevRef.current = null;
      navNextRef.current = null;
    }, 250);
  }, []);

  const navigateDetail = useCallback(() => {
    if (panelLinkPath) {
      const path = panelLinkPath;
      closePanel();
      // Wait for panel slide-out animation to finish before navigating
      setTimeout(() => navigate(path), 300);
    }
  }, [panelLinkPath, closePanel, navigate]);

  const openPanel = useCallback((loader, title, badge, opts) => {
    // Backward compat: if opts is a string, treat as linkPath
    const linkPath = opts && typeof opts === 'object' ? opts.linkPath : opts || null;
    const nav = opts && typeof opts === 'object' ? opts.nav : null;

    setPanelTitle(title || '');
    setPanelBadge(badge || null);
    setPanelLinkPath(linkPath);

    if (nav) {
      navPrevRef.current = nav.onPrev || null;
      navNextRef.current = nav.onNext || null;
      setHasPrev(!!nav.hasPrev);
      setHasNext(!!nav.hasNext);
      setHasNav(true);
    } else {
      navPrevRef.current = null;
      navNextRef.current = null;
      setHasPrev(false);
      setHasNext(false);
      setHasNav(false);
    }

    if (abortRef.current) {
      abortRef.current();
      abortRef.current = null;
    }

    // Save scroll position before content swap
    if (wasOpenRef.current) {
      pendingScrollRestore.current = panelRef.current?.scrollTop ?? 0;
    }
    wasOpenRef.current = true;

    if (typeof loader === 'function') {
      setIsLoading(true);
      setContent(null);
      setIsOpen(true);

      let aborted = false;
      abortRef.current = () => { aborted = true; };

      Promise.resolve(loader()).then((node) => {
        if (!aborted) {
          setContent(node);
          setIsLoading(false);
          abortRef.current = null;
        }
      }).catch(() => {
        if (!aborted) {
          setContent(
            <div className="panel-error">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <h3>Failed to load</h3>
              <p>The item data could not be loaded. Please try again.</p>
              <button className="btn-primary" onClick={closePanel}>Close</button>
            </div>
          );
          setIsLoading(false);
          abortRef.current = null;
        }
      });
    } else {
      setContent(loader);
      setIsLoading(false);
      setIsOpen(true);
    }
  }, []);

  // Track scroll state for sticky header shadow
  const handleScroll = useCallback(() => {
    if (panelRef.current) {
      setScrolled(panelRef.current.scrollTop > 0);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    // Reset scrolled state when panel opens
    if (isOpen) setScrolled(false);
    const panel = panelRef.current;
    if (panel) {
      panel.addEventListener('scroll', handleScroll, { passive: true });
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') closePanel();
      if (e.key === 'ArrowLeft' && navPrevRef.current) navPrevRef.current();
      if (e.key === 'ArrowRight' && navNextRef.current) navNextRef.current();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      if (panel) panel.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, closePanel, handleScroll]);

  return (
    <SlidePanelContext.Provider value={{ isOpen, isLoading, openPanel, closePanel }}>
      {children}

      <div
        className={`slide-backdrop ${isOpen ? 'visible' : ''}`}
        onClick={closePanel}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      />

      <div className={`slide-panel ${isOpen ? 'open' : ''}`} ref={panelRef} role="dialog" aria-modal="true">
        <div className={`slide-panel-header ${scrolled ? 'scrolled' : ''}`}>
          <div className="slide-panel-title-group">
            {panelBadge && (
              <span
                className="slide-panel-badge"
                style={{ background: panelBadge.bg, color: panelBadge.color }}
              >
                <span className="slide-panel-badge-dot" style={{ background: panelBadge.color }} />
                {panelBadge.label}
              </span>
            )}
            {panelLinkPath ? (
              <button className="slide-panel-title slide-panel-title-link" onClick={navigateDetail} title="Open detail page">
                {isLoading ? 'Loading...' : panelTitle}
                <svg className="slide-panel-title-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </button>
            ) : (
              <span className="slide-panel-title">
                {isLoading ? 'Loading...' : panelTitle}
              </span>
            )}
          </div>

          {hasNav && (
            <div className="slide-panel-nav-group">
              <button
                className={`slide-panel-nav-btn ${hasPrev ? '' : 'disabled'}`}
                onClick={() => navPrevRef.current?.()}
                disabled={!hasPrev}
                aria-label="Previous item"
                title="Previous (←)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              <button
                className={`slide-panel-nav-btn ${hasNext ? '' : 'disabled'}`}
                onClick={() => navNextRef.current?.()}
                disabled={!hasNext}
                aria-label="Next item"
                title="Next (→)"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          )}

          {panelLinkPath && (
            <button
              className="slide-panel-open-btn"
              onClick={navigateDetail}
              aria-label="Open full detail page"
              title="Open full detail page"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </button>
          )}

          <button className="slide-panel-close" onClick={closePanel} aria-label="Close panel">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="slide-panel-body">
          {isLoading ? <PanelSkeleton /> : content}
        </div>
      </div>
    </SlidePanelContext.Provider>
  );
}

export function useSlidePanel() {
  const ctx = useContext(SlidePanelContext);
  if (!ctx) throw new Error('useSlidePanel must be used within a SlidePanelProvider');
  return ctx;
}
