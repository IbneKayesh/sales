import { useState, useRef, useEffect, useId } from "react";
import { IconClose, IconChevronDown, IconSearch, IconCheck } from "../icons";

/* ------------------------------------------------------------------ */
/* optionGrid helpers                                                  */
/*                                                                    */
/* optionGrid is a comma-separated list of columns, e.g.              */
/*   "price_cname, price_lprat, price_mrrat"                          */
/* Each column may carry a custom header via key:Label syntax:        */
/*   "price_cname:Item, price_lprat:Last Rate"                        */
/* When optionGrid is omitted the dropdown renders as a plain list.   */
/* ------------------------------------------------------------------ */

const humanizeKey = (key) =>
  String(key)
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .trim();

const parseOptionGrid = (grid) => {
  if (!grid) return [];
  return String(grid)
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean)
    .map((token) => {
      const parts = token.split(":").map((p) => p.trim());
      const key = parts[0];
      const label = parts.slice(1).join(":") || humanizeKey(key);
      return { key, label };
    });
};

const formatCellValue = (val) => {
  if (val === null || val === undefined || val === "") return "—";
  if (typeof val === "boolean") return val ? "Yes" : "No";
  if (typeof val === "number") {
    return Number.isInteger(val)
      ? val.toLocaleString()
      : val.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
  }
  return String(val);
};

export default function Dropdown({
  label,
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchable = true,
  clearable = false,
  disabled = false,
  required = false,
  name,
  error,
  dense = false,
  className = "",
  optionLabel = "label",
  optionValue = "value",
  optionGrid,
  gridMinWidth = 0,
  gridMaxHeight = 240,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const [hoverIdx, setHoverIdx] = useState(null);
  const wrapRef = useRef(null);
  const searchRef = useRef(null);
  const fallbackId = useId();
  const inputId = name || fallbackId;

  const columns = parseOptionGrid(optionGrid);
  const isGrid = columns.length > 0;

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
        setHoverIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const filtered =
    searchable && search
      ? options.filter((opt) => {
          if (isGrid) {
            const q = search.toLowerCase();
            return columns.some((c) =>
              String(opt?.[c.key] ?? "")
                .toLowerCase()
                .includes(q),
            );
          }
          return String(opt?.[optionLabel] ?? "")
            .toLowerCase()
            .includes(search.toLowerCase());
        })
      : options;

  const selected = options.find((opt) => opt?.[optionValue] === value);

  const displayText = selected?.[optionLabel] || placeholder;

  const gridTemplate = isGrid
    ? columns.map(() => "max-content").join(" ")
    : "";

  const toggleOpen = () => {
    if (disabled) return;
    setHoverIdx(null);
    setOpen((prev) => !prev);
  };

  const handleSelect = (opt) => {
    if (onChange) {
      onChange({
        target: {
          value: opt?.[optionValue] ?? "",
          name,
        },
      });
    }
    setOpen(false);
    setSearch("");
    setHoverIdx(null);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) onChange({ target: { value: "", name } });
  };

  return (
    <div
      className={`dropdown${focused ? " dropdown--focused" : ""}${open ? " dropdown--open" : ""}${error ? " dropdown--error" : ""}${disabled ? " dropdown--disabled" : ""}${dense ? " dropdown--dense" : ""}${className ? " " + className : ""}`}
      ref={wrapRef}
    >
      {label && (
        <label className="dropdown__label" htmlFor={inputId}>
          {label}
          {required && <span className="dropdown__required">*</span>}
        </label>
      )}
      <div
        id={inputId}
        className="dropdown__trigger"
        onClick={toggleOpen}
        tabIndex={0}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleOpen();
          }
          if (e.key === "Escape") setOpen(false);
        }}
      >
        <span
          className={`dropdown__value${!selected ? " dropdown__value--placeholder" : ""}`}
        >
          {displayText}
        </span>
        <div className="dropdown__actions">
          {clearable && value && (
            <button
              type="button"
              className="dropdown__clear"
              onClick={handleClear}
              tabIndex={-1}
              aria-label="Clear selection"
            >
              <IconClose size={14} />
            </button>
          )}
          <span
            className={`dropdown__arrow${open ? " dropdown__arrow--open" : ""}`}
          >
            <IconChevronDown size={14} />
          </span>
        </div>
      </div>
      {open && (
        <div
          className="dropdown__menu"
          role="listbox"
          style={
            isGrid
              ? {
                  right: "auto",
                  width: "max-content",
                  maxWidth: "calc(100vw - 24px)",
                  ...(gridMinWidth ? { minWidth: gridMinWidth } : {}),
                }
              : undefined
          }
        >
          {searchable && (
            <div
              className="dropdown__search"
              style={{ padding: "var(--sp-1) var(--sp-2)" }}
            >
              <span className="dropdown__search-icon">
                <IconSearch size={12} />
              </span>
              <input
                ref={searchRef}
                type="text"
                className="dropdown__search-input"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                style={{ padding: "var(--sp-1) 0", fontSize: "var(--fs-sm)" }}
              />
            </div>
          )}
          {isGrid ? (
            <div
              className="dropdown__grid-scroll"
              style={{ overflowX: "auto", overscrollBehavior: "contain" }}
            >
              <div
                className="dropdown__grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: gridTemplate,
                  width: "max-content",
                  minWidth: "100%",
                  alignItems: "center",
                  maxHeight: gridMaxHeight,
                  overflowY: "auto",
                }}
              >
                {columns.map((c) => (
                  <div
                    key={c.key}
                    role="presentation"
                    className="dropdown__grid-header"
                    style={{
                      position: "sticky",
                      top: 0,
                      zIndex: 2,
                      alignSelf: "stretch",
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "2px var(--sp-3)",
                      fontSize: "var(--fs-sm)",
                      fontWeight: "var(--fw-medium)",
                      color: "var(--text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: "var(--surface-alt)",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {c.label}
                  </div>
                ))}
                {filtered.length > 0 ? (
                  filtered.map((opt, idx) => {
                    const rowKey = opt?.[optionValue] ?? idx;
                    const isSelected = opt?.[optionValue] === value;
                    const isHover = hoverIdx === idx;
                    const rowStyle = {
                      color:
                        isSelected || isHover
                          ? "var(--text-primary)"
                          : "var(--text-secondary)",
                      background:
                        isSelected || isHover
                          ? "var(--surface-alt)"
                          : "transparent",
                      borderBottom:
                        idx === filtered.length - 1
                          ? "none"
                          : "1px dotted var(--border)",
                    };
                    return (
                      <div
                        key={rowKey}
                        role="option"
                        aria-selected={isSelected}
                        tabIndex={0}
                        className="dropdown__grid-row"
                        style={{ display: "contents" }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSelect(opt);
                          }
                        }}
                        onMouseEnter={() => setHoverIdx(idx)}
                        onMouseLeave={() => setHoverIdx(null)}
                        onClick={() => handleSelect(opt)}
                      >
                        {columns.map((c, ci) => {
                          const val = opt?.[c.key];
                          const isNum = typeof val === "number";
                          const cellText = formatCellValue(val);
                          const isFirst = ci === 0;
                          return (
                            <div
                              key={`${rowKey}:${c.key}`}
                              title={cellText}
                              className="dropdown__grid-cell"
                              style={{
                                minWidth: 0,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                padding: "2px var(--sp-3)",
                                fontSize: "var(--fs-sm)",
                                fontWeight: isSelected
                                  ? "var(--fw-medium)"
                                  : "normal",
                                textAlign: isNum ? "right" : "left",
                                fontVariantNumeric: isNum
                                  ? "tabular-nums"
                                  : "normal",
                                cursor: "pointer",
                                transition:
                                  "background var(--transition-fast), color var(--transition-fast)",
                                ...rowStyle,
                                ...(isFirst
                                  ? {
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "var(--sp-2)",
                                    }
                                  : {}),
                              }}
                            >
                              {isFirst && (
                                <span
                                  aria-hidden="true"
                                  style={{
                                    flex: "0 0 12px",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    color: "var(--primary)",
                                  }}
                                >
                                  {isSelected && <IconCheck size={12} />}
                                </span>
                              )}
                              <span
                                style={
                                  isFirst
                                    ? {
                                        minWidth: 0,
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        textAlign: isNum ? "right" : "left",
                                      }
                                    : undefined
                                }
                              >
                                {cellText}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })
                ) : (
                  <div
                    className="dropdown__empty"
                    style={{ gridColumn: "1 / -1", padding: "var(--sp-4) var(--sp-3)" }}
                  >
                    No results found
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="dropdown__options">
              {filtered.length > 0 ? (
                filtered.map((opt, idx) => (
                  <button
                    key={opt?.[optionValue] ?? idx}
                    type="button"
                    className={`dropdown__option${opt?.[optionValue] === value ? " dropdown__option--selected" : ""}`}
                    role="option"
                    aria-selected={opt?.[optionValue] === value}
                    onClick={() => handleSelect(opt)}
                  >
                    {opt?.[optionValue] === value && (
                      <span
                        className="dropdown__check"
                        style={{ marginLeft: 0, flex: "0 0 auto" }}
                      >
                        <IconCheck size={14} />
                      </span>
                    )}
                    {opt?.icon && (
                      <span className="dropdown__option-icon">{opt.icon}</span>
                    )}
                    <span>{opt?.[optionLabel] ?? ""}</span>
                  </button>
                ))
              ) : (
                <div className="dropdown__empty">No results found</div>
              )}
            </div>
          )}
        </div>
      )}
      {error && <span className="dropdown__error">{error}</span>}
    </div>
  );
}
