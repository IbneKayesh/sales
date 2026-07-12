import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTabs } from '../../context/TabContext';

export default function TabBar() {
  const { tabs, activeTab, closeTab, closeOtherTabs, closeAllTabs } = useTabs();
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const activeTabRef = useRef(null);
  const [showContextMenu, setShowContextMenu] = useState(null);
  const [showScrollBtns, setShowScrollBtns] = useState(false);

  // Scroll active tab into view
  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeTab]);

  // Check if scrolling is needed
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const check = () => setShowScrollBtns(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [tabs.length]);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  // Close context menu on click outside
  useEffect(() => {
    if (!showContextMenu) return;
    const handler = () => setShowContextMenu(null);
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, [showContextMenu]);

  const handleContextMenu = (e, path) => {
    e.preventDefault();
    setShowContextMenu({ x: e.clientX, y: e.clientY, path });
  };

  if (tabs.length <= 1 && activeTab === '/') {
    // Don't show tab bar when only Dashboard is open and active
    return null;
  }

  return (
    <div className="tab-bar">
      {showScrollBtns && (
        <button className="tab-scroll-btn tab-scroll-left" onClick={() => scroll(-1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
      )}
      <div className="tab-bar-scroll" ref={scrollRef}>
        <div className="tab-bar-inner">
          {tabs.map(tab => (
            <div
              key={tab.id}
              ref={tab.path === activeTab ? activeTabRef : null}
              className={`tab-item ${tab.path === activeTab ? 'active' : ''}`}
              onClick={() => {
                if (tab.path !== activeTab) navigate(tab.path);
              }}
              onContextMenu={(e) => handleContextMenu(e, tab.path)}
            >
              {tab.icon && (
                <span className="tab-icon" dangerouslySetInnerHTML={{ __html: tab.icon }} />
              )}
              <span className="tab-label">{tab.label}</span>
              {tab.closable ? (
                <button
                  className="tab-close"
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.path); }}
                  title="Close tab"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              ) : (
                <span className="tab-close-placeholder" />
              )}
            </div>
          ))}
        </div>
      </div>
      {showScrollBtns && (
        <button className="tab-scroll-btn tab-scroll-right" onClick={() => scroll(1)}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      )}

      {/* Context menu */}
      {showContextMenu && (
        <div
          className="tab-context-menu"
          style={{ left: showContextMenu.x, top: showContextMenu.y }}
        >
          <button onClick={() => { closeTab(showContextMenu.path); setShowContextMenu(null); }}>
            Close
          </button>
          <button onClick={() => { closeOtherTabs(showContextMenu.path); setShowContextMenu(null); }}>
            Close Others
          </button>
          <button onClick={() => { closeAllTabs(); setShowContextMenu(null); }}>
            Close All
          </button>
        </div>
      )}
    </div>
  );
}
