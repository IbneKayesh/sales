import { useState, useRef, useEffect, useLayoutEffect, useCallback, useId } from "react";
import { createPortal } from "react-dom";
import { IconClose, IconChevronDown, IconCheck } from "../icons";

/* ------------------------------------------------------------------ */
/* MultiSelect                                                         */
/*                                                                     */
/* Same look and API as Dropdown, but every option toggles on/off so   */
/* the user can pick several. The value is a comma-separated string    */
/* (the shape it is stored in), so it drops into a form unchanged:     */
/*   value="General,Accounts"  onChange -> "General,Accounts,FMCG"     */
/* ------------------------------------------------------------------ */

export default function MultiSelect({
  label,
  options = [],
  value = "",
  onChange,
  placeholder = "Select...",
  disabled = false,
  required = false,
  name,
  error,
  className = "",
  optionLabel = "label",
  optionValue = "value",
}) {
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState(false);
  const wrapRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const fallbackId = useId();
  const inputId = name || fallbackId;
  const [menuStyle, setMenuStyle] = useState({});

  const selected = (Array.isArray(value) ? value : String(value ?? "").split(","))
    .map((v) => v.trim())
    .filter(Boolean);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    if (rect.width === 0 && rect.height === 0) return;
    if (rect.bottom < 0 || rect.top > viewportHeight) {
      setOpen(false);
      return;
    }

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUp = spaceBelow < 250 && spaceAbove > spaceBelow;

    let left = rect.left;
    const targetWidth = Math.max(200, rect.width);
    if (left + targetWidth > viewportWidth - 12) {
      left = Math.max(12, viewportWidth - 12 - targetWidth);
    }

    setMenuStyle({
      position: "fixed",
      zIndex: 1200,
      margin: 0,
      top: openUp ? "auto" : `${rect.bottom + 4}px`,
      bottom: openUp ? `${Math.max(4, viewportHeight - rect.top + 4)}px` : "auto",
      left: `${left}px`,
      right: "auto",
      width: `${rect.width}px`,
      minWidth: `${targetWidth}px`,
      maxHeight: `${Math.max(120, (openUp ? spaceAbove : spaceBelow) - 16)}px`,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();

    const handleScroll = (e) => {
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      updatePosition();
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    function handleClick(e) {
      const inWrap = wrapRef.current && wrapRef.current.contains(e.target);
      const inMenu = menuRef.current && menuRef.current.contains(e.target);
      if (!inWrap && !inMenu) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const emit = (next) => {
    if (onChange) {
      onChange({ target: { value: next.join(","), name } });
    }
  };

  const toggleOpen = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };

  const handleToggle = (opt) => {
    const v = String(opt?.[optionValue] ?? "");
    if (!v) return;
    emit(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    emit([]);
  };

  const selectedLabels = selected
    .map(
      (v) =>
        options.find((opt) => String(opt?.[optionValue]) === v)?.[optionLabel] ?? v,
    )
    .join(", ");

  return (
    <div
      className={`dropdown${focused ? " dropdown--focused" : ""}${open ? " dropdown--open" : ""}${error ? " dropdown--error" : ""}${disabled ? " dropdown--disabled" : ""}${className ? " " + className : ""}`}
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
        ref={triggerRef}
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
          className={`dropdown__value${selected.length === 0 ? " dropdown__value--placeholder" : ""}`}
          title={selectedLabels || undefined}
        >
          {selected.length > 0 ? selectedLabels : placeholder}
        </span>
        <div className="dropdown__actions">
          {selected.length > 0 && (
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
          <span className={`dropdown__arrow${open ? " dropdown__arrow--open" : ""}`}>
            <IconChevronDown size={14} />
          </span>
        </div>
      </div>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={menuRef}
            className="dropdown__menu"
            role="listbox"
            aria-multiselectable="true"
            style={menuStyle}
          >
            <div className="dropdown__options">
              {options.length > 0 ? (
                options.map((opt, idx) => {
                  const v = String(opt?.[optionValue] ?? "");
                  const isSelected = selected.includes(v);
                  return (
                    <button
                      key={v || idx}
                      type="button"
                      className={`dropdown__option${isSelected ? " dropdown__option--selected" : ""}`}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleToggle(opt)}
                    >
                      {isSelected && (
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
                  );
                })
              ) : (
                <div className="dropdown__empty">No options</div>
              )}
            </div>
          </div>,
          document.body,
        )}
      {error && <span className="dropdown__error">{error}</span>}
    </div>
  );
}
