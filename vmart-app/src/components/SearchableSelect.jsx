import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiChevronDown } from "react-icons/fi";

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
    <div ref={wrapperRef} style={{ position: "relative" }}>
      <div style={{ position: "relative" }}>
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
          style={{ paddingRight: 32, cursor: "text" }}
        />
        <FiChevronDown
          style={{
            position: "absolute",
            right: 10,
            top: "50%",
            transform: open ? "rotate(180deg)" : "none",
            transition: "transform 0.15s ease",
            pointerEvents: "none",
            color: "var(--text-subtle)",
            fontSize: 16,
          }}
        />
      </div>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{
            ...menuStyle,
            zIndex: 9999,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            maxHeight: 220,
            overflowY: "auto",
          }}
        >
          {filtered.length === 0 ? (
            <div
              style={{
                padding: "var(--space-3)",
                color: "var(--text-subtle)",
                fontSize: "0.85rem",
                textAlign: "center",
              }}
            >
              {emptyMessage}
            </div>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => handleSelect(opt)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "var(--space-3)",
                  border: "none",
                  background: opt === value ? "var(--accent-soft)" : "transparent",
                  color: opt === value ? "var(--accent)" : "var(--text)",
                  font: "inherit",
                  colorScheme: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  transition: "background 0.1s ease",
                }}
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
