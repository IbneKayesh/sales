/**
 * Input – Reusable input field for text, tel, password, number, search, etc.
 * Accepts all standard input props + className merging.
 */
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { className = "", type = "text", ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={`ui-input ${className}`.trim()}
      {...props}
    />
  );
});

export default Input;
