import "./WindowFlyout.css";

const WindowFlyout = ({
  windows,
  onRestore,
  onCloseAll,
  onMinimizeAll,
  onMaximizeAll,
  onTileWindows,
}) => {
  // Calculate grid columns based on window count
  const getGridColumns = (count) => {
    if (count === 0) return 1;
    if (count === 1) return 1;
    if (count === 2) return 2;
    if (count === 3) return 3;
    if (count === 4) return 2;
    if (count === 5) return 3;
    if (count === 6) return 3;
    if (count <= 9) return 3;
    if (count <= 12) return 4;
    return Math.ceil(Math.sqrt(count));
  };

  const gridColumns = getGridColumns(windows.length);

  return (
    <div className="window-flyout">
      <div className="window-flyout-header">Windows ({windows.length})</div>
      <div className="window-flyout-actions">
        <button className="btn-default" onClick={onMinimizeAll} type="button">
          Minimize all
        </button>
        <button className="btn-default" onClick={onMaximizeAll} type="button">
          Maximize all
        </button>
        <button className="btn-default" onClick={onTileWindows} type="button">
          Tile
        </button>
        <button className="btn-default" onClick={onCloseAll} type="button">
          Close all
        </button>
      </div>
      <div className="window-flyout-list" style={{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }}>
        {windows.length === 0 && (
          <div className="window-flyout-empty">No open windows</div>
        )}
        {windows.map((item) => (
          <button
            key={item.id}
            className="window-flyout-item"
            onClick={() => onRestore(item)}
            type="button"
          >
            <span className="window-name">{item.name}</span>
            <span className="window-flyout-state">
              {item.isMinimized ? "Minimized" : "Open"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WindowFlyout;
