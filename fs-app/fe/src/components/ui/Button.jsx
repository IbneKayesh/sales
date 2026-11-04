export function Button({
  variant = "secondary",
  size = "md",
  iconOnly = false,
  loading = false,
  className = "",
  type = "button",
  disabled,
  children,
  ...props
}) {
  const classes = ["btn", `btn--${variant}`];

  if (size === "sm") classes.push("btn--sm");
  if (iconOnly) classes.push("btn--icon");
  if (className) classes.push(className);

  return (
    <button
      type={type}
      className={classes.join(" ")}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <span className="spinner" aria-hidden="true" /> : null}
      {children}
    </button>
  );
}
