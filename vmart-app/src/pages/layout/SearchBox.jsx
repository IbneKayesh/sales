import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getStorageData, setStorageData } from "@/utils/storage";
import "./SearchBox.css";

const SearchBox = ({ visible, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [userMenus, setUserMenus] = useState([]);
  const [recentLinks, setRecentLinks] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [pinnedItems, setPinnedItems] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  // Load initial data
  useEffect(() => {
    if (visible) {
      const data = getStorageData();
      setUserMenus(data.menus || []);
      setRecentLinks(data.recent_links || []);
      setRecentSearches(data.recent_searches || []);
      setPinnedItems(data.pinned_searches || []);
      
      setSearchTerm("");
      setActiveIndex(0);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 50);
    }
  }, [visible]);

  // Generic flat list of searchable items
  const searchableItems = useMemo(() => {
    return userMenus
      .filter(m => m.menus_mlink && m.menus_mlink !== "NA")
      .map(m => ({
        id: m.id,
        label: m.menus_mname || m.label,
        link: m.menus_mlink,
        icon: m.menus_micon && m.menus_micon !== "default" ? m.menus_micon : "pi-circle-fill",
        type: "menu",
        category: "Menu",
        notes: m.menus_notes
      }));
  }, [userMenus]);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    return searchableItems.filter(item => 
      item.label?.toLowerCase().includes(term) ||
      item.notes?.toLowerCase().includes(term) ||
      item.link?.toLowerCase().includes(term)
    );
  }, [searchableItems, searchTerm]);

  const handleItemClick = useCallback((item) => {
    if (item.link) {
      navigate(item.link);
    }
    
    // Save to Recent Searches if it was a manual search
    if (searchTerm.trim()) {
      const data = getStorageData();
      const currentSearches = data.recent_searches || [];
      const updatedSearches = [
        searchTerm.trim(),
        ...currentSearches.filter(s => s !== searchTerm.trim())
      ].slice(0, 10);
      
      setStorageData({ recent_searches: updatedSearches });
      setRecentSearches(updatedSearches);
    }

    onClose();
  }, [navigate, onClose, searchTerm]);

  const handleSearchClick = (text) => {
    setSearchTerm(text);
    if (inputRef.current) inputRef.current.focus();
  };

  const clearRecentSearches = (e) => {
    e.stopPropagation();
    setStorageData({ recent_searches: [] });
    setRecentSearches([]);
  };

  const togglePin = (e, item) => {
    e.stopPropagation();
    const data = getStorageData();
    const currentPinned = data.pinned_searches || [];
    const isPinned = currentPinned.some(p => p.id === item.id);
    
    let updated;
    if (isPinned) {
      updated = currentPinned.filter(p => p.id !== item.id);
    } else {
      updated = [...currentPinned, item];
    }
    
    setStorageData({ pinned_searches: updated });
    setPinnedItems(updated);
  };

  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (e) => {
      const itemsCount = searchTerm.trim() 
        ? searchResults.length 
        : (pinnedItems.length + recentSearches.length + recentLinks.length);

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex(prev => itemsCount > 0 ? (prev + 1) % itemsCount : 0);
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex(prev => itemsCount > 0 ? (prev - 1 + itemsCount) % itemsCount : 0);
      } else if (e.key === "Enter") {
        if (searchTerm.trim()) {
          if (searchResults[activeIndex]) {
            handleItemClick(searchResults[activeIndex]);
          }
        } else {
          let currentPos = 0;
          if (activeIndex < pinnedItems.length) {
            handleItemClick(pinnedItems[activeIndex]);
            return;
          }
          currentPos += pinnedItems.length;
          if (activeIndex < currentPos + recentSearches.length) {
            handleSearchClick(recentSearches[activeIndex - currentPos]);
            return;
          }
          currentPos += recentSearches.length;
          if (activeIndex < currentPos + recentLinks.length) {
            handleItemClick(recentLinks[activeIndex - currentPos]);
            return;
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onClose, searchTerm, searchResults, recentLinks, recentSearches, pinnedItems, activeIndex, handleItemClick]);

  useEffect(() => {
    setActiveIndex(0);
  }, [searchTerm]);

  if (!visible) return null;

  return (
    <div className="search-box-overlay" onClick={onClose}>
      <div className="search-box-container" onClick={(e) => e.stopPropagation()}>
        <div className="search-box-header">
          <div className="search-box-input-wrapper">
            <i className="pi pi-search search-icon"></i>
            <input
              ref={inputRef}
              type="text"
              className="search-box-input"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="search-box-content">
          {searchTerm.trim() ? (
            <>
              <div className="search-section-title">Results</div>
              {searchResults.length > 0 ? (
                searchResults.map((item, index) => {
                  const isPinned = pinnedItems.some(p => p.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`search-item ${index === activeIndex ? "active" : ""} ${isPinned ? "pinned" : ""}`}
                      onClick={() => handleItemClick(item)}
                    >
                      <i className={`pi ${item.icon} item-icon`}></i>
                      <div className="item-info">
                        <span className="item-label">{item.label}</span>
                        <span className="item-category">{item.category}</span>
                      </div>
                      <div className="pin-btn" onClick={(e) => togglePin(e, item)}>
                        <i className={`pi ${isPinned ? "pi-bookmark-fill" : "pi-bookmark"}`}></i>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="search-no-results">
                  <i className="pi pi-search-minus"></i>
                  <span>No results for "{searchTerm}"</span>
                </div>
              )}
            </>
          ) : (
            <>
              {pinnedItems.length > 0 && (
                <>
                  <div className="search-section-title">Pinned</div>
                  <div className="pinned-badges-container">
                    {pinnedItems.map((item, index) => (
                      <div
                        key={`pinned-${item.id}`}
                        className={`pinned-badge ${index === activeIndex ? "active" : ""}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <i className={`pi ${item.icon}`} style={{fontSize: '0.75rem'}}></i>
                        {item.label}
                        <i 
                          className="pi pi-times unpin-action" 
                          onClick={(e) => { e.stopPropagation(); togglePin(e, item); }}
                        ></i>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {recentSearches.length > 0 && (
                <>
                  <div className="search-section-title" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    Recent Searches
                    <span 
                      className="clear-recent-btn" 
                      onClick={clearRecentSearches}
                      style={{fontSize: '0.65rem', color: 'var(--primary)', cursor: 'pointer', textTransform: 'none', fontWeight: '500'}}
                    >
                      Clear
                    </span>
                  </div>
                  <div className="search-badges-container">
                    {recentSearches.map((text, index) => {
                      const globalIndex = index + pinnedItems.length;
                      return (
                        <div
                          key={`search-${index}`}
                          className={`search-badge ${globalIndex === activeIndex ? "active" : ""}`}
                          onClick={() => handleSearchClick(text)}
                        >
                          {text}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {recentLinks.length > 0 && (
                <>
                  <div className="search-section-title">Recent Pages</div>
                  {recentLinks.map((item, index) => {
                    const globalIndex = index + pinnedItems.length + recentSearches.length;
                    return (
                      <div
                        key={item.id}
                        className={`search-item ${globalIndex === activeIndex ? "active" : ""}`}
                        onClick={() => handleItemClick(item)}
                      >
                        <i className={`pi ${item.icon || "pi-link"} item-icon`}></i>
                        <div className="item-info">
                          <span className="item-label">{item.label}</span>
                          <span className="item-category">Recent</span>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}
        </div>

        <div className="search-footer">
          <div className="search-hint"><kbd>ESC</kbd> Close</div>
          <div className="search-hint"><kbd>↵</kbd> Select</div>
        </div>
      </div>
    </div>
  );
};

export default SearchBox;
