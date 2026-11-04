export function Badge({ tone = "neutral", dot = false, icon: Icon, className = "", children }) {
  const classes = ["badge", `badge--${tone}`];

  if (className) classes.push(className);

  return (
    <span className={classes.join(" ")}>
      {Icon ? <Icon size={12} aria-hidden="true" /> : null}
      {!Icon && dot ? <span className="badge__dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
