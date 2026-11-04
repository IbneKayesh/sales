export function StatCard({ icon: Icon, tone = "brand", label, value, hint, valueTone = "", onClick }) {
  const className = `stat-card${onClick ? " stat-card--interactive" : ""}`;
  const content = (
    <>
      <span className="stat-card__top">
        <span className={`stat-card__icon stat-card__icon--${tone}`}>
          {Icon ? <Icon size={15} aria-hidden="true" /> : null}
        </span>
        <span className="stat-card__label">{label}</span>
      </span>
      <span className={`stat-card__value${valueTone ? ` stat-card__value--${valueTone}` : ""}`}>
        {value}
      </span>
      {hint ? <span className="stat-card__hint">{hint}</span> : null}
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={className} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
