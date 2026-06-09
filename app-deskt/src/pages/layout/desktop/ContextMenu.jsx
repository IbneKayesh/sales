import "./ContextMenu.css";

const ContextMenu = ({
  x,
  y,
  closing,
  visibleWidgets,
  onToggleWidget,
  onProperties,
  onClose,
  onRefresh,
  onResetDesktop,
}) => {
  return (

    <div
      className={`context-menu ${closing ? "closing" : ""}`}
      style={{ "--menu-x": `${x}px`, "--menu-y": `${y}px` }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <button
        className="context-menu-item"
        onClick={() => {
          onRefresh?.();
          onClose();
        }}
        type="button"
      >
        Refresh
      </button>
      <button
        className="context-menu-item"
        onClick={() => onToggleWidget("analogClock")}
        type="button"
      >
        {visibleWidgets.analogClock ? "Remove analog clock" : "Add analog clock"}
      </button>
      <button
        className="context-menu-item"
        onClick={() => onToggleWidget("digitalClock")}
        type="button"
      >
        {visibleWidgets.digitalClock
          ? "Remove digital clock"
          : "Add digital clock"}
      </button>
      <hr style={{ margin: "4px 0", border: "none", borderTop: "1px solid var(--win11-border)" }} />
      <button
        className="context-menu-item"
        onClick={onProperties}
        type="button"
      >
        Properties
      </button>
      <button
        className="context-menu-item danger"
        onClick={() => {
          onResetDesktop?.();
          onClose();
        }}
        type="button"
      >
        Reset Desktop
      </button>
    </div>
  );
};

export default ContextMenu;
