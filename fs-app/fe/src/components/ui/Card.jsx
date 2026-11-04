export function Card({ className = "", children }) {
  return <section className={`card${className ? ` ${className}` : ""}`}>{children}</section>;
}

export function CardHeader({ title, icon: Icon, badge, actions }) {
  return (
    <header className="card__header">
      <h2 className="card__title">
        {Icon ? (
          <span className="card__title-icon">
            <Icon size={15} aria-hidden="true" />
          </span>
        ) : null}
        {title}
      </h2>
      <div className="card__actions">
        {badge}
        {actions}
      </div>
    </header>
  );
}

export function CardBody({ className = "", children }) {
  return <div className={`card__body${className ? ` ${className}` : ""}`}>{children}</div>;
}

export function CardFooter({ children }) {
  return <footer className="card__footer">{children}</footer>;
}
