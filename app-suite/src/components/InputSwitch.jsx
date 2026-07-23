import { useState } from "react";

export default function InputSwitch({
  label,
  checked = false,
  onChange,
  disabled = false,
  id,
  name,
  dense = false,
  className = "",
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const inputId = id || name || `sw-${Math.random().toString(36).slice(2, 8)}`;

  return (
    <div
      className={`input-switch${focused ? " input-switch--focused" : ""}${disabled ? " input-switch--disabled" : ""}${dense ? " input-switch--dense" : ""}${className ? " " + className : ""}`}
    >
      <label className="input-switch__label" htmlFor={inputId}>
        <input
          id={inputId}
          type="checkbox"
          className="input-switch__input"
          checked={checked}
          disabled={disabled}
          onChange={onChange}
          name={name}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        <span className="input-switch__track">
          <span className="input-switch__thumb" aria-hidden="true" />
        </span>
        {label && <span className="input-switch__text">{label}</span>}
      </label>
    </div>
  );
}
