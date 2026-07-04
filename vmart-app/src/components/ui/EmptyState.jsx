import "./shared.css";

const EmptyState = ({ icon = "🔍", title, message, action }) => (
  <div className="ui-empty-state">
    <div className="ui-empty-icon">{icon}</div>
    {title && <h3 className="ui-empty-title">{title}</h3>}
    {message && <p className="ui-empty-text">{message}</p>}
    {action}
  </div>
);

export default EmptyState;
