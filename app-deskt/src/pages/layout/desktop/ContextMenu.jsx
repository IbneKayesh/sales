import "./ContextMenu.css";

const ContextMenu = ({ x, y, closing, onClose }) => {
  return (
    <div
      className={`context-menu ${closing ? "closing" : ""}`}
      style={{ "--menu-x": `${x}px`, "--menu-y": `${y}px` }}
      onClick={(e) => e.stopPropagation()}
      onContextMenu={(e) => e.stopPropagation()}
    >
      <div className="context-menu-item" onClick={onClose}>Refresh</div>
      <div className="context-menu-item" onClick={onClose}>Properties</div>
    </div>
  );
};

export default ContextMenu;
