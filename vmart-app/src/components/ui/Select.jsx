/**
 * Select – Reusable dropdown select with wrapper and arrow icon.
 * Renders <div className="ui-select-wrapper"><select className="ui-select"...>...
 */
import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { className = "", wrapperClassName = "", children, ...props },
  ref,
) {
  return (
    <div className={`ui-select-wrapper ${wrapperClassName}`.trim()}>
      <select ref={ref} className={`ui-select ${className}`.trim()} {...props}>
        {children}
      </select>
    </div>
  );
});

export default Select;
