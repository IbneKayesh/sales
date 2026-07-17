import { useState, useRef, useEffect, useMemo, useCallback, useId, useLayoutEffect } from 'react';

import { IconSearch, IconChevronDown, IconClose } from '@/assets/icons';
import './Dropdown.css';
const Dropdown = ({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select…',
  searchPlaceholder = 'Search…',
  searchable = true,
  id: externalId,
  error,
  required,
  disabled,
  clearable = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [flipUp, setFlipUp] = useState(false);
  const containerRef = useRef(null);
  const panelRef = useRef(null);
  const searchRef = useRef(null);
  const generatedId = useId();
  const dropdownId = externalId || generatedId;

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value]
  );

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return options;
    return options.filter((opt) =>
      (opt.label || String(opt.value)).toLowerCase().includes(q)
    );
  }, [options, search]);

  const close = useCallback(() => {
    setIsOpen(false);
    setSearch('');
  }, []);

  const toggle = () => {
    if (disabled) return;
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (opt) => {
    onChange?.(opt.value);
    close();
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.('');
    close();
  };

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      searchRef.current?.focus();
    }
  }, [isOpen]);

  // Measure available space and flip panel up if it would overflow viewport
  useLayoutEffect(() => {
    if (!isOpen) {
      setFlipUp(false);
      return;
    }

    const panel = panelRef.current;
    const container = containerRef.current;
    if (!panel || !container) return;

    const rect = container.getBoundingClientRect();
    const panelHeight = panel.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (panelHeight > spaceBelow && spaceAbove > panelHeight) {
      setFlipUp(true);
    } else {
      setFlipUp(false);
    }
  }, [isOpen]);

  // Close on escape, click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        close();
      }
    };
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        close();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isOpen, close]);

  return (
    <div className={`pos-relative d-flex flex-column gap-2 ${className || ''}`} ref={containerRef}>
      {label && (
        <label className="fs-10 fw-600 text-secondary text-uppercase user-select-none" htmlFor={dropdownId} style={{letterSpacing:'0.3px'}}>
          {label}
          {required && <span className="text-danger"> *</span>}
        </label>
      )}

      <button
        id={dropdownId}
        type="button"
        className={`d-flex ai-center jc-between gap-1 w-100 px-2 py-1-5 rounded-sm border bg-transparent fs-11 text-left cursor-pointer user-select-none ${isOpen ? 'triggerOpen' : ''} ${error ? 'triggerError' : ''} ${disabled ? 'triggerDisabled' : ''}`}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className={`flex-1 text-nowrap text-truncate ${!selectedOption ? 'text-muted' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="d-flex ai-center gap-0 flex-shrink-0">
          {clearable && value && (
            <span className="d-flex ai-center jc-center w-14 h-14 rounded-circle text-muted" onClick={handleClear} role="button" aria-label="Clear selection" style={{transition:'all 0.12s ease'}}>
              <IconClose size={12} />
            </span>
          )}
          <span className={`d-flex ai-center text-muted ${isOpen ? 'arrowOpen' : ''}`}>
            <IconChevronDown size={14} />
          </span>
        </span>
      </button>

      {error && <span className="fs-9 text-danger" style={{lineHeight:'1.2', minHeight:'10px'}}>{error}</span>}

      {/* ── Dropdown Panel ──────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`panel ${flipUp ? 'panelUp' : 'panelDown'}`}
          role="listbox"
          aria-label={label || 'Select options'}
        >
          {searchable && (
            <div className="pos-relative d-flex ai-center px-1-5 py-1-5 border-bottom" style={{borderColor:'var(--glass-border-medium)'}}>
              <IconSearch className="pos-absolute w-12 h-12 text-muted pointer-events-none" style={{left:'12px'}} />
              <input
                ref={searchRef}
                type="text"
                className="searchInput w-100 px-1-5 py-1 rounded-sm border bg-none fs-11 text-primary"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className="pos-absolute d-flex ai-center jc-center w-14 h-14 rounded-circle text-muted" onClick={() => setSearch('')} style={{right:'10px'}}>
                  <IconClose size={12} />
                </button>
              )}
            </div>
          )}

          <div className="optionsList overflow-y-auto" style={{maxHeight:'300px', padding:'2px'}}>
            {filteredOptions.length === 0 ? (
              <div className="py-3 px-2 text-center fs-11 text-muted">
                {search ? `No results for "${search}"` : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`d-flex ai-center gap-1 w-100 px-2 py-1 rounded-sm fs-11 fw-500 text-secondary bg-none border-none text-left cursor-pointer ${isSelected ? 'optionSelected' : ''}`}
                    onClick={() => handleSelect(opt)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {opt.icon && (
                      <span className="d-flex ai-center flex-shrink-0">{opt.icon}</span>
                    )}
                    <span className="flex-1 text-nowrap text-truncate">
                      {opt.label || String(opt.value)}
                    </span>
                    {isSelected && <span className="flex-shrink-0 fs-10 text-accent">✓</span>}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
