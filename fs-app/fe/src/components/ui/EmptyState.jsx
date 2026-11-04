export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty">
      {Icon ? (
        <span className="empty__icon">
          <Icon size={20} aria-hidden="true" />
        </span>
      ) : null}
      <p className="empty__title">{title}</p>
      {description ? <p className="empty__text">{description}</p> : null}
      {action ? <div className="empty__action">{action}</div> : null}
    </div>
  );
}
