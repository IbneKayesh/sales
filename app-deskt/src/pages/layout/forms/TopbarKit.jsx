import "./TopbarKit.css";

const TopbarKit = ({
  icon,
  title,
  isMaximized,
  onClose,
  onDragStart,
  onMinimize,
  onToggleMaximize,
  background,
}) => {
  return (
    <div className="form-topbar" style={{ background: background || "var(--win11-panel)" }}>
      <div className="form-topbar-left">
        <button className="btn-default" aria-label="Add" type="button">
          Add
        </button>
        <button className="btn-default" aria-label="Save" type="button">
          Save
        </button>
        <button className="btn-default" aria-label="Search" type="button">
          Search
        </button>
      </div>
      <button
        className="form-topbar-drag"
        onMouseDown={onDragStart}
        type="button"
        title="Drag window"
      >
        {icon && <span className="form-icon">{icon}</span>}
        <span className="form-title">{title}</span>
      </button>
      <div className="form-topbar-right">
        <button
          className="btn-default icon-button"
          aria-label="Minimize"
          type="button"
          onClick={onMinimize}
          title="Minimize"
        >
          ━
        </button>
        <button
          className="btn-default icon-button"
          aria-label={isMaximized ? "Restore" : "Maximize"}
          type="button"
          onClick={onToggleMaximize}
          title={isMaximized ? "Restore down" : "Maximize"}
        >
          {isMaximized ? "❐" : "🗖"}
        </button>
        <button
          className="btn-default icon-button close-button"
          aria-label="Close"
          type="button"
          onClick={onClose}
          title="Close"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default TopbarKit;
