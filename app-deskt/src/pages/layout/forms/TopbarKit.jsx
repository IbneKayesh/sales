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
          <img
            src="../src/assets/icons/add.png"
            alt="add"
            height="18"
            width="18"
            style={{ marginRight: "4px" }}
          />
          Add
        </button>
        <button
          className={`btn-default ${!actions.includes("SYS_BTN_SAVE") ? "hidden" : ""}`}
          aria-label="Save"
          type="button"
        >
          <img
            src="../src/assets/icons/save.png"
            alt="save"
            height="18"
            width="18"
            style={{ marginRight: "4px" }}
          />
          Save
        </button>
        <button
          className={`btn-default ${!actions.includes("SYS_BTN_SEARCH") ? "hidden" : ""}`}
          aria-label="Search"
          type="button"
        >
          <img
            src="../src/assets/icons/search.png"
            alt="search"
            height="18"
            width="18"
            style={{ marginRight: "4px" }}
          />
          Search
        </button>
      </div>
      <button
        className="form-topbar-drag"
        onMouseDown={onDragStart}
        type="button"
        title="Drag window"
      >
        {breadcrumb && (
          <span className="form-breadcrumb" title={breadcrumb}>
            {breadcrumb}
          </span>
        )}
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
