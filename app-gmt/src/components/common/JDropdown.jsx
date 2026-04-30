import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import JInput from './JInput';
import './JDropdown.css';

const JDropdown = ({ 
  label, 
  options = [], 
  value,
  onChange,
  error, 
  size = 'md', 
  placeholder = 'Select...',
  className = '', 
  disabled = false,
  ...props 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const optionRefs = useRef([]);

  const selectedOption = options.find(opt => opt.value === value);

  const filteredOptions = options.filter(opt => 
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(opt.value).toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
      optionRefs.current[focusedIndex]?.focus();
    }
  }, [focusedIndex, filteredOptions.length]);

  const handleSelect = (opt) => {
    if (onChange) onChange(opt.value);
    setIsOpen(false);
    setSearchTerm('');
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, filteredOptions.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[focusedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case 'Tab':
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <div 
      className={`j-dropdown-container j-dropdown-${size} ${disabled ? 'disabled' : ''} ${className}`} 
      style={{ zIndex: isOpen ? 1000 : 1 }}
      ref={dropdownRef}
    >
      {label && <label className="j-dropdown-label">{label}</label>}
      
      <div 
        className={`j-dropdown-trigger ${isOpen ? 'active' : ''} ${error ? 'error' : ''}`} 
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={`trigger-text ${!selectedOption ? 'placeholder' : ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className="trigger-arrow" aria-hidden="true"><ChevronDown size={16} /></span>
      </div>

      {isOpen && (
        <div className="j-dropdown-menu slide-in" role="listbox">
          <div className="j-dropdown-search">
            <JInput 
              size="sm" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <div className="j-dropdown-options">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div 
                  key={idx}
                  ref={el => optionRefs.current[idx] = el}
                  className={`j-dropdown-option ${value === opt.value ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelect(opt);
                    }
                  }}
                  role="option"
                  aria-selected={value === opt.value}
                  tabIndex={-1}
                >
                  {opt.label}
                </div>
              ))
            ) : (
              <div className="j-dropdown-no-results">No results found</div>
            )}
          </div>
        </div>
      )}
      
      {error && <span className="j-dropdown-error-text">{error}</span>}
    </div>
  );
};

export default JDropdown;
