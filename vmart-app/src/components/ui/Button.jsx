/**
 * Button – Reusable button component.
 * Variants: primary, secondary, ghost, icon, fab, badge
 * Accepts all standard button props + className merging.
 */
import { forwardRef } from "react";

const variantClasses = {
  primary: "ui-btn ui-btn-primary",
  secondary: "ui-btn ui-btn-secondary",
  ghost: "ui-btn ui-btn-ghost",
  icon: "ui-btn-icon",
  fab: "ui-btn-fab",
  badge: "ui-badge",
};

const variantExtraStyles = {
  badge: { cursor: "pointer", position: "relative" },
};

const Button = forwardRef(function Button(
  { variant = "primary", className = "", style, children, ...props },
  ref,
) {
  const baseClass = variantClasses[variant] || variantClasses.primary;
  const extraStyle = variantExtraStyles[variant];
  return (
    <button
      ref={ref}
      className={`${baseClass} ${className}`.trim()}
      style={extraStyle ? { ...extraStyle, ...style } : style}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
