import { useRef, useEffect } from "react";
import { IconCheckboxCheck, IconCheckboxIndeterminate } from "../icons";

export default function Checkbox({
  label,
  checked = false,
  indeterminate = false,
  disabled = false,
  onChange,
  id,
  name,
  className = "",
  ...rest
}) {
  const ref = useRef(null);
  const inputId = id || name || `cb-${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <label
      className={`checkbox${disabled ? " checkbox--disabled" : ""}${className ? " " + className : ""}`}
      htmlFor={inputId}
    >
      <span className="checkbox__input-wrap">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className="checkbox__input"
          checked={checked && !indeterminate}
          disabled={disabled}
          onChange={onChange}
          name={name}
          {...rest}
        />
        <span className="checkbox__visual" aria-hidden="true">
          {indeterminate ? (
            <IconCheckboxIndeterminate size={10} />
          ) : (
            <IconCheckboxCheck size={10} />
          )}
        </span>
      </span>
      {label && <span className="checkbox__label">{label}</span>}
    </label>
  );
}
