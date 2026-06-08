import "./TaskViewFlyout.css";

const TaskViewFlyout = ({ windows, onRestore }) => {
  return (
    <div className="task-view-flyout">
      <div className="task-view-flyout-header">Task view</div>
      <div className="task-view-flyout-grid">
        {windows.length === 0 && (
          <div className="task-view-flyout-empty">No open windows</div>
        )}
        {windows.map((item) => (
          <button
            key={item.id}
            className="task-view-flyout-item"
            onClick={() => onRestore(item)}
            type="button"
          >
            <span>{item.name}</span>
            <small>{item.isMinimized ? "Minimized" : "Open"}</small>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TaskViewFlyout;
