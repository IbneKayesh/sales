export function Progress({ value = 0, max = 100, tone = "brand", label }) {
  const safeMax = max > 0 ? max : 100;
  const safeValue = Math.min(Math.max(value, 0), safeMax);

  return (
    <progress
      className={`progress progress--${tone}`}
      value={safeValue}
      max={safeMax}
      aria-label={label}
    />
  );
}
