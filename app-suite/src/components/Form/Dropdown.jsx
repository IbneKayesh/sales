import React, { useState, useRef, useEffect, useMemo, useCallback, useId, useLayoutEffect } from 'react';
import { IconSearch, IconChevronDown, IconClose } from '@/assets/icons';
import styles from './Dropdown.module.css';

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
    <div className={`${styles.wrapper} ${className || ''}`} ref={containerRef}>
      {label && (
        <label className={styles.label} htmlFor={dropdownId}>
          {label}
          {required && <span className={styles.required}> *</span>}
        </label>
      )}

      <button
        id={dropdownId}
        type="button"
        className={`${styles.trigger} ${isOpen ? styles.triggerOpen : ''} ${error ? styles.triggerError : ''} ${disabled ? styles.triggerDisabled : ''}`}
        onClick={toggle}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        disabled={disabled}
      >
        <span className={`${styles.triggerText} ${!selectedOption ? styles.triggerPlaceholder : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={styles.triggerIcons}>
          {clearable && value && (
            <span className={styles.clearBtn} onClick={handleClear} role="button" aria-label="Clear selection">
              <IconClose size={12} />
            </span>
          )}
          <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}>
            <IconChevronDown size={14} />
          </span>
        </span>
      </button>

      {error && <span className={styles.errorText}>{error}</span>}

      {/* ── Dropdown Panel ──────────────────────────────────────────── */}
      {isOpen && (
        <div
          ref={panelRef}
          className={`${styles.panel} ${flipUp ? styles.panelUp : styles.panelDown}`}
          role="listbox"
          aria-label={label || 'Select options'}
        >
          {searchable && (
            <div className={styles.searchWrapper}>
              <IconSearch className={styles.searchIcon} />
              <input
                ref={searchRef}
                type="text"
                className={styles.searchInput}
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button className={styles.searchClear} onClick={() => setSearch('')}>
                  <IconClose size={12} />
                </button>
              )}
            </div>
          )}

          <div className={styles.optionsList}>
            {filteredOptions.length === 0 ? (
              <div className={styles.emptyState}>
                {search ? `No results for "${search}"` : 'No options available'}
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`${styles.optionItem} ${isSelected ? styles.optionSelected : ''}`}
                    onClick={() => handleSelect(opt)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {opt.icon && (
                      <span className={styles.optionIcon}>{opt.icon}</span>
                    )}
                    <span className={styles.optionLabel}>
                      {opt.label || String(opt.value)}
                    </span>
                    {isSelected && <span className={styles.optionCheck}>✓</span>}
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
