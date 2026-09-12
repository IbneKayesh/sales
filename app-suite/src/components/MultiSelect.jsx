import { useState, useRef, useEffect, useId } from "react";
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
  const fallbackId = useId();
  const inputId = name || fallbackId;

  const selected = (Array.isArray(value) ? value : String(value ?? "").split(","))
    .map((v) => v.trim())
    .filter(Boolean);

  useEffect(() => {
    function handleClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
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
      {open && (
        <div className="dropdown__menu" role="listbox" aria-multiselectable="true">
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
        </div>
      )}
      {error && <span className="dropdown__error">{error}</span>}
    </div>
  );
}
