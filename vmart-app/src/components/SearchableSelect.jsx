import { useState, useRef, useEffect } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function SearchableSelect({
  value,
  onChange,
  options,
  placeholder = "Search...",
  emptyMessage = "No results found",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  /* Filter options by query */
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase())
  );

  /* Close on click outside */
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
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

  const handleSelect = (opt) => {
    onChange(opt);
    setOpen(false);
    setQuery("");
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (!open) setOpen(true);
    /* If user clears input, reset selection */
    if (val === "" && value !== "") {
      onChange("");
    }
  };

  const handleFocus = () => {
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

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            right: 0,
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow)",
            zIndex: 50,
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
                  if (opt !== value) e.target.style.background = "var(--accent-soft)";
                }}
                onMouseLeave={(e) => {
                  if (opt !== value) e.target.style.background = "transparent";
                }}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
