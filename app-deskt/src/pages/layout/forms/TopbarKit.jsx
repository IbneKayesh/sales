import "./TopbarKit.css";

const TopbarKit = ({
  icon,
  title,
  breadcrumb,
  isMaximized,
  onDragStart,
  onClose,
  onMinimize,
  onToggleMaximize,
  background,
  actions,
}) => {
  return (
    <div
      className="form-topbar"
      style={{ background: background || "var(--win11-panel)" }}
    >
      <div className="form-topbar-left">
        <button
          className={`btn-default ${!actions.includes("SYS_BTN_ADD") ? "hidden" : ""}`}
          aria-label="Add"
          type="button"
        >
          Add
        </button>
        <button
          className={`btn-default ${!actions.includes("SYS_BTN_SAVE") ? "hidden" : ""}`}
          aria-label="Save"
          type="button"
        >
          Save
        </button>
        <button
          className={`btn-default ${!actions.includes("SYS_BTN_SEARCH") ? "hidden" : ""}`}
          aria-label="Search"
          type="button"
        >
          Search
        </button>
      </div>
      <button
        className="form-topbar-drag"
        onMouseDown={onDragStart}
        type="button"
        title="Drag window"
      >
        {icon && (
          <span className="form-icon">
            <img
              src={"../src/assets/icons/" + icon}
              alt="page icon"
              height="16"
              width="16"
            />
          </span>
        )}
        <span className="form-title">{title}</span>
        {breadcrumb && (
          <span className="form-breadcrumb" title={breadcrumb}>
            [{breadcrumb}]
          </span>
        )}
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
