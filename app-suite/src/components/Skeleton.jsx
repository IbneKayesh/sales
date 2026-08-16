/**
 * Loading skeleton placeholder — a shimmering block used while content loads.
 * Renders a <span> with the shared `.skeleton` shimmer class; size is set via
 * the `width` / `height` props (defaults to a small text-sized bar).
 */
export default function Skeleton({
  width = "100%",
  height = 14,
  radius = 6,
  style,
  className = "",
  ...rest
}) {
  return (
    <span
      className={`skeleton${className ? " " + className : ""}`}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
      {...rest}
    />
  );
}
