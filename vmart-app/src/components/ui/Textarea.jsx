/**
 * Textarea – Reusable textarea component.
 * Accepts all standard textarea props + className merging.
 */
import { forwardRef } from "react";

const Textarea = forwardRef(function Textarea(
  { className = "", ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      className={`ui-textarea ${className}`.trim()}
      {...props}
    />
  );
});

export default Textarea;
