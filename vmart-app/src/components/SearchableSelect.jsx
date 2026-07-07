import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";
import "./SearchableSelect.css";

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Search...",
  emptyMessage = "No results found",
  id = "searchable-select-input",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState({});
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const menuRef = useRef(null);

  /* Filter options by query */
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  /* Close on click outside */
  useEffect(() => {
    const handleClick = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* Focus input when dropdown opens */
  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  /* Reposition on scroll/resize when open */
  useEffect(() => {
    if (!open) return;
    const reposition = () => positionMenu();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  const positionMenu = () => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    const menuHeight = Math.min(220, options.length * 36 + 16);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const top = (spaceBelow < menuHeight && spaceAbove > menuHeight)
      ? Math.max(rect.top - menuHeight - 4, 4)
      : rect.bottom + 4;
    setMenuStyle({
      position: "fixed",
      top,
      left: rect.left,
      width: rect.width,
      minWidth: 200,
    });
  };

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
    setQuery("");
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!open) { positionMenu(); setOpen(true); }
    /* If user clears input, reset selection */
    if (val === "" && value !== "") {
      onChange("");
    }
  };

  const handleFocus = () => {
    positionMenu();
    setOpen(true);
  };

  /* Show the selected value in the input when closed */
  const inputValue = open ? query : value;

  return (
    <div ref={wrapperRef} className="ss-wrapper">
      <div className="ss-input-wrapper">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={id}
          className="ui-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        <FiChevronDown
          className={`ss-chevron${open ? " ss-chevron--open" : ""}`}
        />
      </div>

      {open && createPortal(
        <div
          ref={menuRef}
          className="ss-menu"
          style={menuStyle}
        >
          {filtered.length === 0 ? (
            <div className="ss-empty">
              {emptyMessage}
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`ss-option${opt === value ? " ss-option--selected" : ""}`}
                onMouseEnter={(e) => {
                  if (opt !== value) e.currentTarget.style.background = "var(--accent-soft)";
                }}
                onMouseLeave={(e) => {
                  if (opt !== value) e.currentTarget.style.background = "transparent";
                }}
              >
                {opt}
              </button>
            ))
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
